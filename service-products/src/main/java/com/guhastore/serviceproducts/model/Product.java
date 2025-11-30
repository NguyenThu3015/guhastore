
package com.guhastore.serviceproducts.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob 
    private String description;

    @Column(nullable = false)
    private BigDecimal price; 

    @Column(nullable = false)
    private Integer stockQuantity;
    

    private String imageUrl;

   

    @ManyToOne 
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne 
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference 
    private List<Review> reviews;
}