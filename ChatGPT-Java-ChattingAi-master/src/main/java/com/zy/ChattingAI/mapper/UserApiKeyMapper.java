package com.zy.ChattingAI.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zy.ChattingAI.entity.UserApiKeyEntity;

import org.apache.ibatis.annotations.Param;

public interface UserApiKeyMapper extends BaseMapper<UserApiKeyEntity> {

    void insertOrUpdate(@Param("userId") String userId, @Param("type") Integer type, @Param("apikey") String apikey);
}
