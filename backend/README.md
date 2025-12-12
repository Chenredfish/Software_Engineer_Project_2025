# 威秀影城後端系統 (重構版 v2.0)

基於 Node.js + Express + SQLite 的影城管理系統，採用模組化架構設計。

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動伺服器
npm start

# 3. API 測試
npm run test
```

啟動後訪問：http://localhost:3000

## 完整 API 文檔

### 🔐 會員認證系統 (Authentication)

#### POST `/api/auth/register` - 會員註冊
```javascript
{
  memberID: "F123456789",        // 身分證字號 (必填)
  memberAccount: "test_user",    // 會員帳號 (必填, 最大50字元)
  memberPwd: "password123",      // 會員密碼 (必填, 最大50字元) 
  memberName: "測試用戶",        // 會員姓名 (必填, 最多10字元)
  memberBirth: "1990-01-01",     // 生日 (必填, YYYY-MM-DD)
  memberPhone: "0912345678"      // 電話 (必填, 10位數字 09xxxxxxxx)
}
```

#### POST `/api/auth/login` - 會員登入
```javascript
{
  account: "test_user",          // 會員帳號
  password: "password123"        // 會員密碼
}
```

#### POST `/api/auth/logout` - 會員登出 🔒
需要登入狀態，會清除 session token

#### GET `/api/auth/profile` - 獲取個人資料 🔒
返回當前登入會員的完整資料

#### POST `/api/auth/check-account` - 檢查帳號可用性
```javascript
{
  account: "test_user"           // 要檢查的會員帳號
}
```

### 🎬 電影管理 (Movies)

#### GET `/api/movies` - 查詢所有電影
#### GET `/api/movies/:id` - 查詢單一電影
#### POST `/api/movies` - 新增電影
```javascript
{
  movieID: "M00001",            // 電影ID (6字元)
  movieName: "玩命關頭10",      // 電影名稱 (最大50字元)
  movieLength: 120,             // 電影長度 (分鐘)
  movieInfo: "動作片...",       // 電影介紹
  moviePhoto: "path/to/image",  // 電影海報路徑
  ratedID: "R00001",           // 分級ID
  versionID: "V00001",         // 版本ID
  movieDate: "2024-01-01",     // 上映日期
  moviePrice: 350              // 基礎票價
}
```
#### PUT `/api/movies/:id` - 更新電影資料
#### DELETE `/api/movies/:id` - 刪除電影

### 🏢 影城管理 (Cinemas)

#### GET `/api/cinemas` - 查詢所有影城
#### GET `/api/cinemas/:id` - 查詢單一影城
#### POST `/api/cinemas` - 新增影城
```javascript
{
  cinemaID: "C00001",          // 影城ID (6字元)
  cinemaName: "威秀信義店",     // 影城名稱 (最大50字元)
  cinemaLocation: "台北信義區", // 影城地址
  cinemaPhone: "02-12345678",   // 影城電話
  totalHalls: 12,              // 總廳數
  totalSeats: 2400             // 總座位數
}
```
#### PUT `/api/cinemas/:id` - 更新影城資料
#### DELETE `/api/cinemas/:id` - 刪除影城

### 👥 會員管理 (Members)

#### GET `/api/members` - 查詢所有會員 (管理用)
#### GET `/api/members/:id` - 查詢單一會員 🔒
#### POST `/api/members` - 新增會員 (同註冊)
#### PUT `/api/members/:id` - 更新會員資料 🔒
#### DELETE `/api/members/:id` - 刪除會員
#### POST `/api/members/:id/topup` - 會員加值 🔒
```javascript
{
  amount: 1000                 // 加值金額
}
```

### 📅 場次管理 (Showings)

#### GET `/api/showings` - 查詢所有場次
#### GET `/api/showings/:id` - 查詢單一場次
#### POST `/api/showings` - 新增場次
```javascript
{
  showingID: "S00001",         // 場次ID (6字元)
  movieID: "M00001",           // 電影ID
  cinemaID: "C00001",          // 影城ID
  showingDate: "2024-01-01",   // 場次日期
  showingTime: "14:30:00",     // 場次時間
  hallNumber: 3,               // 廳號
  totalSeats: 200,             // 總座位數
  availableSeats: 150          // 可用座位數
}
```
#### PUT `/api/showings/:id` - 更新場次資料
#### DELETE `/api/showings/:id` - 刪除場次
#### GET `/api/showings/:showingID/seats` - 查詢座位狀況
#### PUT `/api/showings/:showingID/seats/:seatNumber` - 更新座位狀態

### 🎫 訂票記錄 (Bookings)

#### GET `/api/bookings` - 查詢所有訂票記錄 (管理用)
#### GET `/api/bookings/:id` - 查詢單一訂票記錄
#### POST `/api/bookings` - 建立訂票記錄 🔒
```javascript
{
  memberID: "F123456789",      // 會員身分證號
  showingID: "S00001",         // 場次ID
  ticketClassID: "T00001",     // 票種ID
  mealsID: "M00001",           // 餐點ID (可選)
  seatNumbers: "A1,A2,A3",     // 座位號碼
  totalPrice: 960,             // 總金額
  orderStatusID: "S00001"      // 訂單狀態ID
}
```
#### GET `/api/bookings/member/:memberID` - 查詢會員訂票記錄 🔒
#### PUT `/api/bookings/:id` - 更新訂票記錄 🔒
#### DELETE `/api/bookings/:id` - 取消訂票記錄 🔒

### 📖 參考資料管理 (Reference Data)

#### 電影分級 (Rated)
- **GET** `/api/rated` - 查詢所有電影分級
- **POST** `/api/rated` - 新增電影分級

#### 電影版本 (Versions)
- **GET** `/api/versions` - 查詢所有電影版本
- **POST** `/api/versions` - 新增電影版本

#### 餐點管理 (Meals)
- **GET** `/api/meals` - 查詢所有餐點
- **POST** `/api/meals` - 新增餐點
```javascript
{
  mealsID: "M00001",           // 餐點ID (6字元)
  mealName: "爆米花套餐",       // 餐點名稱 (最大50字元)
  mealsPrice: 250,             // 餐點價格
  mealsDisp: "經典爆米花..."   // 餐點描述
}
```

#### 票種管理 (Ticket Classes)
- **GET** `/api/ticketclasses` - 查詢所有票種
- **POST** `/api/ticketclasses` - 新增票種
```javascript
{
  ticketClassID: "T00001",     // 票種ID (6字元)
  ticketClassName: "全票",      // 票種名稱 (最大50字元)
  ticketClassPrice: 320,       // 票種價格
  ticketInfo: "成人票價"       // 票種說明
}
```

#### 訂單狀態 (Order Status)
- **GET** `/api/orderstatus` - 查詢所有訂單狀態
- **POST** `/api/orderstatus` - 新增訂單狀態

### 👨‍💼 管理員系統 (Admin)

#### POST `/api/admin/login` - 管理員登入
```javascript
{
  account: "admin",            // 管理員帳號
  password: "admin123"         // 管理員密碼
}
```

#### GET `/api/admin` - 查詢所有管理員
#### POST `/api/admin/create` - 建立管理員帳號

### 🛠️ 系統工具 (Utilities)

#### GET `/api/test` - 測試資料庫連接
返回資料庫連接狀態與各表格資料統計

#### POST `/api/init-sample-data` - 初始化範例資料
建立完整的測試資料集，包含所有表格的範例資料

## 快速測試指令

### PowerShell 測試指令

```powershell
# 測試系統狀態
Invoke-RestMethod -Uri "http://localhost:3000"

