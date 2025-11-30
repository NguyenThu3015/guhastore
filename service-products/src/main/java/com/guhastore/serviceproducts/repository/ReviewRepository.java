package com.guhastore.serviceproducts.repository;

import com.guhastore.serviceproducts.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}