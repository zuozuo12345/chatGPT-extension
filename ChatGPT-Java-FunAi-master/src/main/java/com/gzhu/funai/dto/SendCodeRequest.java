package com.gzhu.funai.dto;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;

/**
 * @Author :wuxiaodong
 * @Date: 2023/4/24 11:36
 * @Description:
 */
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