
package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.model.Product;
import com.guhastore.serviceproducts.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductStatisticsController {

    @Autowired
    private ProductRepository productRepository;

    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts(
            @RequestParam(defaultValue = "10") Integer threshold) {
        List<Product> products = productRepository.findByStockQuantityLessThanEqual(threshold);
        return ResponseEntity.ok(products);
    }
}