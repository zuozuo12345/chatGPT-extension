package com.zy.ChattingAI.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zy.ChattingAI.dto.UserListRequest;
import com.zy.ChattingAI.dto.UserRegisterRequest;
import com.zy.ChattingAI.dto.UserResetPasswordRequest;
import com.zy.ChattingAI.entity.UserEntity;
import com.zy.ChattingAI.enums.LoginType;
import com.zy.ChattingAI.exception.BaseException;
import com.zy.ChattingAI.exception.InvalidCredentialsException;
import com.zy.ChattingAI.handler.LoginHandler;
import com.zy.ChattingAI.handler.impl.NormalLoginHandler;
import com.zy.ChattingAI.handler.impl.VisitorLoginHandler;
import com.zy.ChattingAI.mapper.UserMapper;
import com.zy.ChattingAI.redis.ChatRedisHelper;
import com.zy.ChattingAI.redis.RedisKeys;
import com.zy.ChattingAI.service.UserService;
import com.zy.ChattingAI.session.LoginSession;
import com.zy.ChattingAI.utils.PasswordEncoderUtil;

import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.EnumMap;
import java.util.Map;

@Service(value = "UserServiceImpl")
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements UserService {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Resource
    private NormalLoginHandler normalLoginHandler;
    @Resource
    private VisitorLoginHandler visitorLoginHandler;
    @Resource
    private ChatRedisHelper chatRedisHelper;

    private static final String MAP_KEY_USERNAME = "username";
    private static final String MAP_KEY_MOBILE = "mobile";

    private static final String MAP_KEY_CREATE_TIME = "creåate_time";

    private final Map<LoginType, LoginHandler> loginHandlerMap = new EnumMap<>(LoginType.class);

    /**
     * 使用@PostConstruct注解的方法需要在依赖注入完成之后执行。
     * 该注解只能用于被Spring管理的bean中的方法，且只执行一次。
     * 在方法完成后，bean就可以使用了。
     */
    @PostConstruct
    public void init() {
        loginHandlerMap.put(LoginType.NORMAL, normalLoginHandler);
        loginHandlerMap.put(LoginType.VISITOR, visitorLoginHandler);
    }

    // @Override
    // public UserEntity register(UserRegisterRequest req) {
    // // 1、用户名、电话判重
    // if (req.getPhone() != null && this.baseMapper.selectCount(new
    // QueryWrapper<UserEntity>()
    // .eq(MAP_KEY_MOBILE, req.getPhone())) > 0 ) {
    // throw new PhoneException();
    // }
    // if (req.getUserName() != null && this.baseMapper.selectCount(new
    // QueryWrapper<UserEntity>()
    // .eq(MAP_KEY_USERNAME, req.getUserName())) > 0 ) {
    // throw new UsernameException();
    // }
    // // 2、封装实体对象并持久化
    // UserEntity userEntity = UserEntity.of(req);
    //
    // // 3、密码进行MD5盐值加密.不能直接对原密码加密，可能有网站收集了大量常见的MD5加密后的密码，暴力解法。
    // // 加盐增加密码的复杂性再进行加密减小被破解的可能性。
    // if (req.getPassword() != null) {
    // userEntity.setPassword(PasswordEncoderUtil.encoder.encode(req.getPassword()));
    // }
    //
    // this.baseMapper.insert(userEntity);
    //
    // return userEntity;
    // }

    @Override
    public UserEntity register(UserRegisterRequest req) {
        // 1. Check if there's an existing user with the provided phone or username
        UserEntity existingUser = null;

        if (req.getPhone() != null) {
            existingUser = this.baseMapper.selectOne(new QueryWrapper<UserEntity>().eq(MAP_KEY_MOBILE, req.getPhone()));
        }

        if (existingUser == null && req.getUserName() != null) {
            existingUser = this.baseMapper
                    .selectOne(new QueryWrapper<UserEntity>().eq(MAP_KEY_USERNAME, req.getUserName()));
        }

        // 2. If an existing user is found, verify the password
        if (existingUser != null) {
            if (req.getPassword() != null
                    && PasswordEncoderUtil.encoder.matches(req.getPassword(), existingUser.getPassword())) {
                // Password matches. Consider user as logged in and return
                return existingUser;
            } else {
                // Password doesn't match. Handle this scenario, maybe throw an exception or
                // return an error
                throw new InvalidCredentialsException();
            }
        }

        // 3. If we're here, it means it's a new user. Register them
        UserEntity userEntity = UserEntity.of(req);

        if (req.getPassword() != null) {
            userEntity.setPassword(PasswordEncoderUtil.encoder.encode(req.getPassword()));
        }

        this.baseMapper.insert(userEntity);

        return userEntity;
    }

    @Override
    public Map<String, Object> login(LoginSession loginSession) {
        return loginHandlerMap.get(loginSession.getLoginType()).login(loginSession);
    }

    @Override
    public boolean resetPwd(UserResetPasswordRequest request) {
        // 先校验手机验证码
        String flag = stringRedisTemplate.opsForValue()
                .get(String.format(RedisKeys.USER_REGISTER_CODE, request.getPhone()));
        if (flag == null || !flag.equals(request.getCode())) {
            throw new BaseException("验证码无效");
        }
        UserEntity entity = this.getOne(new QueryWrapper<UserEntity>().eq(MAP_KEY_MOBILE, request.getPhone()));
        if (entity != null) {
            entity.setPassword(PasswordEncoderUtil.encoder.encode(request.getNewPwd()));
            this.updateById(entity);
            return true;
        }
        return false;
    }

    @Override
    public IPage<UserEntity> getUserListByCondition(UserListRequest userListRequset, Long limit, Long page) {
        QueryWrapper<UserEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(!StringUtils.isEmpty(userListRequset.getKey()), MAP_KEY_USERNAME, userListRequset.getKey())
                .or()
                .eq(!StringUtils.isEmpty(userListRequset.getKey()), MAP_KEY_MOBILE, userListRequset.getKey());
        queryWrapper.eq(userListRequset.getLevel() != null,
                "level", userListRequset.getLevel());
        queryWrapper.eq(userListRequset.getStatus() != null,
                "status", userListRequset.getStatus());
        queryWrapper.ge(userListRequset.getStartTime() != null && userListRequset.getEndTime() == null,
                MAP_KEY_CREATE_TIME, userListRequset.getStartTime());
        queryWrapper.le(userListRequset.getStartTime() == null && userListRequset.getEndTime() != null,
                MAP_KEY_CREATE_TIME, userListRequset.getEndTime());
        queryWrapper.ge(userListRequset.getStartTime() != null && userListRequset.getEndTime() != null,
                MAP_KEY_CREATE_TIME, userListRequset.getStartTime());
        queryWrapper.le(userListRequset.getStartTime() != null && userListRequset.getEndTime() != null,
                MAP_KEY_CREATE_TIME, userListRequset.getEndTime());

        queryWrapper.orderByDesc("id");
        return this.page(new Page<>(page, limit), queryWrapper);
    }

    @Override
    public boolean lock(String userId, Byte status) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setStatus(status);
        return this.updateById(userEntity);
    }

    @Override
    public boolean changeLevel(String userId, int level) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);
        userEntity.setLevel(level);
        boolean update = this.updateById(userEntity);
        if (update) {
            chatRedisHelper.truncateLimit(userId);
        }
        return update;
    }

    @Override
    public UserEntity findByPhone(String phone) {
        if (phone == null) {
            return null;
        }

        return this.baseMapper.selectOne(
                new QueryWrapper<UserEntity>().eq(MAP_KEY_MOBILE, phone));
    }

}
