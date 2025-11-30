
package com.guhastore.serviceproducts.service;

import com.guhastore.serviceproducts.dto.PurchaseOrderRequestDto;
import com.guhastore.serviceproducts.model.Product;
import com.guhastore.serviceproducts.model.PurchaseOrder;
import com.guhastore.serviceproducts.model.PurchaseOrderItem;
import com.guhastore.serviceproducts.repository.ProductRepository;
import com.guhastore.serviceproducts.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    
    @Autowired
    private ProductRepository productRepository;

    
    
    
    @Transactional 
    public PurchaseOrder createAndCompletePurchaseOrder(PurchaseOrderRequestDto request, String adminName) {
        
        
        PurchaseOrder po = new PurchaseOrder();
        po.setSupplierName(request.getSupplierName());
        po.setSupplierPhone(request.getSupplierPhone());
        po.setNotes(request.getNotes());
        po.setPersonInCharge(adminName); 
        po.setImportDate(LocalDateTime.now());
        po.setStatus("COMPLETED"); 
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PurchaseOrderItem> itemsList = new ArrayList<>();

        for (PurchaseOrderRequestDto.PurchaseItemDto itemDto : request.getItems()) {
            
            
            Product product = productRepository.findById(itemDto.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + itemDto.getProductId()));
            
            
            product.setStockQuantity(product.getStockQuantity() + itemDto.getQuantity());
            productRepository.save(product);

           
            PurchaseOrderItem poItem = new PurchaseOrderItem();
            poItem.setProduct(product);
            poItem.setQuantity(itemDto.getQuantity());
            poItem.setImportPrice(itemDto.getImportPrice());
            poItem.setPurchaseOrder(po); 
            
            itemsList.add(poItem);
            
        
            totalAmount = totalAmount.add(itemDto.getImportPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
        }

    
        po.setItems(itemsList);
        po.setTotalAmount(totalAmount);
        
        return purchaseOrderRepository.save(po);
    }
}