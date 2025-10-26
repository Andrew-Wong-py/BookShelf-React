# 「书架 Bookshelf」

## 目标

实现一个抽象简化的“书籍仓库管理”Web 应用，支持：

1. **书籍目录**（大列表 + 搜索）
2. **书籍详情**（详细信息展示，可编辑）
3. **书籍内容阅读**（进入阅读页；为了简化，所有书的内容都可以使用同一段**静态大字符串**）

> 要求的前端工具：React, Vite, TypeScript, React Router, TailwindCSS

> 交付：完成后提交代码到github或gitee仓库，并附上README说明如何运行

---

## 技术与范围

- **技术栈**：React + Vite（TypeScript），React Router, TailwindCSS, _RTK Query (Good to have)_
- **数据来源**：本项目主要考察前端，后端不做要求，可以直接在本地 mock 静态的后端；但前端中必须要模拟实际的 API 调用
- **状态(State)管理**：使用 Redux或React 原生的 Hook (useState 等)
- **样式**：要求使用 TailwindCSS，Material UI

---

## 页面

- **书籍目录**
  - 大量数据的列表渲染
    - 需要性能优化（）
  - Quick Search 搜索框，输入标题/作者关键字后搜索结果
    - 不要有提交动作（以及提交/搜索按钮），注意数据请求发送的优化

- **书籍详情**
  - 展示书籍的完整信息
  - 提供“编辑”入口或按钮，进入受控表单编辑视角

- **阅读页**
  - 展示统一的**静态大段文本**内容（所有书相同），模拟阅读
  - 顶部返回、面包屑或链接可回到详情或目录

- **编辑表单页**（若不在详情页内编辑）

> 要求路由**可直达/可刷新**（复制 URL、刷新页面仍能正确显示）。

---

## 数据模型与 Mock API

### 书籍类型（TypeScript）

```ts
export type Book = {
  id: string
  title: string
  author: string
  publishedYear: number
  categories: string[] // 如 ["Novel", "CS", "History"]
  price: number // USD
  summary?: string
  stock: number // 库存
}
```

### Mock 数据

- 提供 `books.json`，**2000 条记录**，用于测试列表与搜索性能
- 提供字符串文件 `book_content.txt`，作为所有书的阅读内容

### 建议的接口

- `GET /books?_page=1&_limit=24&query=harry`
  - `query` 用于标题/作者模糊匹配（“服务端搜索”思维：在 Mock 端进行过滤）。

- `GET /books/:id`
- `PUT /books/:id`（可仅模拟成功并更新内存；无需真实持久化）
- （可选）`GET /categories` → `string[]`

> 采用 MSW，定义过滤与分页逻辑。

> API Call 使用RTK Query
