package com.dravix.scm.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            if (fromEmail != null && !fromEmail.isBlank()) {
                helper.setFrom(fromEmail, "DRAVIX SCM");
            } else {
                helper.setFrom("noreply@dravixscm.com", "DRAVIX SCM");
            }

            helper.setTo(recipientEmail);
            helper.setSubject("DRAVIX SCM — Your Verification Code (" + otp + ")");

            String htmlContent = buildHtmlOtpEmail(otp);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("[EmailService] OTP email sent successfully to: {}", maskedEmail);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send OTP email to {}: {}", maskedEmail, e.getMessage());
            throw new RuntimeException("Unable to send verification email. Please check your email address and try again.");
        }
    }

    private String buildHtmlOtpEmail(String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>DRAVIX SCM Verification</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f1f8f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1f2937;">
              <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f8f4; padding: 36px 12px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(27, 94, 32, 0.08); border: 1px solid #d4edda;">
                      
                      <!-- Brand Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #1B5E20 0%%, #2E7D32 60%%, #388E3C 100%%); padding: 32px 36px; text-align: center;">
                          <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 10px 14px; margin-bottom: 12px;">
                            <span style="font-size: 26px; line-height: 1;">🌱</span>
                          </div>
                          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">DRAVIX SCM</h1>
                          <p style="margin: 6px 0 0; color: #C8E6C9; font-size: 13px; font-weight: 500; letter-spacing: 0.3px;">Agricultural Supply Chain &amp; Storage Platform</p>
                        </td>
                      </tr>

                      <!-- Body Content -->
                      <tr>
                        <td style="padding: 36px 36px 28px;">
                          <h2 style="margin: 0 0 12px; color: #1B5E20; font-size: 19px; font-weight: 700;">Email Verification</h2>
                          <p style="margin: 0 0 24px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                            Thank you for joining <strong>DRAVIX SCM</strong>. Please use the verification code below to authenticate your email address and continue your registration:
                          </p>

                          <!-- OTP Card -->
                          <div style="background: #E8F5E9; border: 2px dashed #66BB6A; border-radius: 14px; padding: 24px 16px; text-align: center; margin-bottom: 24px;">
                            <span style="display: block; font-size: 11px; font-weight: 700; color: #2E7D32; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">Your One-Time Passcode</span>
                            <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #1B5E20; font-family: 'Courier New', Courier, monospace; margin: 4px 0;">
                              %s
                            </div>
                            <span style="display: inline-block; background: #C8E6C9; color: #1B5E20; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; margin-top: 8px;">
                              ⏱ Valid for 5 minutes only
                            </span>
                          </div>

                          <!-- Warning & Guidelines -->
                          <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border-radius: 10px; border: 1px solid #eeeeee; padding: 14px 16px; margin-bottom: 24px;">
                            <tr>
                              <td style="font-size: 12px; color: #6b7280; line-height: 1.6;">
                                <strong style="color: #374151;">Security Reminder:</strong> Do not share this OTP with anyone. The DRAVIX team will never ask for your password or OTP. If you did not initiate this registration, you can safely disregard this email.
                              </td>
                            </tr>
                          </table>

                          <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                            Warm regards,<br>
                            <strong style="color: #1B5E20;">The DRAVIX SCM Team</strong>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f9fbf9; border-top: 1px solid #e5ede7; padding: 18px 36px; text-align: center;">
                          <p style="margin: 0; color: #9ca3af; font-size: 11px; line-height: 1.5;">
                            This is an automated security verification message dispatched by DRAVIX SCM.<br>
                            &copy; 2026 DRAVIX SCM. All rights reserved.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(otp);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return email.charAt(0) + "***" + email.substring(atIndex);
        return email.charAt(0) + "***" + email.substring(atIndex - 1);
    }
}
