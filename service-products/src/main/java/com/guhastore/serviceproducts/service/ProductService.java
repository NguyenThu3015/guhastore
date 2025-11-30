package com.guhastore.serviceproducts.service;

import com.guhastore.serviceproducts.model.Brand;
import com.guhastore.serviceproducts.model.Category;
import com.guhastore.serviceproducts.model.Product;
import com.guhastore.serviceproducts.repository.BrandRepository;
import com.guhastore.serviceproducts.repository.CategoryRepository;
import com.guhastore.serviceproducts.repository.ProductRepository;
import com.guhastore.serviceproducts.repository.ReviewRepository;
import com.guhastore.serviceproducts.repository.PurchaseOrderItemRepository;
import com.guhastore.serviceproducts.dto.StockRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.opencsv.CSVReader;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStreamReader; 
import java.io.Reader;
import java.math.BigDecimal;
import java.util.ArrayList;
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PurchaseOrderItemRepository purchaseOrderItemRepository;

    @Transactional
    public void saveProductsFromCsv(MultipartFile file) {
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVReader csvReader = new CSVReader(reader)) {

            // Đọc tất cả các dòng
            List<String[]> rows = csvReader.readAll();
            
            // Bỏ qua dòng tiêu đề (Header) đầu tiên
            rows.remove(0);

            List<Product> productList = new ArrayList<>();

            for (String[] row : rows) {
                // Giả sử file CSV có thứ tự cột:
                // [0]Name, [1]Description, [2]Price, [3]Stock, [4]ImageURL, [5]BrandID, [6]CategoryID
                
                Product p = new Product();
                p.setName(row[0]);
                p.setDescription(row[1]);
                p.setPrice(new BigDecimal(row[2]));
                p.setStockQuantity(Integer.parseInt(row[3]));
                p.setImageUrl(row[4]);

                // Tìm Brand và Category (Nếu không thấy thì lỗi hoặc bỏ qua - ở đây ta ném lỗi)
                Long brandId = Long.parseLong(row[5]);
                Long categoryId = Long.parseLong(row[6]);
                
                p.setBrand(brandRepository.findById(brandId)
                    .orElseThrow(() -> new RuntimeException("Brand ID không tồn tại: " + brandId)));
                    
                p.setCategory(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category ID không tồn tại: " + categoryId)));

                productList.add(p);
            }

            // Lưu tất cả vào DB
            productRepository.saveAll(productList);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi import CSV: " + e.getMessage());
        }
    }

    public Product createProduct(Product product, Long brandId, Long categoryId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found: " + brandId));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
        product.setBrand(brand);
        product.setCategory(category);
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProductSafely(Long productId) {
        if (!productRepository.existsById(productId)) {
            return;
        }
        reviewRepository.deleteByProductId(productId);
        purchaseOrderItemRepository.deleteByProductId(productId);
        productRepository.deleteById(productId);
    }
    @Transactional
    public void decreaseStock(StockRequestDto request) {
        List<StockRequestDto.StockItemDto> items = request.getItems();
        for (StockRequestDto.StockItemDto item : items) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }
    }

    @Transactional
    public void releaseStock(StockRequestDto request) {
        List<StockRequestDto.StockItemDto> items = request.getItems();
        for (StockRequestDto.StockItemDto item : items) {
            Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }
    }
}