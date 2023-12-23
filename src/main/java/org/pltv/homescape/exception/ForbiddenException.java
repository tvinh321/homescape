package org.pltv.homescape.exception;

public class ForbiddenException extends Exception {
    public ForbiddenException() {
        super("Forbidden");
    }

    public ForbiddenException(String message) {
        super(message);
    }
}
