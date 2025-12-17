package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.dto.StockRequestDto;
import com.guhastore.serviceproducts.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/internal/stock")
@CrossOrigin(origins = "http://localhost:8083") 
public class InternalStockController {

    @Autowired
    private ProductService productService;

    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveStock(@RequestBody StockRequestDto request) {
        try {
            productService.decreaseStock(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); 
        }
    }

    @PostMapping("/release")
    public ResponseEntity<Void> releaseStock(@RequestBody StockRequestDto request) {
        try {
            productService.releaseStock(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); 
        }
    }
    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmStock(@RequestBody StockRequestDto request) {
        try {
            productService.confirmStockDeduction(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
}