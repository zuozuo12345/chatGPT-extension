package com.zy.ChantingAI.controller;

import com.google.common.collect.ImmutableList;
import com.zy.ChantingAI.api.openai.constant.OpenAIConst;
import com.zy.ChantingAI.api.openai.enums.Role;
import com.zy.ChantingAI.api.openai.req.ChatGPTReq;
import com.zy.ChantingAI.api.openai.req.ContextMessage;
import com.zy.ChantingAI.api.openai.resp.ChatGPTResp;
import com.zy.ChantingAI.dto.TranslationRequest;
import com.zy.ChantingAI.entity.UserApiKeyEntity;
import com.zy.ChantingAI.enums.ApiType;
import com.zy.ChantingAI.enums.Prompt;
import com.zy.ChantingAI.service.AdminApiKeyService;
import com.zy.ChantingAI.service.ChatService;
import com.zy.ChantingAI.service.PromptService;
import com.zy.ChantingAI.service.UserApiKeyService;
import com.zy.ChantingAI.utils.ResultCode;
import com.zy.ChantingAI.utils.ReturnResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;

/**
 * @Author : oujiajun
 * @Date: 2023/3/30
 * @Description: 翻译
 */

@RestController
@CrossOrigin
@Slf4j
@RequestMapping("/translation")
public class TranslationController {
    private static final String NAME_MESSAGE = "translateResult";

    @Resource
    private ChatService chatService;
    @Resource
    private AdminApiKeyService adminApiKeyService;
    @Resource
    private PromptService promptService;
    @Resource
    private UserApiKeyService userApiKeyService;

    /**
     * 翻译
     * @param req
     * @return
     */
    @PostMapping("/translate")
    public ReturnResult translate(@RequestBody @Valid TranslationRequest req) {
        if (StringUtils.isEmpty(req.getMessage()) || req.getUserId() == null) {
            return ReturnResult.error().codeAndMessage(ResultCode.EMPTY_PARAM);
        }

        String reqMsg = String.format(promptService.getByTopic(Prompt.TRANSLATE.topic), req.getLanguage(), req.getMessage());

        // 若用户上传了apikey则使用用户的，否则采用本系统的
        UserApiKeyEntity userApiKeyEntity = userApiKeyService.getByUserIdAndType(req.getUserId(), ApiType.OPENAI);
        String apiKey = userApiKeyEntity != null && !StringUtils.isEmpty(userApiKeyEntity.getApikey())
                ? userApiKeyEntity.getApikey()
                : adminApiKeyService.roundRobinGetByType(ApiType.OPENAI);
        if(apiKey == null){
            return ReturnResult.error().codeAndMessage(ResultCode.ADMIN_APIKEY_NULL);
        }

        // 调用对话接口
        ChatGPTReq gptReq = ChatGPTReq.builder()
                .messages(ImmutableList.of(new ContextMessage(Role.USER.name, reqMsg)))
                .model(OpenAIConst.MODEL_NAME_CHATGPT_3_5)
                .build();

        ChatGPTResp resp = chatService.oneShotChat(req.getUserId(), gptReq, apiKey);

        if (resp.getMessage() == null) {
            return ReturnResult.error();
        }
        return ReturnResult.ok().data(NAME_MESSAGE, resp.getMessage());
    }

}
