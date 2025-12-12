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

### 需要添加的功能 🔧

#### 1. 輸入驗證系統
- **驗證中間件**: 缺少請求資料格式驗證
- **資料完整性檢查**: 防止無效或惡意資料
- **錯誤訊息標準化**: 統一驗證錯誤回應格式

#### 2. API 回應標準化
- **統一回應格式**: 成功/錯誤回應格式不一致
- **狀態碼標準化**: HTTP 狀態碼使用需要規範化
- **回應時間戳**: 缺少時間戳記

#### 3. 分頁和搜尋功能
- **資料分頁**: 大量資料時的效能優化
- **關鍵字搜尋**: 按名稱、內容搜尋功能
- **排序功能**: 多欄位排序支援
- **篩選功能**: 按條件篩選資料

#### 4. 關聯查詢 API
- **影城電影查詢**: `GET /api/cinemas/:id/movies` (文件中提到但未實作)
- **電影場次查詢**: `GET /api/movies/:id/showings` (文件中提到但未實作)
- **會員訂票查詢**: `GET /api/members/:id/bookings` (文件中提到但未實作)

#### 5. 批量操作
- **批量新增**: 一次新增多筆資料
- **批量更新**: 一次更新多筆資料
- **批量刪除**: 一次刪除多筆資料

#### 6. 進階功能
- **座位狀態更新**: `PUT /api/seats/:showingID/:seatNumber` (文件中提到但未實作)
- **會員認證**: JWT token 驗證機制
- **資料備份**: 自動或手動備份功能
- **日誌記錄**: 操作日誌追蹤

#### 7. 業務邏輯增強
- **訂票流程驗證**: 檢查座位可用性、票數限制
- **會員點數系統**: 點數累積和使用
- **電影推薦**: 基於觀看紀錄的推薦
- **收入統計**: 票房和營收統計 API

### 現有程式碼參考位置

#### 基礎錯誤處理
- **位置**: `server.js:470-490` (全域錯誤處理和404處理)
- **功能**: 基本的錯誤捕獲和回應

#### 資料隱藏處理
- **位置**: `server.js:290-300` (會員密碼隱藏)
- **範例**: 查詢會員時自動隱藏敏感欄位

#### 條件查詢
- **位置**: `server.js:440-460` (管理員登入驗證)
- **範例**: 多條件資料庫查詢

## 注意事項

- **管理員帳號**: `admin` / 密碼: `admin123`
- **資料庫檔案**: SQLite 會自動建立為 `moviesql.db`
- **自動初始化**: 首次啟動會自動建立所有資料表和範例資料
- **安全提醒**: 實際部署時請更改管理員密碼
- **測試工具**: 可使用 `npm run test` 進行快速API測試
- **停止服務**: 使用 Ctrl+C 優雅關閉伺服器和資料庫連線
- **錯誤處理**: 系統包含完整的錯誤處理和 404 響應
