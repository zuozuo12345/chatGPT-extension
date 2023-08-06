package com.zy.ChattingAI.api.pinecone.req;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Builder
@Data
public class PineconeDeleteReq {

    private List<String> ids;

    private boolean deleteAll;

    private String namespace;

    private Map<String, String> filter;

}
