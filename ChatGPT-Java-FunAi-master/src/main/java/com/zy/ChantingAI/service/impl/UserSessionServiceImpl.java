package com.zy.ChantingAI.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChantingAI.entity.UserSessionEntity;
import com.zy.ChantingAI.enums.SessionType;
import com.zy.ChantingAI.mapper.UserSessionMapper;
import com.zy.ChantingAI.service.UserSessionService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: huangpenglong
 * @Date: 2023/3/17 15:34
 */

@Service
public class UserSessionServiceImpl extends ServiceImpl<UserSessionMapper, UserSessionEntity> implements UserSessionService {

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
