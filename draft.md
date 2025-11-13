# 威秀影城網站 - MVC 架構開發規劃

## 系統架構概述
本專案採用 MVC (Model-View-Controller) 架構，結合現代前後端分離技術，建立完整的電影院售票網站。

## 技術架構

### 1. M (Model) - 資料層
**Sequelize (ORM)**
- 用途: 簡化與 MySQL 資料庫的互動，使用 JavaScript 物件操作資料
- 核心功能: 定義資料模型、處理資料庫關聯、執行 CRUD 操作
- 範例: User.create(), Movie.findAll(), Booking.update()

**MySQL 資料庫**
- 用途: 儲存所有結構化資料
- 主要資料表: 會員資料、電影資訊、場次資料、訂票記錄、管理員資料

### 2. V (View) - 視圖層
**React 18 + Material UI (MUI)**
- 前端框架: React 18 (函數式組件 + Hooks)
- UI 框架: Material UI v5 - 提供現代化、響應式的 UI 組件
- 特色: 組件化開發、狀態管理、虛擬 DOM

**Material UI 核心組件應用**
- AppBar: 導覽列
- Card: 電影卡片、資訊展示
- Dialog: 彈出視窗、確認對話框
- TextField: 表單輸入
- Button: 各種操作按鈕
- DataGrid: 資料表格顯示
- Stepper: 訂票流程步驟

### 3. C (Controller) - 控制層
**Express.js**
- 用途: 建立 RESTful API 伺服器
- 功能: 路由管理、中間件處理、API 端點定義
- 整合: JWT 認證、CORS 跨域、資料驗證

## 開發工具與環境

### 必要工具
- **Node.js**: 後端執行環境
- **Git & GitHub**: 版本控制與團隊協作
- **npm/yarn**: 套件管理工具
- **Postman**: API 測試工具
- **VS Code**: 開發 IDE (推薦安裝 React、Material UI 相關擴展)

### 前端開發套件
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install axios react-router-dom
```

### 後端開發套件
```bash
npm install express mysql2 sequelize
npm install cors bcryptjs jsonwebtoken
npm install nodemailer dotenv
```

## 系統功能模組架構

根據功能需求分析，系統分為以下七大主要模組，每個模組以 `Main` 函數作為核心入口點：

### 主要功能模組

#### 1. 登入子系統 (Login Module) - `MainLogin()`
**流程概述**: 使用者登入驗證與忘記密碼處理
- **前端組件**: `LoginPrints.jsx` (Material UI Login Form)
- **核心功能**: 
  - 登入驗證 (L1-L6)
  - 忘記密碼流程 (L7-L15)
  - 登出功能 (L16)
- **UI 設計**: 
  - TextField (帳號密碼輸入)
  - Button (登入/忘記密碼)
  - Dialog (驗證碼輸入彈窗)

#### 2. 註冊子系統 (Sign Module) - `MainSign()`
**流程概述**: 新會員註冊與資料驗證
- **前端組件**: `SignPrints.jsx` (Multi-step Registration Form)
- **核心功能**:
  - 個人資料收集 (S2-S3, S8, S13, S16-S17)
  - 即時格式驗證 (S4-S5, S9-S10, S18-S19)
  - 重複性檢查 (S6-S7, S14-S15)
  - 資料庫寫入 (S20-S21)
- **UI 設計**:
  - Stepper (註冊步驟指示)
  - TextField (各項輸入欄位)
  - Alert (錯誤訊息提示)

#### 3. 訂票子系統 (Booking Module) - `MainBook()`
**流程概述**: 完整的電影訂票流程
- **前端組件**: `BookPrints.jsx` (Booking Wizard)
- **核心功能**:
  - 影城/電影/場次選擇 (B3-B14)
  - 票種數量設定 (B15-B17)
  - 座位選擇介面 (B20-B22)
  - 付款處理 (B25-B34)
- **UI 設計**:
  - Card (電影資訊卡片)
  - Grid (座位選擇網格)
  - Stepper (訂票步驟)
  - Payment Dialog (付款彈窗)

#### 4. 查詢子系統 (Inquiry Module) - `MainInquiry()`
**流程概述**: 訂票記錄查詢與退票處理
- **前端組件**: `InquiryPrints.jsx` (Booking History Table)
- **核心功能**:
  - 訂票記錄顯示 (In3)
  - 退票條件檢查 (In4-In6)
  - 退款處理 (In8-In12)
- **UI 設計**:
  - DataGrid (訂票記錄表格)
  - Button (退票操作)
  - Dialog (退票確認)

#### 5. 瀏覽子系統 (Browse Module) - `MainBrowse()`
**流程概述**: 電影資訊與影城資訊瀏覽
- **前端組件**: `BrowsePrints.jsx` (Information Browser)
- **核心功能**:
  - 多類型資訊瀏覽 (Br2-Br16)
  - 快搜功能 (Br17-Br26)
- **UI 設計**:
  - Tabs (資訊分類切換)
  - Card (內容展示)
  - Search Bar (快搜介面)

#### 6. 會員資料變更子系統 (Member Module) - `MainMemberChange()`
**流程概述**: 會員資料修改與儲值功能
- **前端組件**: `MemberChangePrints.jsx` (Profile Management)
- **核心功能**:
  - 個人資料修改 (M3-M12)
  - 儲值卡加值 (M13-M19)
- **UI 設計**:
  - Form (資料修改表單)
  - Card (餘額顯示)
  - Payment Integration (加值介面)

#### 7. 管理員系統 (Controller Module) - `MainController()`
**流程概述**: 後台管理功能
- **前端組件**: `ControllerPrints.jsx` (Admin Dashboard)
- **核心功能**:
  - 管理員登入 (C2-C4)
  - 資料 CRUD 操作 (C5-C9)
- **UI 設計**:
  - Dashboard Layout
  - DataGrid (資料管理表格)
  - Form Dialog (新增/編輯資料)

## 開發架構與流程

### 前端架構 (React + Material UI)
```
src/
├── components/
│   ├── App.jsx                 # 主應用程式
│   ├── SharedUI.jsx           # 共用 UI 組件
│   ├── LoginPrints.jsx        # 登入介面
│   ├── SignPrints.jsx         # 註冊介面
│   ├── BookPrints.jsx         # 訂票介面
│   ├── InquiryPrints.jsx      # 查詢介面
│   ├── BrowsePrints.jsx       # 瀏覽介面
│   ├── MemberChangePrints.jsx # 會員資料介面
│   └── ControllerPrints.jsx   # 管理員介面
├── services/
│   └── api.js                 # API 服務層
├── utils/
│   └── validation.js          # 資料驗證工具
└── styles/
    └── theme.js               # Material UI 主題設定
