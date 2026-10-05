package com.dravix.scm.dto;

import com.dravix.scm.entity.OwnershipType;
import com.dravix.scm.entity.SourceType;
import com.dravix.scm.entity.WarehouseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseRecommendationResponse {
    private Long warehouseId;
    private String warehouseName;
    private String district;
    private String location;
    private WarehouseType warehouseType;
    private OwnershipType ownershipType;
    private SourceType sourceType;
    private Double distanceKm;
    private Double totalCapacityKg;
    private Double availableCapacityKg;
    private String storageType;
    private Boolean verified;
    private Boolean wdraRegistered;
    private Boolean eNwrEligible;
}
