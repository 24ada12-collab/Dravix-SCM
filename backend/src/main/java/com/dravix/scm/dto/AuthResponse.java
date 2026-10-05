package com.dravix.scm.dto;

import com.dravix.scm.entity.Role;
import com.dravix.scm.entity.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private VerificationStatus verificationStatus;
    private Boolean emailVerified;
}
