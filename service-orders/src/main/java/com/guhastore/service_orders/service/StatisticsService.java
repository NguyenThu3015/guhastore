// File: src/main/java/com/guhastore/service_orders/service/StatisticsService.java
package com.guhastore.service_orders.service;

import com.guhastore.service_orders.dto.OrderSummaryDataPoint;
import com.guhastore.service_orders.dto.OrderSummaryResponse;
import com.guhastore.service_orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;

    public OrderSummaryResponse getOrderSummaryStatistics(String period, LocalDate startDate, LocalDate endDate, String groupBy) {
        
        if (startDate == null || endDate == null) {
            LocalDate today = LocalDate.now();
            switch (period) {
                case "last7days":
                    startDate = today.minusDays(6);
                    endDate = today;
                    break;
                case "last30days":
                    startDate = today.minusDays(29);
                    endDate = today;
                    break;
                case "thisMonth":
                    startDate = today.withDayOfMonth(1);
                    endDate = today;
                    break;
                case "lastMonth":
                    LocalDate lastMonth = today.minusMonths(1);
                    startDate = lastMonth.withDayOfMonth(1);
                    endDate = lastMonth.with(TemporalAdjusters.lastDayOfMonth());
                    break;
                case "thisQuarter":
                    LocalDate firstDayOfQuarter = today.with(today.getMonth().firstMonthOfQuarter()).with(TemporalAdjusters.firstDayOfMonth());
                    startDate = firstDayOfQuarter;
                    endDate = today;
                    break;
                case "thisYear":
                    startDate = today.withDayOfYear(1);
                    endDate = today;
                    break;
                default:
                    
                    startDate = today.minusDays(6);
                    endDate = today;
                    break;
            }
            if (groupBy == null || groupBy.isBlank()) {
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                
                if (daysBetween <= 45) { 
                    groupBy = "day";
                } else if (daysBetween <= 180) { 
                    groupBy = "week";
                } else { 
                    groupBy = "month";
                }
            }
        }

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        String mysqlFormat = switch (groupBy) {
            case "week" -> "%Y-%u"; 
            case "month" -> "%Y-%m";
            default -> "%Y-%m-%d"; 
        };

         List<OrderSummaryDataPoint> dataPoints = orderRepository.findOrderSummaryByPeriod(startDateTime, endDateTime, mysqlFormat);

        BigDecimal totalRevenue = dataPoints.stream().map(OrderSummaryDataPoint::getTotalRevenue).reduce(BigDecimal.ZERO, BigDecimal::add);
        Long totalOrderCount = dataPoints.stream().mapToLong(OrderSummaryDataPoint::getOrderCount).sum();
        Long totalQuantitySold = dataPoints.stream().mapToLong(OrderSummaryDataPoint::getTotalQuantitySold).sum();

        OrderSummaryResponse.Summary summary = OrderSummaryResponse.Summary.builder()
            .totalRevenue(totalRevenue)
            .totalOrderCount(totalOrderCount)
            .totalQuantitySold(totalQuantitySold)
            .startDate(startDate.toString())
            .endDate(endDate.toString())
            .build();

        return OrderSummaryResponse.builder()
            .summary(summary)
            .dataPoints(dataPoints)
            .build();
    }
}