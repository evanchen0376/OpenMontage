# 1920s 新闻影片 · 绘制接入

从原内联样片的视觉语法拆分为独立接口；原完整实现隔离保存在reference/source。 入口：`engine/primitives.js`。

视觉合同：真实档案投影门、新闻纸、银色调与胶片抖动。

依赖：licensed-archive。目录可发现不代表这些条件已就绪。

## 可用接口



独立适配接口：`filmGate`。

## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。原样片依赖的真实材料未随代码迁入。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
