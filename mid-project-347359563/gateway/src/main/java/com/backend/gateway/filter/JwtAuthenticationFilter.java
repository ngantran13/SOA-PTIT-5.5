package com.backend.gateway.filter;

import com.backend.gateway.security.JwtAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter {

    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            String path = exchange.getRequest().getURI().getPath();
            log.info("Path: {}", path);
            if (path.contains("/login")) {
                log.info("Login path, skipping JWT authentication");
                return chain.filter(exchange);
            } else if (path.contains("/pay/place")) {
                log.info("payment path, skipping JWT authentication");
                return chain.filter(exchange);
            }
            log.info("Authorization header is missing or invalid");
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        if (jwtAuthenticationProvider.isTokenValid(token)) {
            log.info("Token is valid and not expired");
            return chain.filter(exchange);
        }
        log.info("Token is invalid or expired");
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
