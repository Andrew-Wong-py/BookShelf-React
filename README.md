

## 项目结构

```
mocks/ # Mock API
├── browser.ts    # 在浏览器中启动 MSW（用于开发环境）
├── handlers.ts  # MSW 请求处理器
├── server.ts  # 在 Node.js 环境中启动 MSW（用于测试环境）
...
src/
├── components/          # 共享组件
│   ├── BookCard.tsx    # 书籍卡片
│   ├── Layout.tsx      # 页面布局
│   ├── SearchInput.tsx # 搜索输入框
│   └── Spinner.tsx     # 加载指示器
├── features/           # 功能模块
│   ├── BookList/       # 书籍列表页
│   ├── BookDetail/     # 书籍详情页
│   ├── BookEdit/       # 书籍编辑页
│   └── BookRead/       # 书籍阅读页
├── services/           # API 服务
│   ├── books.ts        # RTK Query API 定义
│   └── types.ts        # TypeScript 类型定义 
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


## 功能说明

### 1. 书籍目录页 (`/books`)

- 展示所有书籍
- 实时搜索功能（300ms防抖）
- 分页支持（每页 24 本书，Material UI）
- 性能优化：使用 RTK Query 缓存和分页，预取下一页（翻页更顺畅）

### 2. 书籍详情页 (`/books/:id`)

- 面包屑（Material UI）
- 展示书籍完整信息


### 3. 书籍编辑页 (`/books/:id/edit`)
- 受控表单编辑所有书籍字段（支持BookContent修改）
- 仅模拟成功并更新内存，不支持持久化

### 4. 书籍阅读页 (`/books/:id/read`)

- 阅读友好的排版（分页，每页600词）
- 顶部返回+面包屑


