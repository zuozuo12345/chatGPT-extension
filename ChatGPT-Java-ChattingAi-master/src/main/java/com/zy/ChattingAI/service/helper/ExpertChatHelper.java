package com.zy.ChattingAI.service.helper;

import org.springframework.stereotype.Component;

import com.zy.ChattingAI.api.openai.ChatGPTApi;
import com.zy.ChattingAI.api.openai.enums.Role;
import com.zy.ChattingAI.entity.SessionChatRecordEntity;
import com.zy.ChattingAI.entity.UserSessionEntity;
import com.zy.ChattingAI.service.PromptService;
import com.zy.ChattingAI.service.SessionChatRecordService;
import com.zy.ChattingAI.service.UserSessionService;

import javax.annotation.Resource;

@Component
public class ExpertChatHelper {
    @Resource
    SessionChatRecordService sessionChatRecordService;
    @Resource
    PromptService promptService;
    @Resource
    UserSessionService userSessionService;

    private ExpertChatHelper() {
    }

    public boolean handleSessionSystemRecord(UserSessionEntity userSessionEntity) {
        String[] split = userSessionEntity.getSessionName().split(":");
        String prompt = promptService.getByTopic(split[split.length - 2]);
        SessionChatRecordEntity sessionChatRecordEntity = new SessionChatRecordEntity(
                userSessionEntity.getSessionId(), Role.SYSTEM.name, prompt, ChatGPTApi.getMessageTokenNum(prompt));
        return sessionChatRecordService.save(sessionChatRecordEntity);
    }

    public String getExpertChatLanguage(Integer sessionId) {
        UserSessionEntity userSessionEntity = userSessionService.getById(sessionId);
        String[] split = userSessionEntity.getSessionName().split(":");
        return split[split.length - 1];
    }
}
