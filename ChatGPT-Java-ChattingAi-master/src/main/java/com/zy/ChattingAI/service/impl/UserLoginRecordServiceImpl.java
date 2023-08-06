package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.entity.UserLoginRecord;
import com.zy.ChattingAI.mapper.UserLoginRecordMapper;
import com.zy.ChattingAI.service.UserLoginRecordService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserLoginRecordServiceImpl
                extends ServiceImpl<UserLoginRecordMapper, UserLoginRecord>
                implements UserLoginRecordService {

}
