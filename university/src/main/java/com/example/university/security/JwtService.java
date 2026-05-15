package com.example.university.security;

import com.example.university.model.UserAccount;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-minutes}")
    private long expirationMinutes;

    public String createToken(UserAccount userAccount) {
        long expiresAt = Instant.now().plusSeconds(expirationMinutes * 60).getEpochSecond();
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = "{"
                + "\"uid\":" + userAccount.getUserId() + ","
                + "\"email\":\"" + escape(userAccount.getEmail()) + "\","
                + "\"role\":\"" + userAccount.getAccessLevel().name() + "\","
                + "\"exp\":" + expiresAt
                + "}";

        String unsignedToken = encode(header) + "." + encode(payload);
        return unsignedToken + "." + sign(unsignedToken);
    }

    public AuthUser verifyToken(String token) {
        String[] parts = token.split("\\.");

        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);

        if (!constantTimeEquals(expectedSignature, parts[2])) {
            throw new IllegalArgumentException("Invalid signature");
        }

        String payload = new String(
                Base64.getUrlDecoder().decode(parts[1]),
                StandardCharsets.UTF_8
        );
        long expiresAt = Long.parseLong(extractNumber(payload, "exp"));

        if (Instant.now().getEpochSecond() > expiresAt) {
            throw new IllegalArgumentException("Token expired");
        }

        return new AuthUser(
                Integer.parseInt(extractNumber(payload, "uid")),
                extractString(payload, "email"),
                extractString(payload, "role")
        );
    }

    private String encode(String value) {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String sign(String unsignedToken) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Unable to sign token");
        }
    }

    private boolean constantTimeEquals(String first, String second) {
        if (first.length() != second.length()) {
            return false;
        }

        int result = 0;
        for (int i = 0; i < first.length(); i++) {
            result |= first.charAt(i) ^ second.charAt(i);
        }

        return result == 0;
    }

    private String extractString(String json, String key) {
        String marker = "\"" + key + "\":\"";
        int start = json.indexOf(marker);
        if (start < 0) {
            throw new IllegalArgumentException("Missing token field");
        }
        start += marker.length();
        int end = json.indexOf("\"", start);
        return json.substring(start, end).replace("\\\"", "\"");
    }

    private String extractNumber(String json, String key) {
        String marker = "\"" + key + "\":";
        int start = json.indexOf(marker);
        if (start < 0) {
            throw new IllegalArgumentException("Missing token field");
        }
        start += marker.length();
        int end = json.indexOf(",", start);
        if (end < 0) {
            end = json.indexOf("}", start);
        }
        return json.substring(start, end);
    }

    private String escape(String value) {
        return value.replace("\"", "\\\"");
    }
}
