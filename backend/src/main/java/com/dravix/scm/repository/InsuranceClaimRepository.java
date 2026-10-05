package com.dravix.scm.repository;

import com.dravix.scm.entity.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    List<InsuranceClaim> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    long countByFarmerId(Long farmerId);
}
