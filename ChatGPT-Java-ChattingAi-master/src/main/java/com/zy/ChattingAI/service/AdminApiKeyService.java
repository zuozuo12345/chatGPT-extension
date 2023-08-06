package com.zy.ChattingAI.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChattingAI.entity.AdminApiKeyEntity;
import com.zy.ChattingAI.enums.ApiType;

import java.util.List;

public interface AdminApiKeyService extends IService<AdminApiKeyEntity> {

    /**
     * 根据枚举类ApiType获取apikey列表
     * 
     * @param apiTypes
     * @return
     */
    List<AdminApiKeyEntity> getListByType(ApiType apiTypes);

    /**
     * 判断当前类型的apikey是否在库内
     * 
     * @param apiTypes
     * @param apiKey
     * @return
     */
    boolean contains(ApiType apiTypes, String apiKey);

    /**
     * 根据apikey的类型，使用轮询算法获取一个apiKey
     * 
     * @param apiTypes
     * @return
     */
    String roundRobinGetByType(ApiType apiTypes);

    /**
     * 刷新缓存
     */
    void load();

    /**
     * 根据apikey的类型，获取优先级最高的apikey
     * 
     * @param apiTypes
     * @return
     */
    String getBestByType(ApiType apiTypes);
}
