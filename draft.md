MVC 架構下的工具清單 (我們需要學習的)
MVC 是一種設計模式，將應用程式分為三個核心部分，讓程式碼更有組織。

1. M (Model) - 處理資料和商業邏輯
Sequelize (ORM):

用途: 簡化與關聯式資料庫（如 MySQL）的互動。你不需要寫繁瑣的 SQL 語句，而是使用 JavaScript 物件來定義和操作資料。

為什麼學: 它可以讓你專注於商業邏輯，而不是資料庫的細節。例如，創建一個 Movie 模型，你就可以用 Movie.create() 來新增一筆電影資料。

MySQL:

用途: 儲存所有結構化的資料，例如電影資訊、會員資料、訂單記錄等。

為什麼學: 它是業界最常見的免費關聯式資料庫之一，穩定且功能強大。

2. V (View) - 呈現使用者介面
React:

用途: 這是你們選擇的前端框架，用於建立互動式使用者介面。

為什麼學: 它的組件化設計能讓網頁開發更高效、可重複使用，特別適合像電影院網頁這樣有多個頁面的專案。

3. C (Controller) - 協調 Model 和 View
Express.js:

用途: 建立後端伺服器和 API 路由，負責接收前端的請求，呼叫 Model 處理資料，並將結果回傳給前端。

為什麼學: 它是 Node.js 上最受歡迎的框架，輕量且彈性高，能讓你們快速建立 RESTful API。

其他必要工具
Node.js: 作為後端程式碼的執行環境。

Git & GitHub: 團隊協作、版本控制的必備工具。

npm/yarn: Node.js 的套件管理工具，用於安裝各種函式庫。

Postman: 一個測試工具，讓你可以在前端開發前，先測試後端 API 是否能正常運作。

MVC 架構下的開發流程建議
以下是你們可以遵循的詳細開發步驟，這能確保前後端各司其職，並順利整合。

步驟 1: 後端 (MVC) 開發
專案初始化:

創建一個新的 Node.js 專案資料夾。

執行 npm init -y 來初始化專案。

安裝必要的套件：npm install express mysql2 sequelize。

Model 層:

資料庫設定: 使用 Sequelize 建立與 MySQL 的連線。

定義模型: 根據需求定義資料模型。例如，創建 movie.model.js、user.model.js 和 booking.model.js 等檔案，在裡面定義資料表的欄位（如電影的名稱、上映日期；使用者的帳號密碼等）。

Controller 層:

路由設計: 在 routes 資料夾中，定義 API 的路由。例如，在 movies.routes.js 中定義 GET /api/movies (取得電影列表)、GET /api/movies/:id (取得單部電影資訊) 等。

業務邏輯: 在 controllers 資料夾中，實作各個路由的處理邏輯。例如，在 movies.controller.js 中，當接收到 GET /api/movies 請求時，呼叫 Model 層的 Movie.findAll() 方法來取得所有電影資料，然後將資料以 JSON 格式回傳給前端。

啟動伺服器:

在主程式 app.js 中，設定 Express 伺服器，並載入所有路由。

使用 app.listen() 啟動伺服器。

步驟 2: 前端 (React) 開發
專案初始化:

使用 create-react-app 或 Vite 建立一個 React 專案。

安裝必要的 UI 函式庫，如 MUI。

組件化開發:

頁面組件: 創建首頁 HomePage.jsx、電影詳情頁 MovieDetailPage.jsx 和訂票頁 BookingPage.jsx 等。

共用組件: 將可重複使用的部分，如導覽列 Navbar.jsx、電影卡片 MovieCard.jsx 等，獨立成組件。

API 串接:

使用 fetch 或 axios 等函式庫，在 React 組件中發送 HTTP 請求到後端 API。

例如，在 HomePage.jsx 的 useEffect Hook 中，發送 GET /api/movies 請求，並使用 useState 來儲存和顯示電影列表。

步驟 3: 前後端整合與部署
開發測試:

同時啟動後端伺服器和前端開發伺服器（通常是 npm start），確保兩者能正常溝通。

使用 Postman 或瀏覽器的開發者工具來測試後端 API。

部署:

後端: 將你的 Node.js 專案部署到 Render 或 Railway，這些服務會提供一個公開的 API 網址。

前端: 將你的 React 專案部署到 Vercel 或 GitHub Pages。

跨域問題: 在後端專案中，記得設定 CORS (Cross-Origin Resource Sharing)，允許前端網域存取後端 API。


註冊子系統（活動圖+循序圖）*不用處理設定忘記密碼題目。一次輸入完之後才去跟資料庫對比。密碼應該有門檻（大小寫符號）

登入子系統（同上）*忘記密碼應該是送一封信和驗證碼（網站產生暫時的驗證碼）

會員資料變更子系統*應該先經過登入子系統。會員身份根本不是動作，顯示說明和跳轉也不用寫，直接合併成「儲值」，然後下一步才產生資料正確和錯誤

訂票紀錄查詢子系統*同上，經過登入子系統（不用輸入帳號等等一大堆）。應該是顯示訂票，然後可以選擇關閉或退票，退票應該在顯示的下面

訂票子系統*同上，經過登入子系統。沒有特殊票。查看座位不用，直接選擇座位

會員儲值子系統*不用這東西，跟會員資料變更放一起了

相關查詢子系統*電影介紹不用分開選擇，應該都在同一畫面

*管理員管理子系統（原本沒有）

需求規格書：https://changgunguniversity-my.sharepoint.com/:w:/g/personal/b1229057_cgu_edu_tw/Ed1hJj-6NkBGhOO6YuyWL28BcWrLhIGIuIpt6Ads8QMv9A?e=cyw9pN

網站 figma：https://www.figma.com/design/YtWDINtoqmA06v2gOiLmSu/%E5%A8%81%E7%A7%80%E5%BD%B1%E5%9F%8E%E7%B6%B2%E7%AB%99?node-id=3-143&m=dev&t=U1H7MWPLPDRLNtYR-1

新網站 figma：https://www.figma.com/design/75kctMvVyWWDI8xohaNysu/%E5%A8%81%E7%A7%80%E5%BD%B1%E5%9F%8E%E7%B6%B2%E7%AB%99-%E8%A8%AD%E8%A8%88%E8%A6%8F%E6%A0%BC?node-id=8-589&m=dev&t=giPxrlc0Xi7RlRER-1
