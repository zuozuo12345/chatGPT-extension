package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.entity.UserApiKeyEntity;
import com.zy.ChattingAI.enums.ApiType;
import com.zy.ChattingAI.mapper.UserApiKeyMapper;
import com.zy.ChattingAI.service.UserApiKeyService;

import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class UserApiKeyServiceImpl extends ServiceImpl<UserApiKeyMapper, UserApiKeyEntity>
        implements UserApiKeyService {

    @Resource
    private UserApiKeyMapper userApiKeyMapper;

    @Override
    public UserApiKeyEntity getByUserIdAndType(String userId, ApiType type) {

        return baseMapper.selectOne(new QueryWrapper<UserApiKeyEntity>()
                .eq("user_id", userId)
                .eq("type", type.typeNo));
    }

    @Override
    public void insertOrUpdate(UserApiKeyEntity userApiKeyEntity) {
        userApiKeyMapper.insertOrUpdate(userApiKeyEntity.getUserId(), userApiKeyEntity.getType(),
                userApiKeyEntity.getApikey());
    }
}