# 初始化範例資料
Invoke-RestMethod -Uri "http://localhost:3000/api/init-sample-data" -Method POST

# 會員註冊
$registerData = @{
  memberID = "F123456789"
  memberAccount = "test_user"
  memberPwd = "password123" 
  memberName = "測試用戶"
  memberBirth = "1990-01-01"
  memberPhone = "0912345678"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"

# 會員登入
$loginData = @{ account = "test_user"; password = "password123" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"

# 查詢電影列表
Invoke-RestMethod -Uri "http://localhost:3000/api/movies"

# 查詢場次列表
Invoke-RestMethod -Uri "http://localhost:3000/api/showings"

# 新增餐點
$mealData = @{
  mealsID = "M99999"
  mealName = "測試餐點"
  mealsPrice = 150
  mealsDisp = "這是一個測試用餐點"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/meals" -Method POST -Body $mealData -ContentType "application/json"
```

### JavaScript 使用範例

```javascript
// 會員註冊
const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberID: 'F123456789',
    memberAccount: 'test_user',
    memberPwd: 'password123',
    memberName: '測試用戶',
    memberBirth: '1990-01-01',
    memberPhone: '0912345678'
  })
});

// 會員登入
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    account: 'test_user',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token; // 用於後續需要認證的請求

// 查詢個人資料 (需要認證)
const profileResponse = await fetch('http://localhost:3000/api/auth/profile', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// 建立訂票記錄 (需要認證)
const bookingResponse = await fetch('http://localhost:3000/api/bookings', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    memberID: 'F123456789',
    showingID: 'S00001',
    ticketClassID: 'T00001',
    seatNumbers: 'A1,A2',
    totalPrice: 640,
    orderStatusID: 'S00001'
  })
});

