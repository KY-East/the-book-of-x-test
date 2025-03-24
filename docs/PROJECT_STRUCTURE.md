# 《The Book of Ξ》项目结构说明

本文档描述了项目的文件结构和组织方式，便于开发和维护。

## 目录结构

```
the-book-of-x-test/docs/
├── content/                # 内容目录
│   └── chapters/              # 章节内容
│
├── pages/                  # Next.js页面目录
│   ├── index.js               # 首页
│   ├── _app.js                # 应用包装组件
│   └── [...slug].js           # 动态路由组件
│
├── public/                 # 静态资源目录
│   ├── assets/                # 静态资源（图片、音乐等）
│   └── fonts/                 # 字体文件
│
├── src/                    # 源代码目录
│   ├── components/            # React组件
│   │   ├── layout/               # 布局组件
│   │   └── features/             # 功能组件
│   └── styles/                # 样式文件
│
├── the-book-of-x-docs/     # 文档目录
│   ├── CHANGELOG.md           # 完整变更日志
│   └── ORGANIZED_CHANGELOG.md # 整理后的变更日志
│
├── _archives/              # 归档目录（详见_archives/README.md）
│
├── .next/                  # Next.js构建目录（自动生成）
│
├── node_modules/           # 依赖包目录（自动生成）
│
├── next.config.js          # Next.js配置文件
├── package.json            # 项目配置和依赖
├── package-lock.json       # 依赖锁定文件
├── postcss.config.js       # PostCSS配置
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
├── README.md               # 项目说明
└── PROJECT_STRUCTURE.md    # 本文件，项目结构说明
```

## 核心文件和目录说明

### 内容文件 (content/)

包含所有页面的Markdown内容文件，按章节组织：

- `content/chapters/preface/` - 序章内容
- `content/chapters/chapter1/` - 第一章内容
- `content/chapters/chapter2/` - 第二章内容
- `content/chapters/hidden/` - 隐藏章节内容

### 页面组件 (pages/)

Next.js页面文件，实现路由和页面渲染：

- `pages/index.js` - 首页，包含量子认证测试
- `pages/_app.js` - 全局应用配置，包含布局和主题
- `pages/[...slug].js` - 动态路由，处理所有章节页面

### 组件和功能 (src/)

项目的React组件和功能实现：

- `src/components/layout/` - 布局组件（页面框架、侧边栏等）
- `src/components/features/` - 功能组件（音乐播放器、打字机效果等）
- `src/styles/` - 样式文件（全局样式、模块样式）

### 静态资源 (public/)

存放图片、音频和字体等静态资源：

- `public/assets/images/` - 图片资源
- `public/assets/music/` - 音乐文件
- `public/fonts/` - 自定义字体

### 文档 (the-book-of-x-docs/)

项目文档和变更记录：

- `CHANGELOG.md` - 完整的变更日志
- `ORGANIZED_CHANGELOG.md` - 整理后的变更日志，包含已完成和进行中的内容

### 归档 (_archives/)

归档的旧版本、备份和开发文件：

- `_archives/scripts/` - 归档的脚本文件
- `_archives/development-files/` - 开发过程文件
- `_archives/original/` - 原始内容文件

## 开发规范

1. **内容更新**：所有内容更改应在`content/`目录中进行
2. **组件开发**：新组件应放在`src/components/`中对应目录
3. **样式管理**：使用CSS Modules或全局样式，放在`src/styles/`中
4. **资源管理**：静态资源放在`public/`目录的对应子目录中
5. **归档策略**：不需要的开发文件应移至`_archives/`目录

## 构建和部署

开发环境：
```bash
npm run dev
```

生产构建：
```bash
npm run build
npm start
```

静态导出（如需要）：
```bash
npm run export
```

## 更新记录

最后整理日期：2024年3月20日 