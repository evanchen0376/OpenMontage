# 一次买入 vs 定投：三条指数、六年回测

本目录保存无旁白的 185 秒竖屏曲线视频项目。当前审核成片为 [`renders/curve-first-picture-v2.mp4`](renders/curve-first-picture-v2.mp4)，1080×1920、30 fps，暂不含背景音乐。

- `hyperframes/`：可编辑的 HyperFrames 合成源码；需要 Node.js 22+，在该目录运行 `npm run check` 和 `npm run render`。
- `artifacts/`、`backtest.py`：官方全收益指数数据、回测和制作记录。
- `assets/review-stills-v2/`：与当前曲线版对应的逐场审核截图。

仓库未收录本机拷贝的 Hiragino 字库、未采用的第三方试听音乐、旧版视频和临时 QA 截图。源码在缺少字库时会回退到系统无衬线字体；若需与当前成片的字形完全一致，须自行提供有使用权限的字库文件至 `hyperframes/assets/hiragino-sans-gb.ttc`。
