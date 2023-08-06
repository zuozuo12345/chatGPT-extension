package com.zy.ChattingAI.service.impl;

import com.opencsv.CSVWriter;
import com.opencsv.CSVWriterBuilder;
import com.zy.ChattingAI.service.FileService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Slf4j
public class FileServiceImpl implements FileService {
    @Override
    public boolean exportCsv(String[] titleRow, List<String[]> contentList, HttpServletResponse response) {
        if (titleRow.length == 0 || CollectionUtils.isEmpty(contentList)) {
            return false;
        }

        try (ServletOutputStream out = response.getOutputStream()) {
            OutputStreamWriter writer = new OutputStreamWriter(out, StandardCharsets.UTF_8);
            CSVWriter csvWriter = (CSVWriter) new CSVWriterBuilder(writer).build();
            // 写入标题行
            csvWriter.writeNext(titleRow, false);
            // 写入数据行
            csvWriter.writeAll(contentList, false);

            csvWriter.flush();
            csvWriter.close();
            log.info("聊天记录导出成功！");
            return true;
        } catch (IOException e) {
            log.error("解析excel异常！");
        }

        return false;
    }
}
