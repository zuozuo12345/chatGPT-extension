package com.zy.ChattingAI.api.pinecone.req;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class PineconeInsertReq {

    /**
     * 需要插入的文本的向量库
     */
    private List<PineconeVectorsReq> vectors;

    /**
     * 命名空间，用于区分每个文本
     */
    private String namespace;
}