```

### 後端架構 (Express.js + Sequelize)
```
server/
├── models/
│   ├── User.js               # 會員模型
│   ├── Movie.js              # 電影模型
│   ├── Booking.js            # 訂票模型
│   └── Admin.js              # 管理員模型
├── controllers/
│   ├── authController.js     # 認證控制器
│   ├── bookingController.js  # 訂票控制器
│   ├── memberController.js   # 會員控制器
│   └── adminController.js    # 管理員控制器
├── routes/
│   ├── auth.js              # 認證路由
│   ├── booking.js           # 訂票路由
│   ├── member.js            # 會員路由
│   └── admin.js             # 管理員路由
└── middleware/
    ├── auth.js              # 身份驗證中間件
    └── validation.js        # 資料驗證中間件
```


## 開發流程建議

### 階段 1: 後端開發 (Express.js + Sequelize)
1. **專案初始化**
   ```bash
   npm init -y
   npm install express mysql2 sequelize cors bcryptjs jsonwebtoken
   ```

2. **Model 層開發**
   - 設定 Sequelize 資料庫連線
   - 定義各功能模組的資料模型
   - 建立資料表關聯性

3. **Controller 層開發**
   - 實作各 Main 函數的業務邏輯
   - 建立 API 端點對應功能編號
   - 加入資料驗證與錯誤處理

4. **API 路由設計**
   ```javascript
   // 範例 API 結構
   POST /api/auth/login          // L1-L6 登入流程
   POST /api/auth/register       // S1-S21 註冊流程  
   POST /api/booking/create      // B1-B34 訂票流程
   GET  /api/booking/history     // In1-In12 查詢流程
   PUT  /api/member/profile      // M1-M12 資料變更
   POST /api/admin/login         // C1-C4 管理員登入
   ```

### 階段 2: 前端開發 (React + Material UI)
1. **專案初始化**
   ```bash
   npx create-react-app cinema-frontend
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material axios react-router-dom
   ```

2. **Material UI 主題設定**
   ```javascript
   // theme.js - 威秀影城品牌主題
   import { createTheme } from '@mui/material/styles';
   
   export const theme = createTheme({
     palette: {
       primary: { main: '#1976d2' },      // 威秀藍
       secondary: { main: '#ff6b35' },    // 橘色強調
     },
     components: {
       MuiButton: { /* 客製化按鈕樣式 */ },
       MuiCard: { /* 客製化卡片樣式 */ }
     }
   });
   ```

3. **組件開發順序**
   - `SharedUI.jsx`: 共用組件 (Navbar, Footer, Loading)
   - `App.jsx`: 路由配置與全域狀態
   - 依功能優先順序開發各 Prints 組件

4. **API 整合服務**
   ```javascript
   // services/api.js
   import axios from 'axios';
   
   const API_BASE = 'http://localhost:3001/api';
   
   export const authAPI = {
     login: (credentials) => axios.post(`${API_BASE}/auth/login`, credentials),
     register: (userData) => axios.post(`${API_BASE}/auth/register`, userData)
   };
   ```

### 階段 3: 整合與測試
1. **前後端連接測試**
2. **功能流程驗證**
3. **UI/UX 優化調整**
4. **效能優化與部署準備**

## 系統需求與設計規範

### 功能需求重點
- **註冊/登入系統**: 密碼需包含大小寫字母與符號，忘記密碼採用 Email 驗證碼機制
- **訂票系統**: 需經過登入驗證，簡化票種選擇，直接整合座位選擇
- **查詢系統**: 支援退票功能，需檢查退票時間限制（放映前2小時）
- **會員系統**: 整合個人資料修改與儲值功能
- **瀏覽系統**: 統一資訊展示介面，支援快速搜尋
- **管理系統**: 完整的後台 CRUD 功能

### 設計參考資源
- **需求規格書**: [SharePoint 連結](https://changgunguniversity-my.sharepoint.com/:w:/g/personal/b1229057_cgu_edu_tw/Ed1hJj-6NkBGhOO6YuyWL28BcWrLhIGIuIpt6Ads8QMv9A?e=cyw9pN)
- **原始設計稿**: [Figma 舊版](https://www.figma.com/design/YtWDINtoqmA06v2gOiLmSu/%E5%A8%81%E7%A7%80%E5%BD%B1%E5%9F%8E%E7%B6%B2%E7%AB%99?node-id=3-143&m=dev&t=U1H7MWPLPDRLNtYR-1)
- **新版設計稿**: [Figma 新版](https://www.figma.com/design/75kctMvVyWWDI8xohaNysu/%E5%A8%81%E7%A7%80%E5%BD%B1%E5%9F%8E%E7%B6%B2%E7%AB%99-%E8%A8%AD%E8%A8%88%E8%A6%8F%E6%A0%BC?node-id=8-589&m=dev&t=giPxrlc0Xi7RlRER-1)

## 函數對應表

### 分類說明
- **Main**: 主要功能入口點
- **Input**: 使用者輸入處理
- **Check**: 資料驗證與狀態檢查  
- **Print**: UI 顯示與回應
- **Function**: 業務邏輯處理

### 完整功能編號對照
```
登入模組 (L1-L16) → LoginPrints.jsx
註冊模組 (S1-S21) → SignPrints.jsx  
訂票模組 (B1-B34) → BookPrints.jsx
查詢模組 (In1-In12) → InquiryPrints.jsx
瀏覽模組 (Br1-Br26) → BrowsePrints.jsx
會員模組 (M1-M19) → MemberChangePrints.jsx
管理模組 (C1-C9) → ControllerPrints.jsx
```

透過這個架構，每個功能模組都有明確的職責分工，並且運用 Material UI 提供現代化的使用者體驗。

## 大模組間的介面流程設計

### 系統整體流程架構
```
                    🏠 首頁 (App.jsx)
                           |
        ┌─────────────────┴─────────────────┐
        |                                   |
   🔐 未登入狀態                      🔓 已登入狀態
        |                                   |
  ┌─────┴─────┐                    ┌─────┬─────┬─────┬─────┐
  |     |     |                    |     |     |     |     |
