package com.backend.gateway.exception;

import com.backend.gateway.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        return new ResponseEntity<>(
                ErrorResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .timestamp(LocalDateTime.now())
                        .build(),
                errorCode.getStatusCode()
        );
    }
}
