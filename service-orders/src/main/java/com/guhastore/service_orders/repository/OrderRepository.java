package com.guhastore.service_orders.repository;

import com.guhastore.service_orders.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.guhastore.service_orders.dto.OrderStatusCountDto; 
import com.guhastore.service_orders.dto.OrderSummaryDataPoint;

import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal; 
import java.time.LocalDateTime; 
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByOrderByOrderDateDesc();
    @Query("SELECT new com.guhastore.service_orders.dto.OrderStatusCountDto(o.status, COUNT(o)) FROM Order o GROUP BY o.status")
    List<OrderStatusCountDto> countOrdersByStatus();

    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal getRevenueBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    // Dashboard: Đếm đơn hàng MỚI (PENDING)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING'")
    Long countPendingOrders();
    @Query(value = """
        SELECT
            t.timePeriod,
            SUM(t.revenueForOrder) AS totalRevenue,
            COUNT(t.orderId) AS orderCount,
            SUM(t.quantityForOrder) AS totalQuantitySold
        FROM (
            SELECT
                DATE_FORMAT(o.order_date, :format) AS timePeriod,
                o.id AS orderId,
                o.total_amount AS revenueForOrder,
                SUM(oi.quantity) AS quantityForOrder
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status = 'DELIVERED'
              AND o.order_date BETWEEN :startDate AND :endDate
            GROUP BY o.id, o.total_amount, o.order_date 
        ) AS t
        GROUP BY t.timePeriod 
        ORDER BY t.timePeriod ASC
    """, nativeQuery = true)
    List<OrderSummaryDataPoint> findOrderSummaryByPeriod(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("format") String format 
    );
    List<Order> findByStatusOrderByOrderDateDesc(String status);
}