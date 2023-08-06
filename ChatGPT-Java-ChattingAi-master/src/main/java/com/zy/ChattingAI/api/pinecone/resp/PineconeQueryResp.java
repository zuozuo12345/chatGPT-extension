package com.zy.ChattingAI.api.pinecone.resp;

import lombok.Data;

import java.util.List;

@Data
public class PineconeQueryResp {

    private List<String> results;

    /**
     * 匹配的结果
     */
    private List<PineconeQueryDownResp> matches;

    /**
     * 命名空间
     */
    private String namespace;
}
