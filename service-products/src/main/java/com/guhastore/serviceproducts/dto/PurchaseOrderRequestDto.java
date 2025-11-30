
package com.guhastore.serviceproducts.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class PurchaseOrderRequestDto {
    
    private String supplierName;
    private String supplierPhone;
    private String personInCharge; 
    private String notes;

    
    private List<PurchaseItemDto> items;

    @Getter
    @Setter
    public static class PurchaseItemDto {
        private Long productId;
        private Integer quantity;
        private BigDecimal importPrice;
    }
}