package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.entity.UserAdvicesEntity;
import com.zy.ChattingAI.mapper.UserAdvicesMapper;
import com.zy.ChattingAI.service.UserAdvicesService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserAdvicesServiceImpl extends ServiceImpl<UserAdvicesMapper, UserAdvicesEntity>
                implements UserAdvicesService {
}
