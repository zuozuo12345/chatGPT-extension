package com.zy.ChattingAI.api.openai.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class BillingUsage {
    private BigDecimal totalAmount;

    private BigDecimal totalUsage;

    /**
     * 过期时间，windows时间戳
     */
    private LocalDate expiredTime;
}
