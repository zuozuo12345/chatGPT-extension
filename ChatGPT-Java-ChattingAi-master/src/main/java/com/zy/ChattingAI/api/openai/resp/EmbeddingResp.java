package com.zy.ChattingAI.api.openai.resp;

import lombok.Data;

import java.util.List;

@Data
public class EmbeddingResp {

    String model;

    String object;

    List<Embedding> data;

    Usage usage;
}
