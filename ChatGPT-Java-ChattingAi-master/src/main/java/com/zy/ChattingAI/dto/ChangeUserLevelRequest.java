package com.zy.ChattingAI.dto;

import lombok.Data;

@Data
public class ChangeUserLevelRequest {
    private String userId;
    private Integer originalLevel;
    private Integer level;
}
