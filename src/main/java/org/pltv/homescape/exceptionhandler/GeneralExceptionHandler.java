package org.pltv.homescape.exceptionhandler;

import org.pltv.homescape.dto.ErrorResponse;
import org.pltv.homescape.exception.BadRequestException;
import org.pltv.homescape.exception.ForbiddenException;
import org.pltv.homescape.exception.InternalServerException;
import org.pltv.homescape.exception.NegativePageException;
import org.pltv.homescape.exception.NotFoundException;
import org.pltv.homescape.exception.UnauthenticateException;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import io.jsonwebtoken.io.IOException;
import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GeneralExceptionHandler {
    @ExceptionHandler({ UsernameNotFoundException.class })
    public ResponseEntity<Object> handleException(UsernameNotFoundException e) {
        return ResponseEntity.status(404).body(
                new ErrorResponse("Not Found", "404", e.getMessage()));
    }

    @ExceptionHandler({ NegativePageException.class })
    public ResponseEntity<ErrorResponse> handleNegativePageException(NegativePageException e) {
        return ResponseEntity.badRequest().body(
                new ErrorResponse("Bad Request", "400", e.getMessage()));
    }

    @ExceptionHandler({ NotFoundException.class })
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException e) {
        return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(
                new ErrorResponse("Not Found", "404", e.getMessage()));
    }

    @ExceptionHandler({ UnauthenticateException.class })
    public ResponseEntity<ErrorResponse> handleUnauthenticateException(UnauthenticateException e) {
        return ResponseEntity.status(HttpStatusCode.valueOf(401)).body(
                new ErrorResponse("Unauthenticate", "401", e.getMessage()));
    }

    @ExceptionHandler({ ForbiddenException.class })
    public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenException e) {
        return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(
                new ErrorResponse("Forbidden", "403", e.getMessage()));
    }

    @ExceptionHandler({ BadRequestException.class })
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException e) {
        return ResponseEntity.status(HttpStatusCode.valueOf(400)).body(
                new ErrorResponse("Bad Request", "400", e.getMessage()));
    }

    @ExceptionHandler({ InternalServerException.class })
    public ResponseEntity<ErrorResponse> handleInternalServerException(InternalServerException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatusCode.valueOf(500)).body(
                new ErrorResponse("Internal Server Error", "500", e.getMessage()));
    }

    @ExceptionHandler({ IOException.class })
    public ResponseEntity<ErrorResponse> handleIOException(IOException e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(HttpStatusCode.valueOf(500)).body(
                new ErrorResponse("Internal Server Error", "500", e.getMessage()));
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error(e.getMessage(), e);
        return ResponseEntity.status(500).body(
                new ErrorResponse("Internal Server Error", "500", e.getMessage()));
    }
}
