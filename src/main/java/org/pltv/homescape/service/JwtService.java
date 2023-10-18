package org.pltv.homescape.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private int expiration;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    private Claims extractClaims(String token) {
        return (Claims) Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
    }

    public String getEmailFromToken(String token) throws Exception {
        validateToken(token);
        Claims claims = extractClaims(token);
        return claims.getSubject();
    }

    public String generateToken(UserDetails user) {
        return Jwts.builder()
                .signWith(getSecretKey())
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .compact();
    }

    public boolean validateToken(String token) throws Exception {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().after(new Date(System.currentTimeMillis()));
        } catch (Exception e) {
            throw new Exception("Invalid token");
        }
    }
}
