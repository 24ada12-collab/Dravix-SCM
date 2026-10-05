package com.dravix.scm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseRegisterRequest {
    private String warehouseName;
    private String ownerName;
    private String phone;
    private Double totalCapacityKg;
    private Boolean coldStorageAvailable;
    private Boolean wdraRegistered;
    private String wdraRegNumber;
    private Double latitude;
    private Double longitude;
    private String address;
    private String district;
    private String state;
    private String pincode;
    private String email;
    private String password;
}
