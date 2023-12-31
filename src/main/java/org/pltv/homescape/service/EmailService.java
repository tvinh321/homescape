package org.pltv.homescape.service;

import java.time.LocalDate;

import org.pltv.homescape.model.EmailToken;
import org.pltv.homescape.repository.EmailTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;

import jakarta.transaction.Transactional;

import java.security.SecureRandom;
import java.math.BigInteger;

@Service
public class EmailService {
    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.reset-email-template}")
    private String resetEmailTemplate;

    @Value("${sendgrid.verify-email-template}")
    private String verifyEmailTemplate;

    @Autowired
    private EmailTokenRepository emailTokenRepository;

    private void sendEmail(String email, String token, Boolean isReset) throws Exception {
        Email from = new Email(fromEmail);
        Email to = new Email(email);

        Personalization personalization = new Personalization();
        personalization.addDynamicTemplateData("token", token);
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(isReset ? resetEmailTemplate : verifyEmailTemplate);
        mail.addPersonalization(personalization);

        SendGrid sendGrid = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sendGrid.api(request);
        } catch (Exception e) {
            throw e;
        }
    }

    public void saveEmailToken(String email, String token, Boolean isReset) {
        emailTokenRepository.save(EmailToken.builder()
                .email(email)
                .token(token)
                .isReset(isReset)
                .expiryDate(LocalDate.now().plusDays(1))
                .build());
    }

    public void sendResetEmail(String email) throws Exception {
        String token = generateToken();
        saveEmailToken(email, token, true);
        sendEmail(email, token, true);
    }

    public void sendVerifyEmail(String email) throws Exception {
        String token = generateToken();
        saveEmailToken(email, token, false);
        sendEmail(email, token, false);
    }

    @Transactional
    public void deleteEmailToken(String token) {
        emailTokenRepository.deleteByToken(token);
    }

    public boolean verifyEmailToken(String token, Boolean isReset) {
        EmailToken emailToken = emailTokenRepository.findByToken(token);

        if (emailToken == null || emailToken.getIsReset() != isReset
                || emailToken.getExpiryDate().isBefore(LocalDate.now())) {
            return false;
        }

        return true;
    }

    public String getEmailFromToken(String token) {
        EmailToken emailToken = emailTokenRepository.findByToken(token);
        return emailToken.getEmail();
    }

    public String generateToken() {
        SecureRandom secureRandom = new SecureRandom();
        String token = new BigInteger(130, secureRandom).toString(32);
        return token;
    }
}
