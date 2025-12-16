const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite 資料庫檔案路徑
const dbPath = path.join(__dirname, 'moviesql.db');

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ SQLite 連接失敗:', err.message);
            } else {
                console.log('✅ 已連接到 SQLite 資料庫');
                this.initTables();
            }
        });
    }

    // 初始化資料表
    async initTables() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // 基礎設定
                this.db.run("PRAGMA foreign_keys = ON");
                
                // 建立所有資料表
                this.createTables()
                    .then(() => {
                        console.log('📊 資料表初始化完成');
                        resolve();
                    })
                    .catch(reject);
            });
        });
    }

    // 建立資料表
    async createTables() {
        const tables = [
            // 電影分級表
            `CREATE TABLE IF NOT EXISTS rated (
                ratedID TEXT PRIMARY KEY,
                rateName TEXT NOT NULL
            )`,

            // 電影版本表
            `CREATE TABLE IF NOT EXISTS version (
                versionID TEXT PRIMARY KEY,
                versionName TEXT NOT NULL
            )`,

            // 票種表
            `CREATE TABLE IF NOT EXISTS ticketclass (
                ticketClassID TEXT PRIMARY KEY,
                ticketClassName TEXT NOT NULL,
                ticketClassPrice INTEGER,
                ticketInfo TEXT
            )`,

            // 訂單狀態表
            `CREATE TABLE IF NOT EXISTS orderstatus (
                orderStatusID TEXT PRIMARY KEY,
                orderStatusName TEXT NOT NULL,
                orderInfo TEXT
            )`,

            // 餐點表
            `CREATE TABLE IF NOT EXISTS meals (
                mealsID TEXT PRIMARY KEY,
                mealName TEXT NOT NULL,
                mealsPrice INTEGER,
                mealsDisp TEXT,
                mealsPhoto TEXT
            )`,

            // 影城表
            `CREATE TABLE IF NOT EXISTS cinema (
                cinemaID TEXT PRIMARY KEY,
                cinemaAddress TEXT NOT NULL,
                cinemaName TEXT NOT NULL,
                cinemaPhoneNumber TEXT NOT NULL,
                cinemaBusinessTime TEXT NOT NULL,
                cinemaPhoto TEXT
            )`,

            // 會員表
            `CREATE TABLE IF NOT EXISTS member (
                memberID TEXT PRIMARY KEY,
                memberAccount TEXT UNIQUE NOT NULL,
                memberPwd TEXT NOT NULL,
                memberName TEXT NOT NULL,
                memberBirth DATE NOT NULL,
                memberPhone TEXT NOT NULL,
                memberBalance INTEGER DEFAULT 0
            )`,

            // 管理員表
            `CREATE TABLE IF NOT EXISTS supervisor (
                supervisorAccount TEXT PRIMARY KEY,
                supervisorPwd TEXT NOT NULL
            )`,

            // 電影表
            `CREATE TABLE IF NOT EXISTS movie (
                movieID TEXT PRIMARY KEY,
                movieName TEXT NOT NULL,
                movieTime TIME NOT NULL,
                ratedID TEXT NOT NULL,
                movieStartDate DATE NOT NULL,
                movieInfo TEXT,
                moviePhoto TEXT,
                director TEXT,
                actors TEXT,
                FOREIGN KEY (ratedID) REFERENCES rated(ratedID)
            )`,

            // 影廳表
            `CREATE TABLE IF NOT EXISTS theater (
                theaterID TEXT PRIMARY KEY,
                theaterName TEXT NOT NULL,
                cinemaID TEXT NOT NULL,
                FOREIGN KEY (cinemaID) REFERENCES cinema(cinemaID)
            )`,

            // 場次表
            `CREATE TABLE IF NOT EXISTS showing (
                showingID TEXT PRIMARY KEY,
                movieID TEXT NOT NULL,
                theaterID TEXT NOT NULL,
                versionID TEXT NOT NULL,
                showingTime DATETIME NOT NULL,
                FOREIGN KEY (movieID) REFERENCES movie(movieID),
                FOREIGN KEY (theaterID) REFERENCES theater(theaterID),
                FOREIGN KEY (versionID) REFERENCES version(versionID)
            )`,

            // 座位表
            `CREATE TABLE IF NOT EXISTS seat (
                showingID TEXT NOT NULL,
                seatNumber TEXT NOT NULL,
                seatState INTEGER DEFAULT 0,
                PRIMARY KEY (showingID, seatNumber),
                FOREIGN KEY (showingID) REFERENCES showing(showingID)
            )`,

            // 影城電影列表
            `CREATE TABLE IF NOT EXISTS movielist (
                cinemaID TEXT NOT NULL,
                movieID TEXT NOT NULL,
                PRIMARY KEY (cinemaID, movieID),
                FOREIGN KEY (cinemaID) REFERENCES cinema(cinemaID),
                FOREIGN KEY (movieID) REFERENCES movie(movieID)
            )`,
            // 🔑 新增：獨立的密碼重設權杖表
            `CREATE TABLE IF NOT EXISTS password_reset_tokens (
                token TEXT PRIMARY KEY,
                memberAccount TEXT NOT NULL,      -- 確保這行存在
                expires INTEGER NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // 訂票紀錄表
            `CREATE TABLE IF NOT EXISTS bookingrecord (
                orderID TEXT NOT NULL,
                ticketID TEXT NOT NULL,
                memberID TEXT NOT NULL,
                showingID TEXT NOT NULL,          -- ⚠️ 已修正拼寫錯誤: shwingID -> showingID
                orderStateID TEXT NOT NULL,
                mealsID TEXT,
                ticketTypeID TEXT NOT NULL,
                bookingTime DATETIME NOT NULL,
                seatID TEXT NOT NULL,
                PRIMARY KEY (orderID, ticketID),
                FOREIGN KEY (memberID) REFERENCES member(memberID),
                FOREIGN KEY (showingID) REFERENCES showing(showingID), -- ⚠️ 已修正外鍵參考
                FOREIGN KEY (orderStateID) REFERENCES orderstatus(orderStatusID),
                FOREIGN KEY (mealsID) REFERENCES meals(mealsID),
                FOREIGN KEY (ticketTypeID) REFERENCES ticketclass(ticketClassID)
            )`
        ];

        for (const sql of tables) {
            await this.run(sql);
        }
    }
    // ===================================================
    // 交易方法 (Transaction Methods) - 必須實作
    // ===================================================

    // 1. 開始交易
    async beginTransaction() {
        return this.db.run('BEGIN TRANSACTION;');
    }

    // 2. 提交交易
    async commit() {
        return this.db.run('COMMIT;');
    }

    // 3. 回滾交易 (修復您的錯誤)
    async rollback() {
        // 確保在發生錯誤時，不會因為嘗試回滾不存在的交易而崩潰
        try {
            return this.db.run('ROLLBACK;');
        } catch (error) {
            // 如果沒有活躍的交易可回滾，通常會拋出錯誤，這裡可以選擇忽略或記錄
            console.warn("Rollback failed, possibly no active transaction:", error.message);
        }
    }

    // Promise 化的資料庫操作
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes, lastID: this.lastID });
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ==================== 批量操作函式 (新增) ====================

    /**
     * 批量新增多筆資料到指定表格。
     * @param {string} table - 表格名稱。
     * @param {Array<Object>} records - 待新增的資料陣列。
     * @returns {Promise<Object>} 包含 lastID 和 changes 屬性。
     */
    async insertBulk(table, records) {
        if (!records || records.length === 0) {
            return { lastID: null, changes: 0 };
        }

        // 獲取第一個物件的所有鍵作為欄位名
        const keys = Object.keys(records[0]);
        
        // 構造 SQL 查詢： INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...), (?, ?, ...)
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        
        // 構造 VALUES 區塊： (??, ??), (??, ??), ...
        const valuePlaceholders = records.map(() => `(${placeholders})`).join(', ');

        const sql = `INSERT INTO ${table} (${columns}) VALUES ${valuePlaceholders}`;
        
        // 提取所有記錄的值，並將它們平鋪為一個單一的參數陣列
        const params = records.flatMap(record => keys.map(key => record[key]));
        
        // 使用 db.run 執行單一 SQL 語句
        return this.run(sql, params);
    }

    /**
     * 批量更新多筆資料到指定表格。
     * @param {string} table - 表格名稱。
     * @param {Array<Object>} updates - 待更新的資料陣列。每個物件必須包含一個用來定位的鍵 (例如 'movieID') 和更新內容。
     * @param {string} idKey - 用於定位記錄的主鍵欄位名稱 (例如 'movieID')。
     * @returns {Promise<number>} 總共變更的紀錄數量。
     */
    async updateBulk(table, updates, idKey) {
        if (!updates || updates.length === 0 || !idKey) {
            return 0;
        }

        let totalChanges = 0;
        // 由於 SQLite 不支持單一 SQL 語句進行複雜的批量 UPDATE，我們使用 Promise.all 併發執行多個 UPDATE 語句
        const updatePromises = updates.map(updateData => {
            // 過濾掉 idKey
            const updateKeys = Object.keys(updateData).filter(key => key !== idKey);
            if (updateKeys.length === 0) return Promise.resolve(0);

            const setClauses = updateKeys.map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE ${table} SET ${setClauses} WHERE ${idKey} = ?`;
            const params = updateKeys.map(key => updateData[key]).concat(updateData[idKey]);

            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function(err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                });
            });
        });

        const results = await Promise.all(updatePromises);
        totalChanges = results.reduce((sum, changes) => sum + changes, 0);
        return totalChanges;
    }

    /**
     * 批量刪除多筆資料。
     * @param {string} table - 表格名稱。
     * @param {Array<string|number>} ids - 待刪除紀錄的主鍵值陣列。
     * @param {string} idKey - 用於定位記錄的主鍵欄位名稱 (例如 'movieID')。
     * @returns {Promise<number>} 總共刪除的紀錄數量。
     */
    async deleteBulk(table, ids, idKey) {
        if (!ids || ids.length === 0 || !idKey) {
            return 0;
        }
        
        // 構造 SQL 查詢：DELETE FROM table WHERE idKey IN (?, ?, ...)
        const placeholders = ids.map(() => '?').join(', ');
        const sql = `DELETE FROM ${table} WHERE ${idKey} IN (${placeholders})`;

        // ids 陣列即為參數
        const params = ids; 

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }

    // ==================== 通用 CRUD 操作 (原有的) ====================

    async findAll(table, conditions = {}) {
        const keys = Object.keys(conditions);
        let sql = `SELECT * FROM ${table}`;
        let params = [];

        if (keys.length > 0) {
            const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
            sql += ` WHERE ${whereClause}`;
            params = keys.map(key => conditions[key]);
        }

        return await this.all(sql, params);
    }

    async insert(table, data) {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
        const params = keys.map(key => data[key]);

        return await this.run(sql, params);
    }

    async update(table, data, conditions) {
        const dataKeys = Object.keys(data);
        const conditionKeys = Object.keys(conditions);

        const setClause = dataKeys.map(key => `${key} = ?`).join(', ');
        const whereClause = conditionKeys.map(key => `${key} = ?`).join(' AND ');

        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        const params = [
            ...dataKeys.map(key => data[key]),
            ...conditionKeys.map(key => conditions[key])
        ];

        return await this.run(sql, params);
    }

    async delete(table, conditions) {
        const keys = Object.keys(conditions);
        const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
        const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
        const params = keys.map(key => conditions[key]);

        return await this.run(sql, params);
    }

    // 自定義查詢
    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // 關閉資料庫連接
    close() {
        return new Promise((resolve) => {
            this.db.close((err) => {
                if (err) console.error(err.message);
                else console.log('資料庫連接已關閉');
                resolve();
            });
        });
    }
}

// 建立資料庫實例
const database = new Database();

module.exports = database;