package com.guhastore.service_orders.controller;

import com.guhastore.service_orders.model.Order;
import com.guhastore.service_orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(required = false) String status
    ) {
        List<Order> orders;

        if (status != null && !status.trim().isEmpty()) {
            orders = orderRepository.findByStatusOrderByOrderDateDesc(status);
        } else {
            orders = orderRepository.findAllByOrderByOrderDateDesc();
        }

        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody String status) {

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOpt.get();
        
        String cleanedStatus = status.replaceAll("\"", "");
        order.setStatus(cleanedStatus); 
        
        Order savedOrder = orderRepository.save(order);

        return ResponseEntity.ok(savedOrder);
    }
}