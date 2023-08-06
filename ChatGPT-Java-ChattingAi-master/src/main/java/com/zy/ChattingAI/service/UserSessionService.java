package com.zy.ChattingAI.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChattingAI.entity.UserSessionEntity;
import com.zy.ChattingAI.enums.SessionType;

import java.util.List;

public interface UserSessionService extends IService<UserSessionEntity> {

    /**
     * 新增会话
     * 
     * @param userId
     * @param sessionName
     * @param sessionType
     * @return
     */
    UserSessionEntity save(String userId, String sessionName, SessionType sessionType);

    /**
     * 查询会话
     * 
     * @param userId
     * @param sessionType
     * @return
     */
    List<UserSessionEntity> getSessionList(String userId, SessionType sessionType);
}
