package org.pltv.homescape.exceptionhandler;

import org.pltv.homescape.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GeneralExceptionHandler {

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handleException(Exception e) {
        return ResponseEntity.status(500).body(
                new ErrorResponse("Internal Server Error", "500", e.getMessage()));
    }

}
