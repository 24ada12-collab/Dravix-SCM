package com.dravix.scm.service;

import com.dravix.scm.entity.DocumentType;
import com.dravix.scm.entity.User;
import com.dravix.scm.entity.VerificationDocument;
import com.dravix.scm.entity.VerificationStatus;
import com.dravix.scm.repository.UserRepository;
import com.dravix.scm.repository.VerificationDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationDocumentRepository documentRepository;
    private final UserRepository userRepository;

    // Local filesystem storage directory
    private final Path uploadBaseDir = Paths.get("uploads", "verification");

    public List<VerificationDocument> getUserDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public VerificationStatus getUserVerificationStatus(Long userId) {
        return userRepository.findById(userId)
                .map(User::getVerificationStatus)
                .orElse(VerificationStatus.PENDING);
    }

    @Transactional
    public VerificationDocument uploadDocument(Long userId, String documentTypeStr, MultipartFile file) throws IOException {
        DocumentType documentType = DocumentType.valueOf(documentTypeStr.toUpperCase());

        // Validate file presence
        if (file.isEmpty()) {
            throw new RuntimeException("Uploaded file cannot be empty");
        }

        // Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("Invalid file name");
        }

        String lower = originalFilename.toLowerCase();
        if (!lower.endsWith(".pdf") && !lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".png")) {
            throw new RuntimeException("Unsupported file type. Please upload PDF, JPG, JPEG, or PNG files only.");
        }

        // Validate max 10MB file size
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds maximum allowed limit of 10MB");
        }

        // Create user-specific uploads folder: uploads/verification/{userId}/
        Path userDir = uploadBaseDir.resolve(String.valueOf(userId));
        if (!Files.exists(userDir)) {
            Files.createDirectories(userDir);
        }

        // Generate clean stored file name
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        }
        String storedFileName = documentType.name().toLowerCase() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = userDir.resolve(storedFileName);

        // Copy file to disk
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Save or update document metadata
        VerificationDocument doc = documentRepository.findByUserIdAndDocumentType(userId, documentType)
                .orElse(VerificationDocument.builder()
                        .userId(userId)
                        .documentType(documentType)
                        .build());

        doc.setFileName(originalFilename);
        doc.setFilePath(targetPath.toString());
        doc.setFileSize(file.getSize());
        doc.setStatus(VerificationStatus.PENDING);
        doc.setUploadedAt(LocalDateTime.now());
        doc.setRejectionReason(null);

        doc = documentRepository.save(doc);

        // Ensure user status remains PENDING while documents are awaiting review
        User user = userRepository.findById(userId).orElseThrow();
        if (user.getVerificationStatus() != VerificationStatus.VERIFIED) {
            user.setVerificationStatus(VerificationStatus.PENDING);
            userRepository.save(user);
        }

        return doc;
    }

    // Foundation method for Admin verification (mock/testable in Stage 2/3)
    @Transactional
    public User updateVerificationStatusByAdmin(Long userId, VerificationStatus newStatus, String reviewedBy, String rejectionReason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setVerificationStatus(newStatus);
        userRepository.save(user);

        // Update all user documents to match or reflect approval
        List<VerificationDocument> docs = documentRepository.findByUserId(userId);
        for (VerificationDocument d : docs) {
            d.setStatus(newStatus);
            d.setReviewedAt(LocalDateTime.now());
            d.setReviewedBy(reviewedBy != null ? reviewedBy : "ADMIN");
            if (newStatus == VerificationStatus.REJECTED) {
                d.setRejectionReason(rejectionReason);
            }
            documentRepository.save(d);
        }

        return user;
    }
}
