
package com.guhastore.serviceproducts.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime importDate; 

    @Column(nullable = false)
    private String supplierName; 

    private String supplierPhone;

    private String personInCharge; 

    private String notes;

    private BigDecimal totalAmount; 

    @Column(nullable = false)
    private String status; 

   
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL)
    @JsonManagedReference 
    private List<PurchaseOrderItem> items;
}