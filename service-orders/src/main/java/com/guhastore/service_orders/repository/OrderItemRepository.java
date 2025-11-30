package com.guhastore.service_orders.repository;

import com.guhastore.service_orders.dto.TopProductDto;
import com.guhastore.service_orders.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.guhastore.service_orders.dto.TopProductDto; 
import org.springframework.data.jpa.repository.Query; 
import java.util.List; 
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT new com.guhastore.service_orders.dto.TopProductDto(oi.productId, SUM(oi.quantity)) " +
       "FROM OrderItem oi " +
       "GROUP BY oi.productId " +
       "ORDER BY SUM(oi.quantity) DESC " +
       "LIMIT 5") 
List<TopProductDto> findTop5SellingProducts();
}