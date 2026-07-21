package com.lecturesystem.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Thin wrapper around JavaMailSender so the rest of the app never has to
// build a MimeMessage/SimpleMailMessage directly. In dev, spring.mail.* points
// at a Mailtrap sandbox inbox, so nothing is ever sent to a real address.
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public EmailService(JavaMailSender mailSender,
                         @Value("${app.mail.from}") String fromAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendVerificationCode(String toEmail, String code, int expiryMinutes) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Verify your UniSystem account");
        message.setText(
                "Your verification code is: " + code + "\n\n" +
                "This code expires in " + expiryMinutes + " minutes.\n\n" +
                "If you didn't create a UniSystem account, you can safely ignore this email."
        );
        mailSender.send(message);
    }
}
