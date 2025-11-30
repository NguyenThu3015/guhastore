package com.guhastore.service_orders.controller;

import com.guhastore.service_orders.dto.OrderStatusCountDto;
import com.guhastore.service_orders.dto.OrderSummaryResponse;
import com.guhastore.service_orders.repository.OrderItemRepository;
import com.guhastore.service_orders.repository.OrderRepository;
import com.guhastore.service_orders.service.StatisticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.guhastore.service_orders.dto.TopProductDto;
import com.guhastore.service_orders.repository.OrderItemRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    @Autowired
    private OrderRepository orderRepository;
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }
    private final StatisticsService statisticsService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping("/order-counts")
    public ResponseEntity<List<OrderStatusCountDto>> getOrderCountsByStatus() {
        return ResponseEntity.ok(orderRepository.countOrdersByStatus());
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, BigDecimal>> getRevenue(
            @RequestParam("start") LocalDateTime startDate,
            @RequestParam("end") LocalDateTime endDate) {
        
        BigDecimal revenue = orderRepository.getRevenueBetweenDates(startDate, endDate);
        return ResponseEntity.ok(Map.of("totalRevenue", revenue != null ? revenue : BigDecimal.ZERO));
    }

    @GetMapping("/pending-count")
    public ResponseEntity<Map<String, Long>> getPendingOrderCount() {
        return ResponseEntity.ok(Map.of("pendingCount", orderRepository.countPendingOrders()));
    }
    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductDto>> getTopProducts() {
        return ResponseEntity.ok(orderItemRepository.findTop5SellingProducts());
    }
    @GetMapping("/order-summary")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<OrderSummaryResponse> getOrderSummary(
            @RequestParam(required = false, defaultValue = "last7days") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String groupBy) {
    
        OrderSummaryResponse stats = statisticsService.getOrderSummaryStatistics(period, startDate, endDate, groupBy);
        return ResponseEntity.ok(stats);
    }
}