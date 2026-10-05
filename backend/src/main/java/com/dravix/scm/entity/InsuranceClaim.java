package com.dravix.scm.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_claims")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    @Column(name = "product_id")
    private Long productId;

    private String productName;

    @Column(nullable = false)
    private String claimReason; // PEST_INFESTATION, FLOOD, DROUGHT, WAREHOUSE_DAMAGE, SPOILAGE, OTHER

    @Column(nullable = false)
    private Double estimatedLossAmount;

    @Column(length = 1500)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, UNDER_INSPECTION, APPROVED, REJECTED, DISBURSED

    private String claimReferenceNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "SUBMITTED";
        }
        if (this.claimReferenceNumber == null) {
            this.claimReferenceNumber = "CLM-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
