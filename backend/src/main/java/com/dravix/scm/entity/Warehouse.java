package com.dravix.scm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "warehouse_type", nullable = false)
    private WarehouseType warehouseType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ownership_type", nullable = false)
    private OwnershipType ownershipType;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private SourceType sourceType;

    @Column(nullable = false)
    private String district;

    private String location;

    @Column(length = 500)
    private String address;

    // Geographic coordinates (nullable if official source lacks geocoordinates)
    private Double latitude;
    private Double longitude;

    // Storage capacity in kg (1 MT = 1000 kg)
    @Column(name = "total_capacity_kg", nullable = false)
    private Double totalCapacityKg;

    // Available capacity in kg (nullable unless genuinely known from live operational data)
    @Column(name = "available_capacity_kg")
    private Double availableCapacityKg;

    @Column(name = "storage_type")
    private String storageType;

    @Column(name = "supported_categories")
    private String supportedCategories;

    @Column(name = "storage_cost_per_kg")
    private Double storageCostPerKg;

    // WDRA accreditation and e-NWR eligibility tracking
    @Column(name = "wdra_registered")
    private Boolean wdraRegistered;

    @Column(name = "enwr_eligible")
    private Boolean eNwrEligible;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // Source auditability & reference
    @Column(name = "source_reference")
    private String sourceReference;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.verified == null) {
            this.verified = false;
        }
        if (this.active == null) {
            this.active = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
