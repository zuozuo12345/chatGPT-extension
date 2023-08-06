package com.zy.ChattingAI.dto;

import lombok.Data;

@Data
public class UserLockRequest {
    private String userId;
    private Byte status;
}
