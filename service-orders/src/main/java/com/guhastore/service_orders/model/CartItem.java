// Nằm trong: com.guhastore.service_orders.model
package com.guhastore.service_orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; 

    @Column(nullable = false)
    private Long productId;
    @Column(nullable = false)
    private Integer quantity; 


    private String productName;
    private String productImageUrl;
    private Double productPrice;
}