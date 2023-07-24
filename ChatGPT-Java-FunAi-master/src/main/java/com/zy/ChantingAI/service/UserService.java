package com.zy.ChantingAI.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.zy.ChantingAI.dto.UserListRequest;
import com.zy.ChantingAI.dto.UserRegisterRequest;
import com.zy.ChantingAI.dto.UserResetPasswordRequest;
import com.zy.ChantingAI.entity.UserEntity;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zy.ChantingAI.session.LoginSession;

import java.util.Map;

/**
 *@Author :wuxiaodong
 *@Date: 2023/3/16 16:48
 *@Description:
 */
public interface UserService extends IService<UserEntity>{
    /**
     * 注册
     * @param userRegisterVo
     * @return
     */
    UserEntity register(UserRegisterRequest userRegisterVo);

    /**
     * 登录
     * @param loginSession
     * @return
     */
    Map<String,Object> login(LoginSession loginSession);

    /**
     * 重新设置密码
     * @param request
     * @return
     */
    boolean resetPwd(UserResetPasswordRequest request);

    IPage<UserEntity> getUserListByCondition(UserListRequest userListRequset, Long limit , Long page);

    boolean lock(String userId, Byte status);

    /**
     * 修改用户等级
     * 修改后用户当日的聊天 和 文件上传次数限制清空
     * @param userId
     * @param level
     * @return
     */
    boolean changeLevel(String userId, int level);

    UserEntity findByPhone(String phone);

//    UserEntity findByPhone(String phone);
}
