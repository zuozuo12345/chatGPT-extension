package com.zy.ChattingAI.api.openai.resp;

import lombok.Data;

@Data
public class Usage {
    private Integer prompt_tokens; // 请求的tokens
    private Integer completion_tokens; // 响应的tokens
    private Integer total_tokens;
}
