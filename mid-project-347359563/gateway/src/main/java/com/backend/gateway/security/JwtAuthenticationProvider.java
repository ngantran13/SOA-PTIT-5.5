package com.backend.gateway.security;

import com.backend.gateway.exception.AppException;
import com.backend.gateway.exception.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.Key;

@Component
@Slf4j
public class JwtAuthenticationProvider {

    private String jwtSecretKey = "8faed09b5996bedfab1308be2dcea3332026f1ccd1cbd378428de4dd4f90b4a7";

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(jwtSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractAllClaims(String token) {
        try {
            System.out.println(jwtSecretKey);
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.error("Token expired: {}", e.getMessage());
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        } catch (JwtException e) {
            log.error("Invalid token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public boolean isTokenValid(String token) {
        extractAllClaims(token);
        return true;
    }
}
