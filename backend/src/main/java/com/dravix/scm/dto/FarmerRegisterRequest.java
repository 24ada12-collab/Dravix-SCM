package com.dravix.scm.dto;

import com.dravix.scm.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerRegisterRequest {
    private String fullName;
    private String phone;
    private String email;
    private String password;
    private String role; // "FARMER" or "FPO_MEMBER"
    private String landStatus; // "OWNER" or "LEASE" (for Farmer)

    // Map Location coordinates & address
    private Double latitude;
    private Double longitude;
    private String address;
    private String district;
    private String state;
    private String pincode;
}
