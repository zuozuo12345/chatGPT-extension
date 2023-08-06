package com.zy.ChattingAI.api.openai.enums;

public enum Role {
    SYSTEM("system"),
    USER("user"),
    ASSISTANT("assistant");

    public final String name;

    Role(String name) {
        this.name = name;
    }
}
