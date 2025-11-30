//com.guhastore.service_orders.dto
package com.guhastore.service_orders.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class StockRequestDto {
    private List<StockItemDto> items;

    @Getter
    @Setter
    public static class StockItemDto {
        private Long productId;
        private Integer quantity;
    }
}