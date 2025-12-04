# 威秀影城後端系統

簡易的 Node.js + Express + SQLite 後端管理系統

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動伺服器
```bash
# 開發模式（推薦，自動重啟）
npm run dev

# 正式模式
npm start
```

### 3. 測試服務
啟動後訪問：
- 服務狀態：http://localhost:3000
- API 文件：http://localhost:3000/api
- 連線測試：http://localhost:3000/api/test

### ✨ 特色
- ✅ **即開即用**：無需安裝 MySQL 或其他資料庫服務
- ✅ **檔案型資料庫**：SQLite 資料庫自動建立為 `moviesql.db`
- ✅ **自動初始化**：首次啟動會自動建立所有資料表
- ✅ **完整功能**：支援所有 CRUD 操作和業務邏輯

## 📊 主要 API 路由

### 系統功能
- `GET /` - 系統狀態
- `GET /api` - API 文件
- `GET /api/test` - 測試資料庫連接
- `POST /api/init-sample-data` - 初始化範例資料

### 核心業務 API

**影城管理**
- `GET /api/cinemas` - 查詢所有影城
- `GET /api/cinemas/:id` - 查詢特定影城  
- `POST /api/cinemas` - 新增影城
- `PUT /api/cinemas/:id` - 更新影城
- `DELETE /api/cinemas/:id` - 刪除影城

**電影管理**
- `GET /api/movies` - 查詢所有電影
- `GET /api/movies/:id` - 查詢特定電影
- `POST /api/movies` - 新增電影
- `PUT /api/movies/:id` - 更新電影
- `DELETE /api/movies/:id` - 刪除電影

**會員管理**
- `GET /api/members` - 查詢所有會員
- `GET /api/members/:id` - 查詢特定會員
- `POST /api/members` - 新增會員

**場次管理**
- `GET /api/showings` - 查詢所有場次
- `GET /api/showings/:id` - 查詢特定場次
- `POST /api/showings` - 新增場次

**訂票系統**
- `GET /api/bookings` - 查詢所有訂票紀錄
- `POST /api/bookings` - 新增訂票紀錄
- `GET /api/seats/:showingID` - 查詢場次座位

**影廳管理**
- `GET /api/theaters` - 查詢所有影廳
- `POST /api/theaters` - 新增影廳

### 參考資料 API
- `GET /api/rated` - 查詢電影分級
- `GET /api/versions` - 查詢電影版本
- `GET /api/meals` - 查詢餐點
- `GET /api/ticketclasses` - 查詢票種
- `GET /api/orderstatus` - 查詢訂單狀態

### 管理功能
- `POST /api/admin/login` - 管理員登入（帳號：admin, 密碼：admin123）

## 🎯 使用範例

### PowerShell 測試指令

```powershell
# 測試資料庫連接
Invoke-RestMethod -Uri "http://localhost:3000/api/test"

# 初始化範例資料
Invoke-RestMethod -Uri "http://localhost:3000/api/init-sample-data" -Method POST

# 查詢所有影城
Invoke-RestMethod -Uri "http://localhost:3000/api/cinemas"

# 查詢所有電影
Invoke-RestMethod -Uri "http://localhost:3000/api/movies"

# 查詢所有會員
Invoke-RestMethod -Uri "http://localhost:3000/api/members"

# 查詢所有場次
Invoke-RestMethod -Uri "http://localhost:3000/api/showings"

# 查詢所有訂票紀錄
Invoke-RestMethod -Uri "http://localhost:3000/api/bookings"

# 查詢電影分級
Invoke-RestMethod -Uri "http://localhost:3000/api/rated"

# 管理員登入
$body = @{ account = "admin"; password = "admin123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
```

### 管理員登入
```javascript
fetch('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    account: 'admin',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 查詢電影列表
```javascript
fetch('http://localhost:3000/api/movies')
.then(res => res.json())
.then(data => console.log(data.data));
```

### 新增電影
```javascript
fetch('http://localhost:3000/api/movies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '復仇者聯盟',
    genre: '動作',
    duration: 180,
    rating: 'PG-13',
    description: '超級英雄電影'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## ⚙️ 系統需求

- Node.js 14+
- MySQL 5.7+
- 已建立好的 cinema_db 資料庫

## 🔧 免費部署選項

### Heroku (推薦)
1. 安裝 Heroku CLI
2. `heroku create your-app-name`
3. `git push heroku main`
4. 使用 JawsDB MySQL (免費方案)

### Railway
1. 連接 GitHub repo
2. 自動部署
3. 內建 MySQL 資料庫

### Render
1. 連接 GitHub
2. 選擇 Web Service
3. 自動建置和部署

## 📝 注意事項

- 管理員帳號: `admin` / 密碼: `admin123`
- 確保 MySQL 服務已啟動
- 修改 `.env` 中的資料庫連線資訊
- 實際部署時請更改管理員密碼