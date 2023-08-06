package com.zy.ChattingAI.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChattingAI.entity.SessionChatRecordEntity;

import java.util.List;

public interface SessionChatRecordService extends IService<SessionChatRecordEntity> {
    /**
     * 获取聊天记录
     * 
     * @param sessionId
     * @return
     */
    List<SessionChatRecordEntity> getSessionRecord(Integer sessionId);

    /**
     * 清空聊天记录
     * 
     * @param sessionId
     */
    void truncateSessionChatRecord(Integer sessionId);
}