瀏覽   登入   註冊                 瀏覽   訂票   查詢  會員  登出
(Br)   (L)    (S)                 (Br)   (B)   (In)  (M)   (L16)
```

### 1. 主要模組間的跳轉流程

#### 🎯 **核心認證流程**
```
任何頁面 → 需要登入功能 → CheckLoginState() (L2)
                          ↓
                    ┌─────────────┐
                    |  登入狀態?   |
                    └─────┬───────┘
                    False |  True
                    ┌─────↓      ↓──────────┐
              強制跳轉至           允許使用會員功能
            LoginPrints.jsx      (B, In, M 模組)
                    |
              ┌─────┴─────┐
              |           |
         登入成功      註冊新帳號
    (回到原頁面)    → SignPrints.jsx
                           |
                     註冊完成後 → 自動登入
                           |
                    回到原始頁面
```

#### 🔄 **模組間的相互關聯**

**瀏覽模組 (BrowsePrints) 的擴展流程**
```
BrowsePrints.jsx (瀏覽電影資訊)
         |
    選擇電影後想要訂票
         ↓
   CheckLoginState() (L2)
         ↓
   ┌─────────────┐
   | 已登入?      |
   └─────┬───────┘
   False |  True
   ┌─────↓      ↓────────────┐
登入流程        直接跳轉至
(L1-L16)      BookPrints.jsx
   |           (帶入電影資訊)