// 查詢電影列表 (不需認證)
const moviesResponse = await fetch('http://localhost:3000/api/movies');
const movies = await moviesResponse.json();
```

## 資料格式規格

根據使用者設計的資料表格式，所有 API 都已實現完整的輸入驗證：

### 會員 (member) 資料格式
- **memberID**: 身分證字號 (10字元, 台灣格式)
- **memberAccount**: 會員帳號 (最大50字元)
- **memberPwd**: 會員密碼 (最大50字元)
- **memberName**: 會員姓名 (最多10字元)
- **memberPhone**: 會員電話 (10位數字, 09xxxxxxxx)
- **memberBalance**: 帳號餘額 (最大100萬)

### ID 格式統一規則
- 所有 ID 都為 **6 字元**（電影ID、影城ID、餐點ID等）
- 名稱欄位統一為 **50 字元**
- 描述欄位統一為 **2000 字元**  
- 價格金額上限為 **100 萬**

### 完整資料格式規格

#### 電影 (movie) 資料格式
- **movieID**: 電影ID (6字元, 必填)
- **movieName**: 電影名稱 (最大50字元, 必填)
- **movieLength**: 電影長度 (分鐘, 數字)
- **movieInfo**: 電影介紹 (最大2000字元)
- **moviePhoto**: 電影海報路徑 (字串)
- **ratedID**: 分級ID (6字元, 必填)
- **versionID**: 版本ID (6字元, 必填)
- **movieDate**: 上映日期 (YYYY-MM-DD格式)
- **moviePrice**: 基礎票價 (數字, 最大100萬)

#### 影城 (cinema) 資料格式
- **cinemaID**: 影城ID (6字元, 必填)
- **cinemaName**: 影城名稱 (最大50字元, 必填)
- **cinemaLocation**: 影城地址 (最大100字元)
- **cinemaPhone**: 影城電話 (字串)
- **totalHalls**: 總廳數 (數字)
- **totalSeats**: 總座位數 (數字)

#### 場次 (showing) 資料格式
- **showingID**: 場次ID (6字元, 必填)
- **movieID**: 電影ID (6字元, 必填)
- **cinemaID**: 影城ID (6字元, 必填)
- **showingDate**: 場次日期 (YYYY-MM-DD格式, 必填)
- **showingTime**: 場次時間 (HH:MM:SS格式, 必填)
- **hallNumber**: 廳號 (數字, 必填)
- **totalSeats**: 總座位數 (數字)
- **availableSeats**: 可用座位數 (數字)

#### 訂票記錄 (booking) 資料格式
- **bookingID**: 訂票ID (6字元, 自動生成)
- **memberID**: 會員身分證號 (10字元, 必填)
- **showingID**: 場次ID (6字元, 必填)
- **ticketClassID**: 票種ID (6字元, 必填)
- **mealsID**: 餐點ID (6字元, 可選)
- **seatNumbers**: 座位號碼 (字串, 如"A1,A2,A3")
- **totalPrice**: 總金額 (數字, 必填)
- **orderStatusID**: 訂單狀態ID (6字元, 必填)
- **bookingDate**: 訂票日期 (自動生成)

#### 餐點 (meals) 資料格式
- **mealsID**: 餐點ID (6字元, 必填)
- **mealName**: 餐點名稱 (最大50字元, 必填)
- **mealsPrice**: 餐點價格 (數字, 必填)
- **mealsDisp**: 餐點描述 (最大2000字元)
- **mealsPhoto**: 餐點照片路徑 (字串)

#### 票種 (ticketclass) 資料格式
- **ticketClassID**: 票種ID (6字元, 必填)
- **ticketClassName**: 票種名稱 (最大50字元, 必填)
- **ticketClassPrice**: 票種價格 (數字, 必填)
- **ticketInfo**: 票種說明 (最大2000字元)

## 功能實作狀態

### 已完成功能 ✅

#### 身分驗證系統 (完整實作)
- `POST /api/auth/login` - 會員登入驗證
- `POST /api/auth/register` - 會員註冊 (支援身分證字號主鍵)
- `POST /api/auth/logout` - 會員登出 (需登入)
- `GET /api/auth/profile` - 獲取個人資料 (需登入)
- `POST /api/auth/check-account` - 檢查帳號可用性

#### 資料表管理 API (符合資料格式規格)
- `GET|POST /api/meals` - 餐點管理 (格式驗證)
- `GET|POST /api/ticketclasses` - 票種管理 (格式驗證)
- `GET|POST|PUT|DELETE /api/cinemas` - 影城管理 (格式驗證)
- `GET|POST|PUT|DELETE /api/movies` - 電影管理 (格式驗證)
- `GET|POST|PUT|DELETE /api/showings` - 場次管理
- `GET|POST|PUT|DELETE /api/bookings` - 訂票管理 (需登入)
- `GET|PUT /api/members` - 會員管理 (安全控制)

#### 安全功能
- Session Token 驗證中間件
- 輸入格式驗證 (根據資料規格)
- 權限控制 (只能存取自己的資料)
- 密碼欄位自動隱藏

### 待實作 API 🔧

#### 高優先級
```javascript
// 會員進階功能
PUT    /api/members/:id/password    // 修改密碼
POST   /api/members/:id/topup       // 會員儲值

