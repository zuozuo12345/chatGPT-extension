package com.zy.ChantingAI.handler;

import com.zy.ChantingAI.session.LoginSession;

import java.util.Map;

/**
 * @Author: huangpenglong
 * @Date: 2023/4/30 20:51
 */
public interface LoginHandler {

    /**
     * 处理不同的登录情况
     * @param loginSession
     * @return
     */
    Map<String, Object> login(LoginSession loginSession);
}
