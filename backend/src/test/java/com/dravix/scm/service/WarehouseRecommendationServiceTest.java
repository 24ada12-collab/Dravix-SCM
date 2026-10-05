package com.dravix.scm.service;

import com.dravix.scm.dto.WarehouseRecommendationRequest;
import com.dravix.scm.dto.WarehouseRecommendationResponse;
import com.dravix.scm.entity.OwnershipType;
import com.dravix.scm.entity.SourceType;
import com.dravix.scm.entity.Warehouse;
import com.dravix.scm.entity.WarehouseType;
import com.dravix.scm.repository.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WarehouseRecommendationServiceTest {

    @Mock
    private WarehouseRepository warehouseRepository;

    @InjectMocks
    private WarehouseService warehouseService;

    private Warehouse whNear;
    private Warehouse whFar;
    private Warehouse whNoCoords;
    private Warehouse whNoCapacity;
    private Warehouse whInsufficientCapacity;
    private Warehouse whInactive;
    private Warehouse whUnverifiedPrivate;
    private Warehouse whVerifiedPrivate;
    private Warehouse whVerifiedCooperative;

    @BeforeEach
    void setUp() {
        // Farmer base: 11.3410, 77.7170 (Erode)

        // Near warehouse: 11.3450, 77.7200 (~0.55 km away)
        whNear = Warehouse.builder()
                .id(1L)
                .name("Near Godown")
                .district("Erode")
                .location("Erode Central")
                .warehouseType(WarehouseType.GODOWN)
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(11.3450)
                .longitude(77.7200)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .storageType("Dry Godown")
                .supportedCategories("GRAINS,PULSES")
                .verified(true)
                .active(true)
                .build();

        // Far warehouse: 11.5000, 77.8000 (~20 km away)
        whFar = Warehouse.builder()
                .id(2L)
                .name("Far Godown")
                .district("Erode")
                .location("Outskirts")
                .warehouseType(WarehouseType.GODOWN)
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(11.5000)
                .longitude(77.8000)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .storageType("Dry Godown")
                .supportedCategories("GRAINS,PULSES")
                .verified(true)
                .active(true)
                .build();

        // No coordinates
        whNoCoords = Warehouse.builder()
                .id(3L)
                .name("No Coordinates Godown")
                .district("Erode")
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(null)
                .longitude(null)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .verified(true)
                .active(true)
                .build();

        // Null available capacity
        whNoCapacity = Warehouse.builder()
                .id(4L)
                .name("Null Capacity Godown")
                .district("Erode")
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(11.3460)
                .longitude(77.7210)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(null)
                .verified(true)
                .active(true)
                .build();

        // Insufficient capacity (only 1,000 kg available)
        whInsufficientCapacity = Warehouse.builder()
                .id(5L)
                .name("Insufficient Capacity Godown")
                .district("Erode")
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(11.3470)
                .longitude(77.7220)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(1000.0)
                .verified(true)
                .active(true)
                .build();

        // Inactive warehouse
        whInactive = Warehouse.builder()
                .id(6L)
                .name("Inactive Godown")
                .district("Erode")
                .ownershipType(OwnershipType.GOVERNMENT)
                .sourceType(SourceType.GOVERNMENT_OFFICIAL)
                .latitude(11.3480)
                .longitude(77.7230)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .verified(true)
                .active(false)
                .build();

        // Unverified private
        whUnverifiedPrivate = Warehouse.builder()
                .id(7L)
                .name("Unverified Private Warehouse")
                .district("Erode")
                .ownershipType(OwnershipType.PRIVATE)
                .sourceType(SourceType.PRIVATE_ADMIN_VERIFIED)
                .latitude(11.3490)
                .longitude(77.7240)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .verified(false) // Not verified
                .active(true)
                .build();

        // Verified private
        whVerifiedPrivate = Warehouse.builder()
                .id(8L)
                .name("Verified Private Warehouse")
                .district("Erode")
                .ownershipType(OwnershipType.PRIVATE)
                .sourceType(SourceType.PRIVATE_ADMIN_VERIFIED)
                .latitude(11.3500)
                .longitude(77.7250)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .verified(true)
                .active(true)
                .build();

        // Verified cooperative
        whVerifiedCooperative = Warehouse.builder()
                .id(9L)
                .name("Verified Cooperative Warehouse")
                .district("Erode")
                .ownershipType(OwnershipType.COOPERATIVE)
                .sourceType(SourceType.COOPERATIVE_VERIFIED)
                .latitude(11.3510)
                .longitude(77.7260)
                .totalCapacityKg(100000.0)
                .availableCapacityKg(50000.0)
                .verified(true)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("A & B & C: Nearest warehouse ranked first by Haversine distance")
    void testNearestWarehouseRankedFirst() {
        when(warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc())
                .thenReturn(Arrays.asList(whFar, whNear));

        WarehouseRecommendationRequest request = WarehouseRecommendationRequest.builder()
                .latitude(11.3410)
                .longitude(77.7170)
                .productCategory("PULSES")
                .quantityKg(5000.0)
                .build();

        List<WarehouseRecommendationResponse> results = warehouseService.getNearestRecommendations(request);

        assertEquals(2, results.size());
        assertEquals("Near Godown", results.get(0).getWarehouseName());
        assertTrue(results.get(0).getDistanceKm() < results.get(1).getDistanceKm());
    }

    @Test
    @DisplayName("D & E: Exclude warehouses with insufficient or null available capacity")
    void testCapacityExclusion() {
        when(warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc())
                .thenReturn(Arrays.asList(whNear, whNoCapacity, whInsufficientCapacity));

        WarehouseRecommendationRequest request = WarehouseRecommendationRequest.builder()
                .latitude(11.3410)
                .longitude(77.7170)
                .productCategory("PULSES")
                .quantityKg(5000.0)
                .build();

        List<WarehouseRecommendationResponse> results = warehouseService.getNearestRecommendations(request);

        assertEquals(1, results.size());
        assertEquals("Near Godown", results.get(0).getWarehouseName());
    }

    @Test
    @DisplayName("F & G: Exclude warehouses with null coordinates or inactive status")
    void testNullCoordinatesAndInactiveExclusion() {
        when(warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc())
                .thenReturn(Arrays.asList(whNear, whNoCoords, whInactive));

        WarehouseRecommendationRequest request = WarehouseRecommendationRequest.builder()
                .latitude(11.3410)
                .longitude(77.7170)
                .productCategory("PULSES")
                .quantityKg(5000.0)
                .build();

        List<WarehouseRecommendationResponse> results = warehouseService.getNearestRecommendations(request);

        assertEquals(1, results.size());
        assertEquals("Near Godown", results.get(0).getWarehouseName());
    }

    @Test
    @DisplayName("H, I & J: Private and cooperative warehouses require verified=true")
    void testPrivateAndCooperativeVerification() {
        when(warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc())
                .thenReturn(Arrays.asList(whUnverifiedPrivate, whVerifiedPrivate, whVerifiedCooperative));

        WarehouseRecommendationRequest request = WarehouseRecommendationRequest.builder()
                .latitude(11.3410)
                .longitude(77.7170)
                .productCategory("PULSES")
                .quantityKg(5000.0)
                .build();

        List<WarehouseRecommendationResponse> results = warehouseService.getNearestRecommendations(request);

        assertEquals(2, results.size());
        assertEquals("Verified Private Warehouse", results.get(0).getWarehouseName());
        assertEquals("Verified Cooperative Warehouse", results.get(1).getWarehouseName());
    }

    @Test
    @DisplayName("K: Return empty list when no suitable warehouse found")
    void testNoSuitableWarehouse() {
        when(warehouseRepository.findByActiveTrueOrderByDistrictAscNameAsc())
                .thenReturn(Collections.emptyList());

        WarehouseRecommendationRequest request = WarehouseRecommendationRequest.builder()
                .latitude(11.3410)
                .longitude(77.7170)
                .productCategory("PULSES")
                .quantityKg(5000.0)
                .build();

        List<WarehouseRecommendationResponse> results = warehouseService.getNearestRecommendations(request);

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }
}
