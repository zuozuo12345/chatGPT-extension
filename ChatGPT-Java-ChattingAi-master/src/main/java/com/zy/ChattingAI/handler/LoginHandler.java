package com.zy.ChattingAI.handler;

import java.util.Map;

import com.zy.ChattingAI.session.LoginSession;

public interface LoginHandler {

    /**
     * 处理不同的登录情况
     * 
     * @param loginSession
     * @return
     */
    Map<String, Object> login(LoginSession loginSession);
}
