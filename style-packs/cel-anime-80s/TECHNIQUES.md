# 80 年代赛璐璐动画 · 绘制接入

保留原独立绘制模块及其本地依赖闭包。 入口：`engine/cel.js`。

视觉合同：两阶赛璐璐色块、手绘轮廓、有限动画和录像后处理。

依赖：webgl2。目录可发现不代表这些条件已就绪。

## 可用接口

- `engine/cel.js`：`W`, `TAU`, `LWK`, `canvas`, `path`, `poly`, `cel`, `line`, `ribbon`, `flutter`, `hex`, `mix`, `rgba`, `rng`, `hash`, `airbrush`, `vgrad`。
- `engine/fx.js`：`rain`, `splashes`, `speedLines`, `flare`, `lamp`, `trail`。
- `engine/hands.js`：`hand`, `HER`, `HIS`。
- `engine/head80.js`：`EXPR`, `head80`。
- `engine/pal.js`：`BASE`, `LIGHTS`, `palette`, `PAL`。
- `engine/post.js`：`makePost`。
- `engine/rider.js`：`wheel`, `bike`, `limb`, `riderSide`, `LAMPS`。



## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。新片自行设计题材对象、角色和构图。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
