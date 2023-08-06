package com.zy.ChattingAI.controller;

import org.springframework.web.bind.annotation.*;

import com.zy.ChattingAI.service.AdminApiKeyService;
import com.zy.ChattingAI.utils.ReturnResult;

import javax.annotation.Resource;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Resource
    private AdminApiKeyService adminApiKeyService;

    /**
     * 刷新系统用的ApiKey缓存
     * 
     * @return
     */
    @GetMapping("/flushApiKey")
    public ReturnResult flushApiKey() {
        adminApiKeyService.load();
        return ReturnResult.ok();
    }
}
