package com.dravix.scm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String recipientEmail, String otp) {
        String maskedEmail = maskEmail(recipientEmail);
        log.info("[EmailService] OTP email requested for: {}", maskedEmail);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setTo(recipientEmail);
            message.setSubject("DRAVIX SCM - Email Verification OTP");

            String body = "DRAVIX SCM\n"
                    + "Email Verification\n\n"
                    + "Your verification code is:\n"
                    + otp + "\n\n"
                    + "This OTP is valid for 5 minutes.\n"
                    + "Do not share this code with anyone.\n"
                    + "If you did not request this verification, you can safely ignore this email.\n\n"
                    + "Regards,\n"
                    + "DRAVIX SCM Team";

            message.setText(body);
            mailSender.send(message);

            log.info("[EmailService] OTP email sent successfully to: {}", maskedEmail);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send OTP email to {}: {}", maskedEmail, e.getMessage());
            throw new RuntimeException("Unable to send verification email. Please check your email address and try again.");
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return email.charAt(0) + "***" + email.substring(atIndex);
        return email.charAt(0) + "***" + email.substring(atIndex - 1);
    }
}
