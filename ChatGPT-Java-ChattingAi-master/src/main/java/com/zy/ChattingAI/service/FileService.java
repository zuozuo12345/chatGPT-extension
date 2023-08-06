package com.zy.ChattingAI.service;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

public interface FileService {

    /**
     * 将内容导出成CSV格式的文件，放入响应体中
     *
     * @param titleRow
     * @param contentList
     * @param response
     * @return
     */
    boolean exportCsv(String[] titleRow, List<String[]> contentList, HttpServletResponse response);
}
