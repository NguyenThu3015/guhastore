
package com.guhastore.service_orders.dto;

import java.math.BigDecimal;

public interface OrderSummaryDataPoint {
    String getTimePeriod();
    BigDecimal getTotalRevenue();
    Long getOrderCount();
    Long getTotalQuantitySold();
}