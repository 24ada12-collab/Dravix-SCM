package com.dravix.scm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "gov_market_observations", indexes = {
    @Index(name = "idx_obs_lookup", columnList = "commodity, state, district, market, market_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovMarketObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String commodity;
    private String state;
    private String district;
    private String market;
    private String variety;

    @Column(name = "min_price")
    private double minPrice;

    @Column(name = "max_price")
    private double maxPrice;

    @Column(name = "modal_price")
    private double modalPrice;

    @Column(name = "price_per_kg")
    private double pricePerKg;

    @Column(name = "market_date")
    private LocalDate marketDate;

    private String source;

    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;
}
