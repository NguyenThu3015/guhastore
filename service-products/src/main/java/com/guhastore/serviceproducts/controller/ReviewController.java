
package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.model.Product;
import com.guhastore.serviceproducts.model.Review;
import com.guhastore.serviceproducts.repository.ProductRepository;
import com.guhastore.serviceproducts.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:3000") 
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository; 

    
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsForProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    
    
    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody Review review) {

        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = (Long) authentication.getPrincipal();
        

        
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        
        review.setProduct(productOpt.get());
        review.setUserId(currentUserId);
        review.setUserName("Người dùng " + currentUserId); 
        review.setReviewDate(LocalDateTime.now());

        

        
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }
}