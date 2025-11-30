// File: src/main/java/com/guhastore/service_orders/dto/OrderSummaryResponse.java
package com.guhastore.service_orders.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderSummaryResponse {
    private Summary summary;
    private List<OrderSummaryDataPoint> dataPoints;

    @Data
    @Builder
    public static class Summary {
        private BigDecimal totalRevenue;
        private Long totalOrderCount;
        private Long totalQuantitySold;
        private String startDate;
        private String endDate;
    }
}