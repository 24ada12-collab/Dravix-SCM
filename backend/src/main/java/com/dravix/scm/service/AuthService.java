package com.dravix.scm.service;

import com.dravix.scm.config.JwtUtil;
import com.dravix.scm.dto.AuthResponse;
import com.dravix.scm.dto.FarmerRegisterRequest;
import com.dravix.scm.dto.LoginRequest;
import com.dravix.scm.entity.*;
import com.dravix.scm.repository.FarmerProfileRepository;
import com.dravix.scm.repository.FpoMemberProfileRepository;
import com.dravix.scm.repository.UserRepository;
import com.dravix.scm.dto.WarehouseRegisterRequest;
import com.dravix.scm.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final FpoMemberProfileRepository fpoMemberProfileRepository;
    private final WarehouseRepository warehouseRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerFarmer(FarmerRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with this email already exists: " + request.getEmail());
        }

        Role role = "FPO_MEMBER".equalsIgnoreCase(request.getRole()) ? Role.FPO_MEMBER : Role.FARMER;

        // Create User entity
        User user = User.builder()
                .name(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .verificationStatus(VerificationStatus.PENDING)
                .emailVerified(true) // Verified via OTP before registration
                .build();

        user = userRepository.save(user);

        // Create Profile entity
        if (role == Role.FARMER) {
            FarmerProfile profile = FarmerProfile.builder()
                    .userId(user.getId())
                    .landStatus(request.getLandStatus() != null ? request.getLandStatus().toUpperCase() : "OWNER")
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .address(request.getAddress())
                    .district(request.getDistrict())
                    .state(request.getState())
                    .pincode(request.getPincode())
                    .build();
            farmerProfileRepository.save(profile);
        } else {
            FpoMemberProfile profile = FpoMemberProfile.builder()
                    .userId(user.getId())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .address(request.getAddress())
                    .district(request.getDistrict())
                    .state(request.getState())
                    .pincode(request.getPincode())
                    .build();
            fpoMemberProfileRepository.save(profile);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name(), user.getVerificationStatus().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .verificationStatus(user.getVerificationStatus())
                .emailVerified(user.getEmailVerified())
                .build();
    }

    @Transactional
    public AuthResponse registerWarehouse(WarehouseRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("An account with this email already exists: " + request.getEmail());
        }

        // Create User entity with WAREHOUSE role
        User user = User.builder()
                .name(request.getOwnerName() != null && !request.getOwnerName().isBlank() ? request.getOwnerName() : request.getWarehouseName())
                .email(request.getEmail().toLowerCase().trim())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.WAREHOUSE)
                .verificationStatus(VerificationStatus.PENDING)
                .emailVerified(true)
                .build();

        user = userRepository.save(user);

        // Determine storage type & categories based on cold storage choice
        boolean isCold = Boolean.TRUE.equals(request.getColdStorageAvailable());
        String storageType = isCold ? "COLD_STORAGE" : "GENERAL_DRY";
        String categories = isCold 
                ? "Fruits,Vegetables,Perishables,Cold Storage" 
                : "Grains,Cereals,Pulses,Oilseeds,Spices";

        Warehouse warehouse = Warehouse.builder()
                .name(request.getWarehouseName())
                .warehouseType(isCold ? WarehouseType.COLD_STORAGE : WarehouseType.GODOWN)
                .ownershipType(OwnershipType.PRIVATE)
                .sourceType(SourceType.PRIVATE_ADMIN_VERIFIED)
                .district(request.getDistrict() != null ? request.getDistrict() : "Unknown")
                .location(request.getAddress() != null ? request.getAddress() : request.getDistrict())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .totalCapacityKg(request.getTotalCapacityKg())
                .availableCapacityKg(request.getTotalCapacityKg()) // Initially full available
                .storageType(storageType)
                .supportedCategories(categories)
                .wdraRegistered(Boolean.TRUE.equals(request.getWdraRegistered()))
                .eNwrEligible(Boolean.TRUE.equals(request.getWdraRegistered()))
                .verified(false) // Pending admin verification
                .active(true)
                .sourceReference("USER_REGISTRATION:" + user.getId())
                .build();

        warehouseRepository.save(warehouse);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name(), user.getVerificationStatus().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .verificationStatus(user.getVerificationStatus())
                .emailVerified(user.getEmailVerified())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name(), user.getVerificationStatus().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .verificationStatus(user.getVerificationStatus())
                .emailVerified(user.getEmailVerified())
                .build();
    }
}
