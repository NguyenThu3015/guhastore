
package com.guhastore.serviceproducts.model;

import com.fasterxml.jackson.annotation.JsonBackReference; 
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; 

    private String userName;

    @Column(nullable = false)
    private int rating; 

    @Lob
    private String comment; 

    private LocalDateTime reviewDate;

    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference 
    private Product product;
}