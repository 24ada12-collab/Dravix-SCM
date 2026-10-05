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
public class WarehouseResponse {
    private Long id;
    private String name;
    private WarehouseType warehouseType;
    private OwnershipType ownershipType;
    private SourceType sourceType;
    private String district;
    private String location;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double totalCapacityKg;
    private Double availableCapacityKg;
    private String storageType;
    private String supportedCategories;
    private Double storageCostPerKg;
    private Boolean wdraRegistered;
    private Boolean eNwrEligible;
    private Boolean verified;
    private Boolean active;
    private String sourceReference;
}
