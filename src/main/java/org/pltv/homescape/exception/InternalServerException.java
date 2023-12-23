package org.pltv.homescape.exception;

public class InternalServerException extends Exception {
    public InternalServerException() {
        super("Internal server error");
    }

    public InternalServerException(String message) {
        super(message);
    }
}
