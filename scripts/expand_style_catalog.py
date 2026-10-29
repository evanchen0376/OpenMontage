"""Build the approved remaining style packs from reviewed, pinned local sources.

Metadata/guide generation only. Rendering and creative decisions are not made
here. First-wave packs are preserved byte-for-byte.
"""
from __future__ import annotations
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACKS = ROOT / "style-packs"
ROUTES = {
    "art-deco": ("engine/deco.js", "商业兴衰、财经历史、复古栏目片头", "描金、金属扫光、对称几何与装饰字形"),
    "ascii-crt": ("term.js", "量化系统、科技产业、信息处理", "字符网格、亮度编码和真实CRT荧光后处理"),
    "backrooms": ("tex.js", "风险隐喻、空置空间、商业悬疑", "墙纸地毯材质、冷荧光空间和VHS噪声"),
    "brick-toy": ("bricks.js", "机制入门、产业搭建、供应链隐喻", "真实凸点积木几何、塑料材质和逐格组装"),
    "caption-news": (None, "财经快讯、政策摘要、静音阅读", "实拍底图、分块大字幕、关键词强调"),
    "cel-anime-80s": ("cel.js", "财经人物故事、时代产业、情绪叙事", "两阶赛璐璐色块、手绘轮廓、有限动画和录像后处理"),
    "city-symphony": (None, "城市经济、物流、产业观察", "真实延时素材的节奏分段、加速与停顿"),
    "countdown": (None, "政策发布、财报发布、事件同步", "同一事件时钟、多机位分屏、真实时间对齐"),
    "crayon-book": ("crayon.js", "财经启蒙、生活成本、风险寓言", "纸齿阈值蜡笔附着、压力笔触和水彩抗蜡"),
    "dark-keynote": ("engine.js", "金融科技界面、产品功能、关键数字", "暗色舞台、界面网格、光扫揭示和精确位移"),
    "engraving": ("engine/index.js", "货币史、商业制度、研究插图", "鼓胀细线、顺形排线、铜板与手工敷色"),
    "game-show": (None, "概念辨析、财经知识问答、互动栏目", "糖果色放射背景、夸张动作、节拍判断字"),
    "glass-product": ("studio.js", "金融科技产品、品牌概念、栏目片头", "条形灯环境、玻璃/磨砂材质与镜面摄影棚"),
    "hd-2d": ("px.js", "经济寓言、商业成长、人物旅程", "像素纹理/纸片角色、真实3D灯光和景深"),
    "hologram-hud": ("engine/holo.js", "科技产业结构、模型拆解、技术指标", "线框扫描、局部展开、引线和滚动参数"),
    "impasto": ("engine/impasto.js", "人物故事、财富情绪、产业场景", "调色刀笔触、画布、油彩高度场和掠射光"),
    "ink-wash": ("ink.js", "周期隐喻、长期主义、东方商业叙事", "宣纸渗化、干湿笔锋、墨块和留白"),
    "kino-montage": (None, "财经历史、工业化、政策与社会变迁", "真实档案、斜向画窗、黑红印刷构成"),
    "lidar-survey": (None, "资源测绘、基建、空间资产研究", "真实米制点云、扫描平面、高程编码和截面"),
    "living-screencast": (None, "金融工具教学、财务软件、操作演示", "真实界面优先、原生清晰文字与低分辨率角色"),
    "lowpoly-island": ("sea.js", "产业生态、城市发展、资产组合隐喻", "正交低多边形世界、切面水体、逐块生长"),
    "microgame": ("toon.js", "财经小测、风险识别、快节奏概念对比", "短指令、回合倒计时、多种媒介切换"),
    "microscope": (None, "医药行业、检测成本、微观产业证据", "真实扫描切片、多尺度ROI和校准测量"),
    "midcentury-toon": ("engine/toon.js", "家庭收支、消费选择、经济寓言", "无轮廓平涂、非对称几何、1950年代图形角色"),
    "newsreel": (None, "金融史、商业史、历史事件回顾", "真实档案投影门、新闻纸、银色调与胶片抖动"),
    "one-line": ("geom.js", "经济联系、人物轨迹、连续关系隐喻", "连续路径、速度控制线宽、纸张纹理与笔触积墨"),
    "paper-lantern": ("src/paper.js", "生活经济、商业文化、节庆消费", "多层纸雕、穿透光、投影和真实盒景深度"),
    "paper-popup": ("book.js", "商业模式入门、公司故事、产业展开", "书页铰链、纸片厚度、翻页曲面和折叠结构"),
    "papercut-red": ("paper.js", "节庆经济、消费文化、东方商业寓言", "红纸镂空、纸边、剪口、对折和透光"),
    "pictogram-motion": ("engine.js", "行为分类、消费人群、概念快解", "方格核心图形、圆端杆件图标与遮罩文字"),
    "pixel-rpg": ("px.js", "预算选择、复利旅程、风险决策寓言", "320×180索引像素、有限调色板、菜单与对话框"),
    "risograph": ("draw.js", "财经编辑插图、消费案例、轻叙事", "分色密度板、透叠油墨、半调与套印偏移"),
    "rubber-hose": ("toon.js", "投资行为偏差、生活财经、风险寓言", "黑白胶管肢体、恒定墨线、线条抖动和胶片投影"),
    "scifi-toon": ("toon.js", "科技经济寓言、激励冲突、行为偏差", "粗墨线、扁平色块、变形肢体和表演反差"),
    "shadow-puppet": ("carve.js", "商业故事、传统产业、人物寓言", "染色皮革、细密镂空、棉幕透光和关节铆钉"),
    "silent-film": ("engine/ink.js", "金融史、行为寓言、无旁白栏目", "灰阶版画、字幕插卡、虹膜转场和胶片损伤"),
    "silkscreen-poster": ("engine/silk.js", "地区产业、城市研究、文化消费", "不透明平涂油墨、分版拉印、刮板与分级色带"),
    "spy-titles": ("paper.js", "资金追踪、商业悬疑、调查片头", "四色剪纸、切割字形、狭缝与轮廓转场"),
    "stained-glass": ("glass.js", "历史制度、文化财经、长期结构隐喻", "铅条分片、玻璃厚薄、背光透色和室内投影"),
    "teardown": ("src/parts.js", "制造业成本、硬件产业、产品结构", "工程几何、可拆层级、局部细节和真实规格标注"),
    "telestrator": (None, "赛事商业、空间行为分析、实拍解释", "冻结/回放、场地坐标、人物足下环和路径标记"),
    "tilt-shift": ("post.js", "城市经济、物流、地产和产业场景", "微缩景深、真实光照、高机位和时间压缩"),
    "ukiyoe": ("print.js", "贸易史、东方商业、周期叙事", "分色木版、木纹、晕染天色、刻线和长卷"),
    "urban-sketch": ("engine.js", "城市商业、街区消费、生活观察", "钢笔飞线、透明水彩、颜色抵达场与现场纸张"),
    "watercolor": ("engine.js", "生活财经、环境经济、人物故事", "透明笔刷、飞白、湿边、棉纸和分层洗染"),
    "white-model": ("studio.js", "地产研究、城市更新、区域数据", "真实白色体块、固定投影灯与表面数据映射"),
    "woodcut": ("engine/index.js", "金融史、产业劳动、制度叙事", "黑木块、顺形刀刻排线、刀口毛边和分版印刷"),
}
ADAPTED = {
    "caption-news": "captionChunks", "city-symphony": "cutAt,splitScreen", "countdown": "splitScreen,countdown",
    "game-show": "rays,pixelActor", "kino-montage": "montageWindow,captionChunks",
    "living-screencast": "appWindow,pixelActor", "newsreel": "filmGate", "telestrator": "telestrate",
    "lidar-survey": "pointSurvey", "microscope": "scanPlate,scaleBar,roiBox",
}
SOURCE_NEEDS = {
    "caption-news":"licensed-footage", "city-symphony":"licensed-timelapse", "countdown":"synchronized-event-footage",
    "kino-montage":"licensed-archive", "newsreel":"licensed-archive", "telestrator":"licensed-footage-and-calibration",
    "lidar-survey":"metric-point-cloud", "microscope":"calibrated-scan", "teardown":"engineering-files",
    "white-model":"real-massing-model", "living-screencast":"actual-product-ui",
}
THREE = {"backrooms","brick-toy","glass-product","hd-2d","lidar-survey","lowpoly-island","paper-lantern","paper-popup","teardown","tilt-shift","white-model"}
WEBGL = THREE | {"ascii-crt","cel-anime-80s","crayon-book","impasto","ink-wash","microgame","risograph","shadow-puppet","silent-film","stained-glass","urban-sketch","woodcut"}


