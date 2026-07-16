# 吴晨耕 · Capability Archive

这是一个本地私密、以电影叙事方式呈现的个人能力档案网页，当前版本顺序为：

1. 基本信息
2. 山东农业大学 × FOM 学历页
3. 悉尼大学 × 上海交通大学交换学习页
4. 实习 / 实践经历
5. 纯能力卡片区
6. 项目证据

当前版本重点突出：

- Agent：任务拆解、工具协同、流程编排
- 语料：采集整理、数据标注、结构化处理
- LLM：上下文组织、结构化输出、结果校验
- 语言能力：中文、English、Deutsch
- 设计与创意：Photoshop、视频剪辑、原型展示、视觉沟通
- 项目证据：浦发银行 Agent / LLM、智能仓储和智能路线规划系统、同花顺 iFind 开发项目、陪你学平台

## 本地预览

在当前目录运行：

```bash
python3 -m http.server 4173
```

然后打开 `http://localhost:4173`。

该页面默认只在本地使用，不包含公开部署、统计脚本或外部字体。若未来需要放到服务器，应另外增加访问密码或其他认证措施。

学校图片已下载到 `assets/schools/`，来源为各学校官网或官方校园页面；如果你有自己的校园照片，可以直接替换同名文件，不需要修改页面结构。

图片来源记录：

- 山东农业大学：[校区概况](https://ngw.sdau.edu.cn/1104/list.htm)
- FOM：[Düsseldorf Hochschulzentrum](https://www.fom.de/de/Hochschulzentrum/duesseldorf.html)
- 悉尼大学：[Our campuses](https://www.sydney.edu.au/about-us/campuses.html)
- 上海交通大学：[SJTU Campus Gallery](https://zhiwen.sjtu.edu.cn/sjtu-campus.html)

## 修改内容

主要内容集中在 `content.js`，包括个人信息、党员身份标识、两个独立学历页、技能卡片、项目和片尾文案。首页头像位于 `assets/profile.png`，视觉与动效分别位于 `styles.css` 和 `script.js`。

## 内容边界

当前内容只使用了提供的 PDF 简历中可以确认的信息。Agent、语料、LLM 相关章节已经搭好叙事结构，但具体模型、框架、数据规模、评测结果和生产交付信息需要由吴晨耕后续确认后再补入，避免把学习经历误写成未经证实的项目成果。
