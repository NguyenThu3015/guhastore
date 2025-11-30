
package com.guhastore.serviceproducts.repository;

import com.guhastore.serviceproducts.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByNameContainingIgnoreCase(String name);
    
    List<Product> findByBrandId(Long brandId);

    
    List<Product> findByCategoryId(Long categoryId);

    
    List<Product> findByBrandIdAndCategoryId(Long brandId, Long categoryId);

    
    List<Product> findByNameContainingIgnoreCaseAndBrandId(String name, Long brandId);

    
    List<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId);

    
    List<Product> findByNameContainingIgnoreCaseAndBrandIdAndCategoryId(String name, Long brandId, Long categoryId);
    List<Product> findByStockQuantityLessThanEqual(Integer threshold);
    
}