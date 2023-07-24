package com.zy.ChantingAI.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid credentials provided.");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
