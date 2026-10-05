package com.dravix.scm.controller;

import com.dravix.scm.entity.User;
import com.dravix.scm.entity.VerificationDocument;
import com.dravix.scm.entity.VerificationStatus;
import com.dravix.scm.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        VerificationStatus status = verificationService.getUserVerificationStatus(currentUser.getId());
        List<VerificationDocument> docs = verificationService.getUserDocuments(currentUser.getId());

        return ResponseEntity.ok(Map.of(
                "userId", currentUser.getId(),
                "role", currentUser.getRole(),
                "verificationStatus", status,
                "documents", docs
        ));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        try {
            VerificationDocument doc = verificationService.uploadDocument(currentUser.getId(), documentType, file);
            return ResponseEntity.ok(Map.of(
                    "message", "Document uploaded successfully",
                    "document", doc
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Backend endpoint foundation for Admin verification review
    @PostMapping("/admin/review")
    public ResponseEntity<?> adminReview(
            @RequestParam("userId") Long targetUserId,
            @RequestParam("status") String status,
            @RequestParam(value = "rejectionReason", required = false) String rejectionReason) {

        try {
            VerificationStatus newStatus = VerificationStatus.valueOf(status.toUpperCase());
            User updatedUser = verificationService.updateVerificationStatusByAdmin(
                    targetUserId, newStatus, "ADMIN", rejectionReason);
            return ResponseEntity.ok(Map.of(
                    "message", "User verification status updated to " + newStatus,
                    "userId", updatedUser.getId(),
                    "newStatus", updatedUser.getVerificationStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
