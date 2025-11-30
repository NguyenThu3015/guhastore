package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.model.Brand;
import com.guhastore.serviceproducts.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Brand createBrand(@RequestBody Brand brand) {
        return brandRepository.save(brand);
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
 
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody Brand brandDetails) {
        
        Optional<Brand> brandOptional = brandRepository.findById(id);
        if (brandOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Brand existingBrand = brandOptional.get();
        existingBrand.setName(brandDetails.getName());
        
        Brand updatedBrand = brandRepository.save(existingBrand);
        return ResponseEntity.ok(updatedBrand);
    }
    
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        
        if (!brandRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        
        brandRepository.deleteById(id);
        return ResponseEntity.noContent().build(); 
    }
}