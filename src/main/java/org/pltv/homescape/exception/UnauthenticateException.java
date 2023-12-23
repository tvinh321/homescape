package org.pltv.homescape.exception;

public class UnauthenticateException extends Exception {
    public UnauthenticateException() {
        super("Unauthenticate");
    }

    public UnauthenticateException(String message) {
        super(message);
    }
}
