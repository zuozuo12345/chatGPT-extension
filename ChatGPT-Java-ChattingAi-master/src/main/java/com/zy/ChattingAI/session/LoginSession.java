package com.zy.ChattingAI.session;

import com.zy.ChattingAI.enums.LoginType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginSession {

    private String loginAcct;

    private String password;

    private LoginType loginType;

    private String ip;

    private String socialUid;
}
