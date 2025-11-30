package com.guhastore.service_orders.controller;

import com.guhastore.service_orders.model.Order;
import com.guhastore.service_orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = (Long) authentication.getPrincipal();

        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(currentUserId);

        return ResponseEntity.ok(orders);
    }
    @PutMapping("/{orderId}/confirm-delivery")
    public ResponseEntity<Order> confirmDelivery(@PathVariable Long orderId) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = (Long) authentication.getPrincipal();

    Optional<Order> orderOpt = orderRepository.findById(orderId);
    if (orderOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Order order = orderOpt.get();

    if (!order.getUserId().equals(currentUserId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    if (!order.getStatus().equals("SHIPPED")) { 
        return ResponseEntity.badRequest().build();
    }

    order.setStatus("DELIVERED");
    Order savedOrder = orderRepository.save(order);

    return ResponseEntity.ok(savedOrder);
}
}