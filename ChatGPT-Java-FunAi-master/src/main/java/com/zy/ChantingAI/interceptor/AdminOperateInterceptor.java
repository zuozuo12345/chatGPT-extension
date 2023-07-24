package com.zy.ChantingAI.interceptor;

import com.google.gson.Gson;
import com.zy.ChantingAI.enums.UserLevel;
import com.zy.ChantingAI.utils.JwtUtil;
import com.zy.ChantingAI.utils.ResultCode;
import com.zy.ChantingAI.utils.ReturnResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Author: huangpenglong
 * @Date: 2023/4/17 9:04
 */

@Slf4j
public class AdminOperateInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("token");

        try {
            UserLevel uLevel = UserLevel.get(JwtUtil.getUserLevel(token));
            if (!UserLevel.ADMIN.equals(uLevel)){
                out(ReturnResult.error()
                        .code(ResultCode.ADMIN_OPERATE_FORBIDDEN.code)
                        .message(ResultCode.ADMIN_OPERATE_FORBIDDEN.msg), response);
                return false;
            }
        } catch (Exception e) {
            out(ReturnResult.error().code(ResultCode.USER_NOT_LOGIN.code).message(ResultCode.USER_NOT_LOGIN.msg), response);
            return false;
        }
        return true;
    }


    /**
     * 失败时返回数据
     */
    private void out(ReturnResult result, HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        response.getWriter().write(gson.toJson(result));
    }
}
