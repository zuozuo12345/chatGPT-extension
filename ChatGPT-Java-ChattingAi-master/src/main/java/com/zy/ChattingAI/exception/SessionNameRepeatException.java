package com.zy.ChattingAI.exception;

public class SessionNameRepeatException extends RuntimeException {
    public SessionNameRepeatException(String message) {
        super(message);
    }
}
