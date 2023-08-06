package com.zy.ChattingAI.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.zy.ChattingAI.api.openai.req.ChatGPTReq;
import com.zy.ChattingAI.api.openai.resp.ChatGPTResp;
import com.zy.ChattingAI.api.openai.resp.CreditGrantsResp;
import com.zy.ChattingAI.enums.SessionType;

public interface ChatService {

    /**
     * 单轮聊天-普通输出
     * 
     * @param userId
     * @param chatGPTReq
     * @param apiKey
     * @return
     */
    ChatGPTResp oneShotChat(String userId, ChatGPTReq chatGPTReq, String apiKey);

    /**
     * 单轮聊天-流式输出
     * 
     * @param userId
     * @param chatGPTReq
     * @param apiKey
     * @param sseEmitter
     */
    void streamOneShotChat(String userId, ChatGPTReq chatGPTReq, String apiKey, SseEmitter sseEmitter);

    /**
     * 多轮聊天-普通输出
     * 
     * @param userId
     * @param sessionId
     * @param chatGPTReq
     * @param message
     * @param apiKey
     * @param sessionType
     * @return
     */
    ChatGPTResp sessionChat(String userId, Integer sessionId, ChatGPTReq chatGPTReq,
            String message, String apiKey, SessionType sessionType);

    /**
     * 单轮聊天-流式输出
     * 
     * @param userId
     * @param sessionId
     * @param chatGPTReq
     * @param message
     * @param apiKey
     * @param sseEmitter
     * @param sessionType
     */
    void streamSessionChat(String userId, Integer sessionId, ChatGPTReq chatGPTReq,
            String message, String apiKey, SseEmitter sseEmitter, SessionType sessionType);

    /**
     * 清除用户所有聊天会话的缓存
     * 
     * @param userId
     */
    void clearUserCache(String userId);

    /**
     * 手动刷新缓存
     * 
     * @param sessionId
     */
    void refreshWindowRecordCache(Integer sessionId);

    /**
     * 获取API-Key的额度
     * 
     * @param apiKey
     * @return
     */
    CreditGrantsResp creditGrants(String apiKey);

}
