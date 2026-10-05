package com.dravix.scm.service;

import com.dravix.scm.dto.CreateClaimRequest;
import com.dravix.scm.dto.CreateProductRequest;
import com.dravix.scm.entity.InsuranceClaim;
import com.dravix.scm.entity.Product;
import com.dravix.scm.entity.User;
import com.dravix.scm.repository.InsuranceClaimRepository;
import com.dravix.scm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FarmerProductService {

    private final ProductRepository productRepository;
    private final InsuranceClaimRepository insuranceClaimRepository;

    @Transactional
    public Product createProduct(User farmer, CreateProductRequest request) {
        // Calculate selling price
        double purchase = request.getPurchasePrice() != null ? request.getPurchasePrice() : 0.0;
        double margin = request.getMarginValue() != null ? request.getMarginValue() : 0.0;
        double selling = purchase;

        if ("PROFIT_PERCENTAGE".equalsIgnoreCase(request.getPricingStrategy())) {
            selling = purchase + (purchase * (margin / 100.0));
        } else {
            // Default PROFIT_PER_KG
            selling = purchase + margin;
        }

        Product product = Product.builder()
                .productName(request.getProductName())
                .category(request.getCategory())
                .quantityKg(request.getQuantityKg())
                .purchasePrice(purchase)
                .pricingStrategy(request.getPricingStrategy() != null ? request.getPricingStrategy() : "PROFIT_PER_KG")
                .marginValue(margin)
                .sellingPrice(Math.round(selling * 100.0) / 100.0)
                .imageUrl(request.getImageUrl())
                .status("PENDING")
                .farmerId(farmer.getId())
                .farmerName(farmer.getName())
                .warehouseId(request.getWarehouseId())
                .warehouseName(request.getWarehouseName())
                .warehouseDistanceKm(request.getWarehouseDistanceKm())
                .remarks(request.getRemarks())
                .build();

        return productRepository.save(product);
    }

    public List<Product> getFarmerProducts(Long farmerId) {
        return productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }

    public List<Product> getAllApprovedProducts() {
        return productRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
    }

    @Transactional
    public InsuranceClaim submitClaim(User farmer, CreateClaimRequest request) {
        InsuranceClaim claim = InsuranceClaim.builder()
                .farmerId(farmer.getId())
                .productId(request.getProductId())
                .productName(request.getProductName())
                .claimReason(request.getClaimReason())
                .estimatedLossAmount(request.getEstimatedLossAmount())
                .description(request.getDescription())
                .status("SUBMITTED")
                .build();

        return insuranceClaimRepository.save(claim);
    }

    public List<InsuranceClaim> getFarmerClaims(Long farmerId) {
        return insuranceClaimRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }

    public Map<String, Object> getFarmerOverviewStats(Long farmerId) {
        List<Product> products = productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
        List<InsuranceClaim> claims = insuranceClaimRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);

        double totalStockKg = products.stream()
                .mapToDouble(p -> p.getQuantityKg() != null ? p.getQuantityKg() : 0.0)
                .sum();

        long pendingApprovals = products.stream()
                .filter(p -> "PENDING".equalsIgnoreCase(p.getStatus()))
                .count();

        long approvedProducts = products.stream()
                .filter(p -> "APPROVED".equalsIgnoreCase(p.getStatus()) || "STORED".equalsIgnoreCase(p.getStatus()))
                .count();

        double totalValuation = products.stream()
                .mapToDouble(p -> (p.getQuantityKg() != null ? p.getQuantityKg() : 0.0) * (p.getSellingPrice() != null ? p.getSellingPrice() : 0.0))
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("totalStockKg", Math.round(totalStockKg * 100.0) / 100.0);
        stats.put("pendingApprovals", pendingApprovals);
        stats.put("approvedProducts", approvedProducts);
        stats.put("totalValuationInr", Math.round(totalValuation * 100.0) / 100.0);
        stats.put("totalClaims", claims.size());
        return stats;
    }
}
