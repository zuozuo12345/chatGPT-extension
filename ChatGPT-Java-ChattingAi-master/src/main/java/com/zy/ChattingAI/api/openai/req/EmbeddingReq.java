package com.zy.ChattingAI.api.openai.req;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class EmbeddingReq {

    @Builder.Default
    /**
     * 模型名字
     */
    private String model = "text-embedding-ada-002";

    private List<String> input;

    /**
     * 用户的唯一标识符，可以帮助 OpenAI 监控和检测滥用行为
     */
    @Builder.Default
    private String user = "xxx";
}
