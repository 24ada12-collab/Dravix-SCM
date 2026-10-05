package com.dravix.scm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateClaimRequest {

    private Long productId;

    private String productName;

    @NotBlank(message = "Claim reason is required")
    private String claimReason;

    @NotNull(message = "Estimated loss amount is required")
    @Positive(message = "Estimated loss amount must be greater than 0")
    private Double estimatedLossAmount;

    private String description;
}