def expand(source: Path) -> None:
    catalog_path = PACKS / "catalog.json"
    catalog = json.loads(catalog_path.read_text())
    first = [p for p in catalog["packs"] if p["group"] <= 3]
    for slug, (entry, uses, grammar) in ROUTES.items():
        base = PACKS / slug
        meta = json.loads((source / "styles" / slug / "style.json").read_text())
        if entry is None:
            kind = "lidar" if slug == "lidar-survey" else "microscope" if slug == "microscope" else "edit-techniques"
            entry = "primitives.js"
            engine = base / "engine"; engine.mkdir(exist_ok=True)
            (engine / entry).write_text(f"// Lemo-Opuscar visual grammar adaptation (MIT). No demo story.\nexport {{{ADAPTED[slug]}}} from '../../vendor/{kind}.js';\n")
        requires = (["three"] if slug in THREE else []) + (["webgl2"] if slug in WEBGL else [])
        if slug in SOURCE_NEEDS: requires.append(SOURCE_NEEDS[slug])
        native = entry != "primitives.js"
        status = "native-techniques" if native else "adapted-techniques"
        record = {
            "id": "lemo-" + slug, "slug": slug, "name": meta["cn"], "group": 4,
            "category": meta["category_cn"], "finance_fit": "supporting" if slug not in SOURCE_NEEDS and slug not in {"dark-keynote","hologram-hud"} else "specialist",
            "finance_use": uses.split("、"), "visual_contract": grammar,
            "techniques": [entry] if native else ADAPTED[slug].split(","),
            "native_entry": "engine/" + entry, "specimen": slug,
            "requires": requires, "evidence": SOURCE_NEEDS.get(slug, "illustration-or-explicit-schematic"),
            "avoid": "形象化表达不能替代事实证据；数字、来源和精确文字由原生排版承担。" if slug not in SOURCE_NEEDS else "必须使用与当前项目对应的真实授权材料；工程夹具不能当作事实证据。",
            "implementation": status, "support_files": ["vendor"],
        }
        first.append(record)
        style = (base / "STYLE.md").read_text()
        essence = re.search(r"## 1\.[^\n]*\n(.*?)(?=\n## )", style, re.S)
        note = "保留原独立绘制模块及其本地依赖闭包。" if native else "从原内联样片的视觉语法拆分为独立接口；原完整实现隔离保存在reference/source。"
        finance = f"""# {meta['cn']} · 财经使用\n\n适合：{uses}。视觉核心：{grammar}。\n\n本风格{'依赖真实材料' if slug in SOURCE_NEEDS else '主要用于叙事、隐喻或示意'}，不会改变现有研究和脚本方法。关键数据、统计口径、日期、单位和来源必须原生可读；风格化对象不自动代表精确数量。示意、假设和真实证据分别标注。\n\n{record['avoid']}\n\n中文按实际字形测量换行，横竖屏重新构图，保留social-ui-safe字幕区。语音、BGM、字幕、封面和财经尾句仍服从OpenMontage项目合同，原样片的声音、品牌、角色、剧情和时间轴不自动复用。\n\n制作时读STYLE和TECHNIQUES，按当前主题形成自己的镜头方案后再查样片技法；三张关键帧和连续运动样片使用项目真实文字和素材。工程测试只是接口/材质验证，不是事实或完整美术验收。\n"""
        (base / "FINANCE.md").write_text(finance)
        exports=[]
        for path in sorted((base / "engine").rglob("*.js")):
            symbols=re.findall(r"export (?:async )?(?:function|class|const) (\w+)",path.read_text())
            if symbols:exports.append(f"- `{path.relative_to(base)}`："+", ".join(f"`{s}`" for s in symbols)+"。")
        techniques=f"""# {meta['cn']} · 绘制接入\n\n{note} 入口：`{record['native_entry']}`。\n\n视觉合同：{grammar}。\n\n依赖：{', '.join(requires) or 'Canvas 2D'}。目录可发现不代表这些条件已就绪。\n\n## 可用接口\n\n"""+"\n".join(exports)+f"""\n\n{'独立适配接口：`'+ADAPTED[slug]+'`。' if not native else ''}\n\n## 集成边界\n\n原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。\n\n本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。{('原样片依赖的真实材料未随代码迁入。' if slug in SOURCE_NEEDS else '新片自行设计题材对象、角色和构图。')}\n\n绘制入口实现create(canvas) -> {{render(seconds), dispose?}}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。\n"""
        (base / "TECHNIQUES.md").write_text(techniques)
        (base / "DEMO.md").write_text("# 上游参考\n\n先完成当前影片镜头方案，再读[原样片说明](reference/DEMO.md)。源码隔离于reference/source；它不是新片入口。\n")
    catalog["packs"] = first
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+"\n")
    print(f"Catalogued {len(first)} packs ({len(ROUTES)} added); first-wave metadata preserved")


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument("source",type=Path)
    expand(parser.parse_args().source)
