package com.zy.ChattingAI.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChattingAI.entity.UserApiKeyEntity;
import com.zy.ChattingAI.enums.ApiType;

public interface UserApiKeyService extends IService<UserApiKeyEntity> {

    /**
     * 获取用户的ApiKey
     * 
     * @param userId
     * @param type
     * @return
     */
    UserApiKeyEntity getByUserIdAndType(String userId, ApiType type);

    /**
     * 根据唯一键 userId 和 type来决定插入还是更新数据
     * 
     * @param userApiKeyEntity
     */
    void insertOrUpdate(UserApiKeyEntity userApiKeyEntity);
}
