
package com.guhastore.serviceproducts.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter
@Setter
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; 

    @Lob 
    private String summary; 

    @Lob
    private String content; 

    private String imageUrl;

    private String authorName;

    private LocalDateTime publishDate; 

    @Column(nullable = false)
    private String status; 
}