package org.pltv.homescape.exception;

public class NegativePageException extends Exception {

    public NegativePageException() {
        super("Page number must be positive");
    }

    public NegativePageException(String message) {
        super(message);
    }
}
