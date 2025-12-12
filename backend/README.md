# 威秀影城後端系統

簡易的 Node.js + Express + SQLite 後端管理系統

## 快速開始

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

# API 測試
npm run test
```

### 3. 測試服務
啟動後訪問：
- 服務狀態：http://localhost:3000
- API 文件：http://localhost:3000/api
- 連線測試：http://localhost:3000/api/test

### 特色
- **即開即用**：無需安裝 MySQL 或其他資料庫服務
- **檔案型資料庫**：SQLite 資料庫自動建立為 `moviesql.db`
- **自動初始化**：首次啟動會自動建立所有資料表和範例資料
- **完整功能**：支援所有 CRUD 操作和業務邏輯
- **優雅關閉**：Ctrl+C 時自動關閉資料庫連線
- **錯誤處理**：完整的 404 和 500 錯誤處理機制

## 主要 API 路由

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

## 使用範例

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

#查詢板橋大遠百 (C001) 正在上映的電影
Invoke-RestMethod -Uri "http://localhost:3000/api/cinemas/C001/movies"

#查詢電影 阿凡達 (M001) 的所有放映地點和時間：
Invoke-RestMethod -Uri "http://localhost:3000/api/movies/M001/showings"

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

## 系統需求

- Node.js 14+
- 無需額外資料庫安裝（使用 SQLite）

## 免費部署選項

### Heroku (推薦)
1. 安裝 Heroku CLI
2. `heroku create your-app-name`
3. `git push heroku main`
4. SQLite 檔案會自動建立

### Railway
1. 連接 GitHub repo
2. 自動部署
3. SQLite 檔案會自動建立

### Render
1. 連接 GitHub
2. 選擇 Web Service
3. 自動建置和部署
4. SQLite 資料庫無需額外設定

## 功能實作狀態

### 已完成功能 ✅

#### 核心 CRUD 操作
- **影城管理**: 完整 CRUD (查詢/新增/修改/刪除)
- **電影管理**: 完整 CRUD (查詢/新增/修改/刪除)
- **會員管理**: 基礎 CRUD (查詢/新增，已隱藏密碼欄位)
- **場次管理**: 基礎 CRUD (查詢/新增)
- **訂票管理**: 基礎操作 (查詢/新增)
- **影廳管理**: 基礎操作 (查詢/新增)

#### 系統功能
- **資料庫連線測試**: `GET /api/test`
- **範例資料初始化**: `POST /api/init-sample-data`
- **管理員登入**: `POST /api/admin/login`
- **API 文件**: `GET /api`

#### 參考資料查詢
- **電影分級**: `GET /api/rated`
- **電影版本**: `GET /api/versions`
- **餐點**: `GET /api/meals`
- **票種**: `GET /api/ticketclasses`
- **訂單狀態**: `GET /api/orderstatus`

#### 座位管理
- **查詢場次座位**: `GET /api/seats/:showingID`

### 待實作的 API 功能 🔧

根據前端 `Print.md` 需求分析，以下 API 為前端組件正常運作的必要功能：

#### 🔐 **第一優先級：身份驗證系統** (對應 L1-L16, M1-M19)
```javascript
// 會員登入系統 (支援 LoginPrints.jsx)
POST   /api/auth/login              // 會員登入驗證
POST   /api/auth/logout             // 會員登出
POST   /api/auth/forgot-password    // 忘記密碼申請
POST   /api/auth/reset-password     // 重設密碼確認
POST   /api/auth/verify-code        // 驗證碼確認

// 會員註冊系統 (支援 SignPrints.jsx)
POST   /api/auth/register           // 會員註冊
POST   /api/auth/send-verification  // 發送驗證郵件
POST   /api/auth/verify-email       // 郵件驗證確認
```

#### 👤 **第二優先級：會員管理功能** (對應 M1-M19)
```javascript
// 會員資料操作 (支援 MemberChangePrints.jsx)
PUT    /api/members/:id             // 更新會員基本資料
PUT    /api/members/:id/password    // 修改會員密碼
POST   /api/members/:id/topup       // 會員儲值功能
GET    /api/members/:id/profile     // 會員完整資料查詢
PUT    /api/members/:id/profile     // 會員資料修改

// 會員訂票記錄 (支援 InquiryPrints.jsx)
GET    /api/members/:id/bookings    // 查詢會員所有訂票記錄
GET    /api/members/:id/bookings/active  // 查詢有效訂票
GET    /api/members/:id/bookings/history // 查詢歷史訂票
```

#### 🎫 **第三優先級：訂票業務邏輯** (對應 B1-B34, In1-In12)
```javascript
// 訂票流程管理 (支援 BookPrints.jsx)
POST   /api/bookings/create         // 建立新訂票
PUT    /api/bookings/:id/cancel     // 取消訂票
PUT    /api/bookings/:id/refund     // 申請退票
PUT    /api/bookings/:id/confirm    // 確認訂票
GET    /api/bookings/:id/status     // 查詢訂票狀態

