package com.guhastore.service_orders.controller;

import com.guhastore.service_orders.dto.CheckoutDto;
import com.guhastore.service_orders.dto.StockRequestDto;
import com.guhastore.service_orders.model.CartItem;
import com.guhastore.service_orders.model.Order;
import com.guhastore.service_orders.model.OrderItem;
import com.guhastore.service_orders.repository.CartItemRepository;
import com.guhastore.service_orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate; // <-- TIÊM (INJECT) RESTTEMPLATE

    // Định nghĩa URL của service-products
    private final String STOCK_SERVICE_URL = "http://localhost:8081/api/v1/internal/stock";

    @PostMapping
    @Transactional 
    public ResponseEntity<Order> checkout(@RequestBody CheckoutDto checkoutDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = (Long) authentication.getPrincipal();

        List<CartItem> cartItems = cartItemRepository.findByUserId(currentUserId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().build(); 
        }

        try {
            StockRequestDto stockRequest = new StockRequestDto();
            stockRequest.setItems(
                cartItems.stream().map(cartItem -> {
                    StockRequestDto.StockItemDto itemDto = new StockRequestDto.StockItemDto();
                    itemDto.setProductId(cartItem.getProductId());
                    itemDto.setQuantity(cartItem.getQuantity());
                    return itemDto;
                }).collect(Collectors.toList())
            );

            HttpEntity<StockRequestDto> requestEntity = new HttpEntity<>(stockRequest);
            ResponseEntity<Void> stockResponse = restTemplate.postForEntity(
                STOCK_SERVICE_URL + "/reserve", 
                requestEntity, 
                Void.class
            );

            if (stockResponse.getStatusCode() != HttpStatus.OK) {
                throw new RuntimeException("Lỗi từ Stock Service, không thể đặt hàng (Hết hàng).");
            }

        } catch (Exception e) {
            throw new RuntimeException("Không thể trừ tồn kho (API /reserve): " + e.getMessage());
        }

        Order newOrder = new Order();
        newOrder.setUserId(currentUserId);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setStatus("PENDING"); 
        newOrder.setShippingAddress(checkoutDto.getShippingAddress());
        newOrder.setCustomerName(checkoutDto.getCustomerName());
        newOrder.setCustomerPhone(checkoutDto.getCustomerPhone());

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setQuantity(cartItem.getQuantity());
            
            double priceValue = cartItem.getProductPrice() != null ? cartItem.getProductPrice().doubleValue() : 0.0;
            orderItem.setPrice(BigDecimal.valueOf(priceValue));
            
            orderItem.setOrder(newOrder); 
            return orderItem;
        }).collect(Collectors.toList());

        BigDecimal totalAmount = orderItems.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add); 

        newOrder.setTotalAmount(totalAmount);
        newOrder.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(newOrder);

        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok(savedOrder);
    }
}