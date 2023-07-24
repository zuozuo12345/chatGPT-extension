package com.zy.ChantingAI.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChantingAI.entity.UserAdvicesEntity;
import com.zy.ChantingAI.mapper.UserAdvicesMapper;
import com.zy.ChantingAI.service.UserAdvicesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserAdvicesServiceImpl extends ServiceImpl<UserAdvicesMapper, UserAdvicesEntity>
        implements UserAdvicesService {
}
