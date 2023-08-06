package com.zy.ChattingAI.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    public static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private PasswordEncoderUtil() {

    }
}
