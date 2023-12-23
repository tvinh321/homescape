package org.pltv.homescape.exception;

public class BadRequestException extends Exception {
    public BadRequestException() {
        super("Bad request");
    }

    public BadRequestException(String message) {
        super(message);
    }
}
