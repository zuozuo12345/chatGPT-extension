package com.zy.ChantingAI.api.mengwang;

import com.zy.ChantingAI.dto.Result;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import javax.annotation.Resource;

/**
 * @Author :wuxiaodong
 * @Date: 2023/2/24 17:02
 * @Description:短信发送工具类
 */
@Component
@Data
@Slf4j
public class SmsComponent {
//    @Value("${sms.apikey}")
//    private String apiKey;
//    @Value("${sms.url}")
//    private String url;



//    public boolean send(String phone,String code) throws Exception {
//        String content = "您的验证码是：%s,两分钟内有效！(FunAI智能应用平台)";
//        content = URLEncoder.encode(String.format(content,code), "GBK");
//        String body ="apikey="+apiKey+"&mobile="+phone+"&content="+content;
//        String result = HttpClientUtil.post(url,body,"application/x-www-form-urlencoded","GBK", 10000, 10000);
//        JSONObject jsonObject = JSON.parseObject(result);
//        return (Integer)(jsonObject.get("result")) == 0;
//    }

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Value("${spring.mail.username}")
    private String from;   // 邮件发送人

    private final JavaMailSender mailSender;

    public SmsComponent(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    public Result send(String phone, String code) throws Exception {
        String subject = "ChatingAI Extension Verification Code";
        String context = "Hello, dear user! Your verification code: " + code + ",which is valid for five minutes. Wish you have a nice day!";

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(from);
        mailMessage.setTo(phone);
        mailMessage.setSubject(subject);
        mailMessage.setText(context);

        // 真正的发送邮件操作，从 from到 to
        mailSender.send(mailMessage);
        return Result.ok();
    }

//    @Override
//    public Result sendCode(String phone, HttpSession session) {
//        //1. 校验手机号
//        if (RegexUtils.isPhoneInvalid(phone)) {
//            //2.如果不符合，返回错误信息
//            return Result.fail("手机号格式错误");
//        }
//
//        //3. 符合，生成验证码
//        String code = RandomUtil.randomNumbers(6);
//        //4. 保存验证码到redis
//        stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);
////        session.setAttribute("code",code);
//        //5. 发送验证码
//        String subject = "Sharing Nearby Spots Verification Code";
//        String context = "Hello, dear user! Your verification code: " + code + ",which is valid for five minutes. Wish you have a nice day!";
//
//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setFrom(from);
//        mailMessage.setTo(phone);
//        mailMessage.setSubject(subject);
//        mailMessage.setText(context);
//
//        // 真正的发送邮件操作，从 from到 to
//        mailSender.send(mailMessage);
//
//        //返回ok
//        UserServiceImpl.log.debug("Send verification code successfully，Verification code:{}",code);
//        return Result.ok();
//    }






}
