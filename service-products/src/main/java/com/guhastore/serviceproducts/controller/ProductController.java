package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.model.Brand;
import com.guhastore.serviceproducts.model.Category;
import com.guhastore.serviceproducts.model.Product;
import com.guhastore.serviceproducts.repository.BrandRepository;
import com.guhastore.serviceproducts.repository.CategoryRepository;
import com.guhastore.serviceproducts.repository.ProductRepository;
import com.guhastore.serviceproducts.service.ProductService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/products")
// Đã xóa @CrossOrigin vì đã cấu hình bên SecurityConfig
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    // --- IMPORT (Quyền đã được check bên SecurityConfig: ADMIN & EMPLOYEE) ---
    @PostMapping("/import")
    public ResponseEntity<String> importProducts(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File không được để trống");
        }
        try {
            productService.saveProductsFromCsv(file);
            return ResponseEntity.ok("Import sản phẩm thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // --- PUBLIC API ---
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- CREATE (Quyền: ADMIN & EMPLOYEE) ---
    @PostMapping
    public Product createProduct(@RequestBody Product product,
                                 @RequestParam Long brandId,
                                 @RequestParam Long categoryId) {
        return productService.createProduct(product, brandId, categoryId);
    }

    // --- UPDATE (Quyền: ADMIN & EMPLOYEE) ---
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails,
            @RequestParam Long brandId,
            @RequestParam Long categoryId) {
        
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Brand ID"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Category ID"));

        Product existingProduct = optionalProduct.get();
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setStockQuantity(productDetails.getStockQuantity());
        existingProduct.setImageUrl(productDetails.getImageUrl());
        existingProduct.setBrand(brand);
        existingProduct.setCategory(category);

        Product updatedProduct = productRepository.save(existingProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    // --- DELETE (Quyền: ADMIN & EMPLOYEE) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProductSafely(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // --- FILTER / SEARCH ---
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        
        Specification<Product> spec = (Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isEmpty()) {
                predicates.add(builder.like(builder.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
            }
            if (brandId != null) {
                predicates.add(builder.equal(root.get("brand").get("id"), brandId));
            }
            if (categoryId != null) {
                predicates.add(builder.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("price"), new BigDecimal(minPrice)));
            }
            if (maxPrice != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("price"), new BigDecimal(maxPrice)));
            }
            return builder.and(predicates.toArray(new Predicate[0]));
        };
        return productRepository.findAll(spec);
    }
}