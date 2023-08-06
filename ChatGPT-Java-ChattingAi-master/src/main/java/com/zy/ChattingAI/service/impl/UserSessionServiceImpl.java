package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.entity.UserSessionEntity;
import com.zy.ChattingAI.enums.SessionType;
import com.zy.ChattingAI.mapper.UserSessionMapper;
import com.zy.ChattingAI.service.UserSessionService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSessionServiceImpl extends ServiceImpl<UserSessionMapper, UserSessionEntity>
        implements UserSessionService {

    @Override
    public UserSessionEntity save(String userId, String sessionName, SessionType sessionType) {
        UserSessionEntity userSession = new UserSessionEntity(userId, sessionName, sessionType.type);
        baseMapper.insert(userSession);
        return userSession;
    }

    @Override
    public List<UserSessionEntity> getSessionList(String userId, SessionType sessionType) {
        return baseMapper.selectList(new QueryWrapper<UserSessionEntity>()
                .eq("user_id", userId)
                .eq("type", sessionType.type));
    }
}
