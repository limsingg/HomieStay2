# Homestay 预订系统 - 基础版

这是一个轻量级的 Homestay 预订系统，专为自家 Homestay 设计。系统通过二维码 + WhatsApp 预订方式，方便客户查看房源信息并直接联系预订。

## 功能

- 展示房源信息（图片、价格、描述、可预订时间）
- 用户通过二维码访问网页，选择房间和日期
- 点击预订按钮自动生成 WhatsApp 消息，用户直接发送预订信息
- 基于文件系统的数据存储，无需数据库
- 简单的后台管理界面，可以添加/编辑/删除房间信息

## 安装与使用

### 系统要求

- Node.js 14.x 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆此仓库
```bash
git clone https://github.com/yourusername/homestay-booking-system.git
cd homestay-booking-system
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 文件并重命名为 `.env`
```bash
cp .env.example .env
```
然后根据需要修改 `.env` 文件中的变量

4. 启动应用
```bash
npm start
```

5. 访问应用
打开浏览器，访问 `http://localhost:3000`

### 管理员访问

1. 访问 `http://localhost:3000/admin/login`
2. 使用在 `.env` 文件中设置的 `ADMIN_PASSWORD` 登录

## 项目结构

```
homestay-booking-system/
├── app.js                # 应用入口文件
├── public/               # 静态资源
│   ├── images/           # 网站图片
│   ├── qrcodes/          # 生成的房间二维码
├── uploads/              # 上传的房间图片
├── data/                 # 数据存储
│   └── rooms.json        # 房间数据
├── views/                # 视图模板
│   ├── admin/            # 管理员界面
│   ├── layout.ejs        # 主布局
│   ├── index.ejs         # 首页
│   ├── room.ejs          # 房间详情页
│   └── error.ejs         # 错误页面
└── README.md             # 项目说明
```

## 自定义与配置

### 修改 WhatsApp 号码

在 `.env` 文件中修改 `WHATSAPP_NUMBER` 变量为您的 WhatsApp 业务号码。

### 修改管理员密码

在 `.env` 文件中修改 `ADMIN_PASSWORD` 变量为您设定的管理员密码。

### 修改端口

在 `.env` 文件中修改 `PORT` 变量更改应用运行的端口。

## 部署

### 部署到 Vercel

1. 在 Vercel 上创建一个新项目
2. 链接到您的 GitHub 仓库
3. 配置环境变量
4. 部署

### 部署到 Heroku

1. 安装 Heroku CLI
2. 登录 Heroku
```bash
heroku login
```
3. 创建 Heroku 应用
```bash
heroku create your-app-name
```
4. 推送代码到 Heroku
```bash
git push heroku main
```
5. 设置环境变量
```bash
heroku config:set SESSION_SECRET=your_secret_key ADMIN_PASSWORD=your_admin_password WHATSAPP_NUMBER=your_whatsapp_number
```

## 后续扩展

- 支持多房东模式
- 自动化订单管理
- 集成支付功能
- 地图筛选功能
- 移动端应用

## 许可证

[MIT](LICENSE)