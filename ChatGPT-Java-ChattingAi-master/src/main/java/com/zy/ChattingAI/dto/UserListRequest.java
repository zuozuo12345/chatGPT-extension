package com.zy.ChattingAI.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserListRequest {
    // 查询条件，用户名/手机号
    private String key;
    private Date startTime;
    private Date endTime;
    private Integer level;
    private Integer status;
}
