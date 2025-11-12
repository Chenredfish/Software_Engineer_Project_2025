# 威泰影城 Print 元件（React）
以 React 實作《威泰影城售票系統設計規格書》4.10 節中所有 **Print** 類 UI 元件。

## 安裝與使用
```bash
# 將 src/ 複製到你的 React 專案根目錄
# 或者：將 components 目錄複製到 /src/components 下
npm i
# 在你的 App.jsx 中：
import { /* 需要的元件 */ } from "./components";
```

## 檔案結構
- `src/components/SharedUI.jsx`: 共用 UI（InfoCard、Alert、KeyValue）
- `src/components/LoginPrints.jsx`: 登入模組 Print 元件（L6, L10, L12, L15）
- `src/components/SignPrints.jsx`: 註冊模組 Print 元件（S5, S7, S10, S12, S15, S19, S21）
- `src/components/BookPrints.jsx`: 訂票模組 Print 元件（B4, B7, B10, B13, B15, B17, B18, B21, B23, B25, B30, B31, B33）
- `src/components/InquiryPrints.jsx`: 訂票紀錄模組 Print 元件（In3, In7, In12）
- `src/components/BrowsePrints.jsx`: 相關查詢模組 Print 元件（Br2, Br3, Br5, Br7, Br8, Br10, Br11, Br13, Br14, Br16, Br18, Br20, Br22, Br24, Br26）
- `src/components/MemberChangePrints.jsx`: 會員資料變更模組 Print 元件（M3, M10, M12, M17, M18）
- `src/components/ControllerPrints.jsx`: 管理員模組 Print 元件（C4 包含 Print 行為）
- `src/components/index.js`: 匯出所有元件
- `src/App.jsx`: 範例頁面（可選）

## 設計說明
- **無需外部 UI 套件**：僅使用簡單的 className，方便直接整合任意設計系統或 Tailwind。
- **可測試**：所有元件純函式、無副作用。
- **型別**：可按需加入 TypeScript 或 PropTypes。

## 版權
此實作僅供作業/專案示範用，對應規格書之 Print 類 UI 行為。