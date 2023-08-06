package com.zy.ChattingAI.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.zy.ChattingAI.dto.PromptQueryRequest;
import com.zy.ChattingAI.entity.PromptEntity;
import com.zy.ChattingAI.enums.PromptTarget;
import com.zy.ChattingAI.enums.PromptType;
import com.zy.ChattingAI.service.PromptService;
import com.zy.ChattingAI.utils.ReturnResult;

import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/prompt")
@CrossOrigin
public class PromptController {

    @Resource
    private PromptService promptService;

    @GetMapping("/admin/list/{page}/{limit}")
    public ReturnResult list(@PathVariable int page, @PathVariable int limit, PromptQueryRequest req) {

        IPage<PromptEntity> list = promptService.list(page, limit, req);
        return ReturnResult.ok().data("records", list.getRecords()).data("total", list.getTotal());
    }

    /**
     * 获得所有专家领域的提示
     * 
     * @return
     */
    @GetMapping("/listAllUserPrompt")
    public ReturnResult list() {
        List<String> list = promptService.getByType(PromptType.CHATGPT).stream()
                .filter(item -> PromptTarget.USER.targetNo == item.getTarget())
                .map(PromptEntity::getTopic)
                .collect(Collectors.toList());

        return ReturnResult.ok().data("topic_list", list);
    }

    /**
     * 插入prompt
     * 
     * @param promptEntity
     * @return
     */
    @PostMapping("/admin")
    public ReturnResult add(@RequestBody PromptEntity promptEntity) {
        promptService.save(promptEntity);
        promptService.load();
        return ReturnResult.ok();
    }

    /**
     * 编辑prompt
     * 
     * @param promptEntity
     * @return
     */
    @PutMapping("/admin")
    public ReturnResult edit(@RequestBody PromptEntity promptEntity) {
        promptService.update(promptEntity, new QueryWrapper<PromptEntity>().eq("id", promptEntity.getId()));
        promptService.load();
        return ReturnResult.ok();
    }

    /**
     * 删除prompt
     * 
     * @param promptId
     * @return
     */
    @DeleteMapping("/admin/{promptId}")
    public ReturnResult delete(@PathVariable Integer promptId) {
        promptService.removeById(promptId);
        promptService.load();
        return ReturnResult.ok();
    }
}
