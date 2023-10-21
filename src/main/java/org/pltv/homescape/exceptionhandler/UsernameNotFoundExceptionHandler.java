package org.pltv.homescape.exceptionhandler;

import org.pltv.homescape.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UsernameNotFoundExceptionHandler {

    @ExceptionHandler({ UsernameNotFoundException.class })
    public ResponseEntity<Object> handleException(UsernameNotFoundException e) {
        return ResponseEntity.status(404).body(
                new ErrorResponse("Not Found", "404", e.getMessage()));
    }

}
