package com.zy.ChattingAI.exception;

public class EmailException extends RuntimeException {
    public EmailException() {
        super("存在相同的邮箱");
    }
}