// 訂票查詢功能 (支援 InquiryPrints.jsx)
GET    /api/bookings/search         // 多條件搜尋訂票
GET    /api/bookings/code/:code     // 訂票代碼查詢
POST   /api/bookings/validate       // 驗證訂票資訊
PUT    /api/bookings/:id/collect    // 取票處理

// 票券生成系統
POST   /api/tickets/generate        // 生成取票代碼
GET    /api/tickets/:code/info      // 查詢票券資訊
PUT    /api/tickets/:code/collect   // 標記已取票
GET    /api/tickets/:code/status    // 票券狀態查詢
```

#### 🎬 **第四優先級：業務關聯查詢** (對應 Br1-Br26)
```javascript
// 影城電影關聯 (支援 BrowsePrints.jsx)
GET    /api/cinemas/:id/movies      // 查詢影城上映電影
GET    /api/cinemas/:id/theaters    // 查詢影城所有影廳
GET    /api/movies/:id/showings     // 查詢電影所有場次
GET    /api/movies/:id/cinemas      // 查詢電影放映影城

// 場次座位管理
GET    /api/showings/:id/seats      // 查詢場次座位狀態
PUT    /api/seats/:showingID/:seat  // 更新座位狀態
POST   /api/seats/reserve           // 預約座位
POST   /api/seats/release           // 釋放座位
```

#### ⚙️ **第五優先級：管理員功能** (對應 C1-C9)
```javascript
// 管理員系統 (支援 ControllerPrints.jsx)
GET    /api/admin/dashboard         // 管理員儀表板數據
GET    /api/admin/bookings         // 所有訂票管理
GET    /api/admin/members          // 所有會員管理
PUT    /api/admin/bookings/:id     // 管理員修改訂票
DELETE /api/admin/bookings/:id     // 管理員刪除訂票

// 資料統計分析
GET    /api/statistics/revenue     // 營收統計
GET    /api/statistics/popular     // 熱門電影統計
GET    /api/statistics/occupancy   // 座位使用率
```

#### 🔧 **技術增強功能**
```javascript
// API 回應標準化
- 統一回應格式: { success: boolean, data: any, message: string, timestamp: string }
- 錯誤代碼標準: 使用語意化的錯誤代碼
- 分頁支援: ?page=1&limit=10&sort=createdAt&order=desc

// 輸入驗證
- 請求資料格式驗證
- SQL 注入防護
- XSS 攻擊防護
- 速率限制 (Rate Limiting)

// 進階功能
- JWT Token 認證
- 會話管理 (Session Management)
- 操作日誌記錄
- 快取機制 (Redis)
```

### 🎯 **實作優先順序建議**

1. **立即需要** (支援前端登入): 身份驗證系統
2. **本週內** (支援前端訂票): 會員管理 + 訂票業務
3. **下週** (支援前端查詢): 關聯查詢 + 票券系統
4. **後續** (完善系統): 管理員功能 + 統計分析

### 📊 **前端支援狀況分析**

#### ✅ **完全支援的前端組件**
- **BrowsePrints.jsx**: 影城列表、電影列表、分級版本查詢 (95% 支援)
- **系統基礎功能**: 資料庫連接、範例資料、參考資料查詢

#### ⚠️ **部分支援的前端組件** 
- **InquiryPrints.jsx**: 基本訂票查詢 ✅，缺少代碼查詢、退票功能 ❌
- **BookPrints.jsx**: 基本訂票建立 ✅，缺少完整訂票流程、付款處理 ❌
- **MemberChangePrints.jsx**: 會員資料查詢 ✅，缺少資料修改、儲值功能 ❌

#### ❌ **無法支援的前端組件**
- **LoginPrints.jsx**: 缺少會員登入系統 (只有管理員登入)
- **SignPrints.jsx**: 缺少會員註冊流程
- **ControllerPrints.jsx**: 缺少完整管理員功能

### 🔗 **現有程式碼參考位置**

#### 身份驗證範例
- **管理員登入**: `server.js:572-590` - 可參考實作會員登入
- **密碼驗證**: 使用明文比對，建議改為 hash 驗證

#### 資料操作範例
- **CRUD 完整實作**: `server.js:250-520` (影城、電影、會員、場次)
- **資料隱藏處理**: `server.js:333-340` (會員密碼自動隱藏)
- **關聯查詢基礎**: 已有 foreign key 設計，可擴展關聯 API

#### 錯誤處理機制
- **統一錯誤格式**: `res.status(500).json({ error: '錯誤訊息', details: error.message })`
- **404 處理**: 查詢不存在資源時的標準回應
- **資料驗證**: `if (!account || !password)` 基本驗證模式

## 注意事項

- **管理員帳號**: `admin` / 密碼: `admin123`
- **資料庫檔案**: SQLite 會自動建立為 `moviesql.db`
- **自動初始化**: 首次啟動會自動建立所有資料表和範例資料
- **安全提醒**: 實際部署時請更改管理員密碼
- **測試工具**: 可使用 `npm run test` 進行快速API測試
- **停止服務**: 使用 Ctrl+C 優雅關閉伺服器和資料庫連線
- **錯誤處理**: 系統包含完整的錯誤處理和 404 響應