// 訂票業務邏輯
POST   /api/bookings/create         // 完整訂票流程
PUT    /api/bookings/:id/cancel     // 取消訂票
GET    /api/bookings/search         // 多條件搜尋

// 座位管理
PUT    /api/showings/:id/seats/:seat // 更新座位狀態
POST   /api/seats/reserve           // 預約座位
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



## 專案結構

### 檔案結構 (重構後)
```
backend/
├── server.js              # 主伺服器 (重構版)
├── server_old.js          # 舊版本備份
├── database.js            # SQLite 資料庫類
├── quick_debug.js         # API 測試工具
├── moviesql.db           # SQLite 資料庫檔案
└── routes/               # API 路由模組
    ├── auth.js           # 會員認證 API
    ├── cinema.js         # 影城管理 API 
    ├── movie.js          # 電影管理 API
    ├── member.js         # 會員管理 API
    ├── booking.js        # 訂票管理 API
    ├── showing.js        # 場次管理 API
    ├── reference.js      # 參考資料 API
    └── admin.js          # 管理員 API
```

### API 結構
```
/api/auth/*           - 會員認證相關 (routes/auth.js)
/api/cinemas/*        - 影城管理 (routes/cinema.js)
/api/movies/*         - 電影管理 (routes/movie.js)
/api/members/*        - 會員管理 (routes/member.js)
/api/bookings/*       - 訂票管理 (routes/booking.js)
/api/showings/*       - 場次管理 (routes/showing.js)
/api/admin/*          - 管理員功能 (routes/admin.js)
/api/rated            - 電影分級 (routes/reference.js)
/api/meals            - 餐點管理 (routes/reference.js)
/api/ticketclasses    - 票種管理 (routes/reference.js)
```

### 重構優勢
- **模組化設計**: 不同功能 API 拆分到獨立檔案
- **更好維護**: 每個檔案只負責一個功能域
- **清晰結構**: 主 server.js 只負責路由註冊和中間件
- **方便擴展**: 新增功能只需修改相關檔案
- **安全控制**: 認證中間件集中管理

## 注意事項

- **管理員帳號**: admin / admin123
- **資料庫**: 自動建立 SQLite 檔案 (moviesql.db)
- **測試工具**: `npm run test` 進行 API 測試
- **重構備份**: 舊版本儲存於 server_old.js
