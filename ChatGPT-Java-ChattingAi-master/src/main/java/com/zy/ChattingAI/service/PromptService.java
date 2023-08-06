package com.zy.ChattingAI.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChattingAI.dto.PromptQueryRequest;
import com.zy.ChattingAI.entity.PromptEntity;
import com.zy.ChattingAI.enums.PromptType;

import java.util.List;

public interface PromptService extends IService<PromptEntity> {
    /**
     * 查询prompt列表
     * 
     * @param page
     * @param limit
     * @param hospitalQueryVo
     * @return
     */
    IPage<PromptEntity> list(int page, int limit, PromptQueryRequest hospitalQueryVo);

    /**
     * 根据 `主题` 获取提示
     * 实现：缓存
     * 
     * @param topic
     * @return
     */
    String getByTopic(String topic);

    /**
     * 根据枚举类`PromptType`获取提示列表
     * 
     * @param promptType
     * @return
     */
    List<PromptEntity> getByType(PromptType promptType);

    /**
     * 加载缓存
     */
    void load();
}
