package com.zy.ChantingAI.controller;

import com.zy.ChantingAI.service.AdminApiKeyService;
import com.zy.ChantingAI.utils.ReturnResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * @Author: huangpenglong
 * @Date: 2023/4/10 23:59。
 */
@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Resource
    private AdminApiKeyService adminApiKeyService;

    /**
     * 刷新系统用的ApiKey缓存
     * @return
     */
    @GetMapping("/flushApiKey")
    public ReturnResult flushApiKey(){
        adminApiKeyService.load();
        return ReturnResult.ok();
    }
}
