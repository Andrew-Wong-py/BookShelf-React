# 📚 Bookshelf - 书架应用

一个功能完整的书籍仓库管理 Web 应用，使用 React + TypeScript + Vite 构建。

## 功能特性

- ✅ **书籍目录** - 支持大列表渲染（2000+ 书籍）和分页
- ✅ **实时搜索** - 带 debounce 优化的标题/作者搜索
- ✅ **书籍详情** - 完整的书籍信息展示
- ✅ **书籍编辑** - 受控表单编辑书籍信息
- ✅ **阅读模式** - 静态文本内容阅读
- ✅ **响应式设计** - 使用 TailwindCSS 实现
- ✅ **路由支持** - 支持直接访问和页面刷新

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 7
- **状态管理**: Redux Toolkit + RTK Query
- **路由**: React Router 7
- **样式**: TailwindCSS 4
- **Mock API**: MSW (Mock Service Worker)
- **测试**: Vitest + React Testing Library
- **代码质量**: ESLint + Prettier

## 项目结构

```
src/
├── components/          # 共享组件
│   ├── BookCard.tsx    # 书籍卡片
│   ├── Layout.tsx      # 页面布局
│   ├── SearchInput.tsx # 搜索输入框（带 debounce）
│   └── Spinner.tsx     # 加载指示器
├── features/           # 功能模块
│   ├── BookList/       # 书籍列表页
│   ├── BookDetail/     # 书籍详情页
│   ├── BookEdit/       # 书籍编辑页
│   └── BookRead/       # 书籍阅读页
├── services/           # API 服务
│   ├── books.ts        # RTK Query API 定义
│   └── types.ts        # TypeScript 类型定义
├── mocks/              # Mock API
│   └── handlers.ts     # MSW 请求处理器
└── store.ts            # Redux Store 配置
```

## 快速开始

### 前置要求

- Node.js 22.x
- pnpm (推荐)

### 安装依赖

```bash
pnpm install
```

### 初始化MSW
```bash
npx msw init public/ --save
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 即可看到应用。

### 其他命令

```bash
pnpm build          # 构建生产版本
pnpm serve          # 预览生产版本
pnpm test           # 运行测试
pnpm test:watch     # 测试监听模式
pnpm lint           # 代码检查
pnpm lint:fix       # 自动修复代码问题
pnpm typecheck      # TypeScript 类型检查
pnpm prettier       # 格式化代码
pnpm validate       # 运行所有检查（测试+构建+类型检查）
```

## 功能说明

### 1. 书籍目录页 (`/books`)

- 展示所有书籍的网格布局
- 实时搜索功能（300ms debounce）
- 分页支持（每页 24 本书）
- 性能优化：使用 RTK Query 缓存和分页

### 2. 书籍详情页 (`/books/:id`)

- 展示书籍完整信息
- 提供编辑和阅读入口
- 支持直接 URL 访问

### 3. 书籍编辑页 (`/books/:id/edit`)

- 受控表单编辑所有书籍字段
- 支持动态添加/删除分类
- 表单验证
- 实时更新到 Mock 存储

### 4. 书籍阅读页 (`/books/:id/read`)

- 展示统一的静态文本内容
- 阅读友好的排版
- 返回导航

## API 设计

### Mock API Endpoints

使用 MSW 模拟以下 API：

```typescript
GET /api/books?_page=1&_limit=24&query=harry
// 获取书籍列表，支持分页和搜索

GET /api/books/:id
// 获取单本书籍详情

PUT /api/books/:id
// 更新书籍信息

GET /api/categories
// 获取所有分类
```

### 数据模型

```typescript
type Book = {
  id: string
  title: string
  author: string
  publishedYear: number
  categories: string[]
  price: number
  summary?: string
  stock: number
}
```

## 性能优化

1. **搜索优化**: 使用 debounce (300ms) 减少 API 请求
2. **数据缓存**: RTK Query 自动缓存 API 响应
3. **分页加载**: 每页只加载 24 条数据
4. **React Memo**: 组件级别的渲染优化
5. **代码分割**: 使用 Vite 的动态导入

## 测试数据

- `take-home-assessment/books.json`: 包含 2000 条书籍记录
- `take-home-assessment/book_content.txt`: 静态阅读内容



