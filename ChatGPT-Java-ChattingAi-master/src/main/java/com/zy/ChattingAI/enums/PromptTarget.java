package com.zy.ChattingAI.enums;

public enum PromptTarget {

    /**
     * 0: 管理员
     * 1: 用户
     */
    ADMIN("管理员", 0),
    USER("用户", 1);

    public final String targetName;
    public final int targetNo;

    PromptTarget(String targetName, int targetNo) {
        this.targetName = targetName;
        this.targetNo = targetNo;
    }
}
