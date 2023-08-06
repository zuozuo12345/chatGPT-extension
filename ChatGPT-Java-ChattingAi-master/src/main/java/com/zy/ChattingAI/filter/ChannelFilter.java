package com.zy.ChattingAI.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import com.zy.ChattingAI.utils.RequestWrapper;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

@Component
@Slf4j
@WebFilter(filterName = "channelFilter", urlPatterns = { "/*" })
public class ChannelFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        try {
            long start = System.currentTimeMillis();
            ServletRequest requestWrapper = new RequestWrapper((HttpServletRequest) request);
            chain.doFilter(requestWrapper, response);
            String requestUri = ((HttpServletRequest) request).getRequestURI();
            log.info("ip{}, 访问路径{}完毕，耗时：{}ms", request.getRemoteAddr(), requestUri, System.currentTimeMillis() - start);
        } catch (Exception e) {
            e.getMessage();
            log.error(e.getMessage());
        }
    }
}
