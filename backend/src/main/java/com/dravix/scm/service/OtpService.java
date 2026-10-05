package com.dravix.scm.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // In-memory OTP storage for local development
    private static class OtpEntry {
        String otp;
        long expiryEpochMs;
        int attempts;

        OtpEntry(String otp, long expiryEpochMs) {
            this.otp = otp;
            this.expiryEpochMs = expiryEpochMs;
            this.attempts = 0;
        }
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> lastRequestedTime = new ConcurrentHashMap<>();

    private static final long OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes
    private static final long RATE_LIMIT_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown between sends

    public String generateAndSendOtp(String email) {
        long now = System.currentTimeMillis();

        // Rate limiting check
        Long lastTime = lastRequestedTime.get(email.toLowerCase());
        if (lastTime != null && (now - lastTime) < RATE_LIMIT_COOLDOWN_MS) {
            long remainingSec = (RATE_LIMIT_COOLDOWN_MS - (now - lastTime)) / 1000;
            throw new RuntimeException("Rate limit exceeded. Please wait " + remainingSec + " seconds before requesting a new OTP.");
        }

        // Generate 6 digit OTP
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        String otp = String.valueOf(code);

        otpStore.put(email.toLowerCase(), new OtpEntry(otp, now + OTP_VALIDITY_MS));
        lastRequestedTime.put(email.toLowerCase(), now);

        // In production/future, this integrates with MailSender.
        // For local Buildathon development, we log it clearly to the console.
        System.out.println("==================================================");
        System.out.println("[DRAVIX SCM - OTP SERVICE] (Development Mode)");
        System.out.println("Generated OTP for " + email + ": " + otp);
        System.out.println("Expires in 5 minutes at: " + Instant.ofEpochMilli(now + OTP_VALIDITY_MS));
        System.out.println("==================================================");

        return otp;
    }

    public boolean verifyOtp(String email, String enteredOtp) {
        String key = email.toLowerCase();
        OtpEntry entry = otpStore.get(key);

        if (entry == null) {
            throw new RuntimeException("No active OTP found for this email. Please request a new OTP.");
        }

        if (System.currentTimeMillis() > entry.expiryEpochMs) {
            otpStore.remove(key);
            throw new RuntimeException("OTP has expired. Please request a new OTP.");
        }

        if (entry.attempts >= 5) {
            otpStore.remove(key);
            throw new RuntimeException("Too many invalid attempts. This OTP has been invalidated. Please request a new OTP.");
        }

        entry.attempts++;

        if (entry.otp.equals(enteredOtp.trim())) {
            // Single use: remove upon successful verification
            otpStore.remove(key);
            return true;
        }

        return false;
    }
}