登入成功 ──────────┘
```

**訂票模組 (BookPrints) 的後續流程**
```
BookPrints.jsx (完成訂票)
         |
    訂票成功 → 生成訂票記錄
         ↓
   提供使用者選項:
   ┌─────┴─────┐
   |           |
繼續訂票     查看訂票記錄
   |              |
重新進入        跳轉至
BookPrints    InquiryPrints.jsx
```

**會員模組 (MemberChangePrints) 的整合功能**
```
MemberChangePrints.jsx
         |
   ┌─────┴─────┐
   |           |
個人資料修改    儲值卡功能
   |           |
   |        儲值成功後
   |           ↓
   |    提示可用於訂票
   |           |
   └─────┬─────┘
         |
    可跳轉至 BookPrints.jsx
```

### 3. 管理員系統獨立流程

**管理員系統特色 (ControllerPrints):**
1. **獨立入口**: 特殊 URL 路徑 (如：`/admin`)
2. **身份驗證**: 管理員帳密驗證 (C2-C4)
3. **權限控制**: 
   - **驗證失敗**: 拒絕存取，顯示錯誤訊息
   - **驗證成功**: 進入管理後台 (C5-C9 功能)
4. **完全獨立**: 不與其他使用者模組互動

### 3. 模組間的資料傳遞

#### 📊 **共用狀態管理**
```
App.jsx (全域狀態)
    |
┌───┴───┐
|       |
登入狀態  使用者資訊
(boolean) (User Object)
    |       |
    └───┬───┘
        ↓
所有子模組共用
- LoginPrints: 更新登入狀態
- BookPrints: 讀取使用者資訊
- InquiryPrints: 顯示該使用者的訂票記錄  
- MemberChangePrints: 顯示/修改使用者資料
```

#### 🔗 **模組間的資料流**
```
BrowsePrints → BookPrints
(傳遞選中的電影資訊)

BookPrints → InquiryPrints  
(新增訂票記錄)

MemberChangePrints → BookPrints
(更新後的儲值卡餘額)

InquiryPrints → MemberChangePrints
(退票後的餘額更新)
```

### 4. 導航控制機制

#### 🧭 **SharedUI.jsx 的導航角色**
```
SharedUI.jsx (導覽列組件)
    |
┌───┴─────────────────────────────────┐
|                                     |
根據登入狀態動態顯示選單                路由導航管理
    |                                     |
未登入: [首頁][瀏覽][登入][註冊]          React Router
已登入: [首頁][瀏覽][訂票][查詢][會員][登出]    |
    |                                     |
    └─────────────────┬─────────────────┘
                      |
              點擊選單項目時的跳轉邏輯:
              - 檢查權限 (CheckLoginState)
              - 執行跳轉或強制登入
```

#### 🚪 **頁面跳轉的統一處理**
```
任何模組想要跳轉時:
    |
呼叫 SharedUI 的導航函數
    ↓
CheckLoginState() (L2) 權限檢查
    ↓
┌─────────────┐
| 有權限存取?  |  
└─────┬───────┘
True  |  False
  ┌───↓      ↓─────────┐
直接跳轉     強制跳轉至
目標頁面     LoginPrints
  |              |
成功        登入成功後跳轉
            至原目標頁面
```

### 5. 錯誤處理與例外流程

#### ⚠️ **跨模組錯誤處理**
```
任何模組發生錯誤
        ↓
SharedUI.jsx 統一錯誤處理
        ↓
┌───────┴────────┐
|               |
網路錯誤        權限錯誤
    |               |
顯示重試選項    強制跳轉登入
    |               |
└───────┬───────────┘
        |
  錯誤恢復後返回
    原始模組
```

這樣的模組間流程設計確保了：
- **統一的使用者體驗**: 所有模組間的跳轉都遵循相同的邏輯
- **清楚的權限管理**: 透過 CheckLoginState() 統一控制
- **靈活的資料傳遞**: 模組間可以有效地共享和傳遞資訊
- **可維護的架構**: 每個模組的責任清楚，便於開發和維護

這些詳細的介面流程設計將幫助開發團隊更精確地實作每個功能模組。
