package com.dravix.scm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    private String productName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantityKg;

    @NotNull(message = "Purchase price is required")
    @Positive(message = "Purchase price must be greater than 0")
    private Double purchasePrice;

    private String pricingStrategy; // PROFIT_PER_KG, PROFIT_PERCENTAGE

    private Double marginValue;

    private String imageUrl;

    private Long warehouseId;

    private String warehouseName;

    private Double warehouseDistanceKm;

    private String remarks;
}
