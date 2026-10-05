package com.dravix.scm.repository;

import com.dravix.scm.entity.FpoMemberProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FpoMemberProfileRepository extends JpaRepository<FpoMemberProfile, Long> {
    Optional<FpoMemberProfile> findByUserId(Long userId);
}
