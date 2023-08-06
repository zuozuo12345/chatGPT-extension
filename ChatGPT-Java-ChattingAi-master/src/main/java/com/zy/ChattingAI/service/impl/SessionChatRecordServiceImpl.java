package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.entity.SessionChatRecordEntity;
import com.zy.ChattingAI.mapper.SessionChatRecordMapper;
import com.zy.ChattingAI.service.SessionChatRecordService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionChatRecordServiceImpl
        extends ServiceImpl<SessionChatRecordMapper, SessionChatRecordEntity>
        implements SessionChatRecordService {

    @Override
    public List<SessionChatRecordEntity> getSessionRecord(Integer sessionId) {
        return baseMapper.selectList(new QueryWrapper<SessionChatRecordEntity>()
                .eq("session_id", sessionId)
                .orderByAsc("session_chat_id"));
    }

    @Override
    public void truncateSessionChatRecord(Integer sessionId) {
        baseMapper.delete(new QueryWrapper<SessionChatRecordEntity>().eq("session_id", sessionId));
    }
}
