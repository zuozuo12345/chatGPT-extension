package com.zy.ChattingAI.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

//@Data
//public class SendCodeRequest {
//    @Valid
//    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "Invalid phone number")
//    private String phone;
//}

@Data
public class SendCodeRequest {
    @Valid
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Invalid email format")
    private String phone;
}