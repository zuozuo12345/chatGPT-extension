package com.zy.ChattingAI.exception;

import com.zy.ChattingAI.utils.ReturnResult;

import lombok.Data;

@Data
public class BaseException extends RuntimeException {

    private final String msg;
    private final int code;

    public BaseException(String msg) {
        super(msg);
        this.code = ReturnResult.error().getCode();
        this.msg = msg;
    }

    public BaseException(int code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }

    public BaseException() {
        super(ReturnResult.error().getMessage());
        this.code = ReturnResult.error().getCode();
        this.msg = ReturnResult.error().getMessage();
    }
}
