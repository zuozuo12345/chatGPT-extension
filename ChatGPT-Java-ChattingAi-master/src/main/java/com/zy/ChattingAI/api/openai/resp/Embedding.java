package com.zy.ChattingAI.api.openai.resp;

import lombok.Data;

import java.util.List;

@Data
public class Embedding {

    String object;

    List<Float> embedding;

    Integer index;
}
