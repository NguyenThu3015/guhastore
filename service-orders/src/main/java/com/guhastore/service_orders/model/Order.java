//com.guhastore.serviceorders.model
package com.guhastore.service_orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // IMPORT NÀY
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders") 
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; 

    private LocalDateTime orderDate; 

    @Column(nullable = false)
    private String status; 
    private BigDecimal totalAmount; 

    // Thông tin giao hàng
    private String shippingAddress;
    private String customerName;
    private String customerPhone;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> orderItems;
}