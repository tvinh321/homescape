package org.pltv.homescape.exception;

public class NotFoundException extends Exception {
    public NotFoundException() {
        super("Not found");
    }

    public NotFoundException(String message) {
        super(message);
    }
}
