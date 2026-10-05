package com.dravix.scm.repository;

import com.dravix.scm.entity.DocumentType;
import com.dravix.scm.entity.VerificationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {
    List<VerificationDocument> findByUserId(Long userId);
    Optional<VerificationDocument> findByUserIdAndDocumentType(Long userId, DocumentType documentType);
}
