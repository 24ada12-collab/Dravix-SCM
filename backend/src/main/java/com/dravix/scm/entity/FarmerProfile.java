package com.dravix.scm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "farmer_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "land_status", nullable = false)
    private String landStatus; // OWNER or LEASE

    private Double latitude;
    private Double longitude;

    @Column(length = 500)
    private String address;

    private String district;
    private String state;
    private String pincode;
}
