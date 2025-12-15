// routes/showing.js - 場次相關API
const express = require('express');
const router = express.Router();

// 查詢所有場次
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const showings = await db.findAll('showing');
    res.json(showings);
  } catch (error) {
    res.status(500).json({ error: '查詢場次失敗', details: error.message });
  }
});

// 查詢單一場次
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const showing = await db.findAll('showing', { showingID: req.params.id });
    if (showing.length === 0) {
      return res.status(404).json({ error: '找不到指定場次' });
    }
    res.json(showing[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢場次失敗', details: error.message });
  }
});

// 新增場次
router.post('/', async (req, res) => {
  try {
    const { showingID, movieID, theaterID, versionID, showingTime } = req.body;
    
    // 輸入驗證
    if (!showingID || !movieID || !theaterID || !versionID || !showingTime) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整場次資訊' 
      });
    }
    
    // ID 長度驗證 (所有 ID 都是 6 字元)
    const ids = { showingID, movieID, theaterID, versionID };
    
    for (const [key, value] of Object.entries(ids)) {
      if (value.length !== 6) {
        return res.status(400).json({ 
          success: false,
          error: `${key} 必須為 6 字元` 
        });
      }
    }
    
    // 放映時間格式驗證 (YYYY-MM-DD HH:MM:SS)
    const timeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(showingTime)) {
      return res.status(400).json({ 
        success: false,
        error: '放映時間格式錯誤 (需為 YYYY-MM-DD HH:MM:SS)' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('showing', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增場次成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增場次失敗', 
      details: error.message 
    });
  }
});

// 更新場次
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.update('showing', { showingID: req.params.id }, req.body);
    res.json({ message: '更新場次成功' });
  } catch (error) {
    res.status(500).json({ error: '更新場次失敗', details: error.message });
  }
});

// 刪除場次
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.delete('showing', { showingID: req.params.id });
    res.json({ message: '刪除場次成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除場次失敗', details: error.message });
  }
});

// 查詢特定場次的座位狀況
router.get('/:showingID/seats', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const seats = await db.findAll('seat', { showingID: req.params.showingID });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: '查詢座位失敗', details: error.message });
  }
});

// 更新座位狀態
router.put('/:showingID/seats/:seatNumber', async (req, res) => {
    try {
        const showingID = req.params.showingID;
        const seatNumber = req.params.seatNumber;
        const { seatState } = req.body; 

        // 檢查輸入：必須是有效的整數 (0, 1, 2)
        if (typeof seatState === 'undefined' || !Number.isInteger(seatState) || seatState < 0 || seatState > 2) {
            return res.status(400).json({ 
                success: false, 
                error: '座位狀態必須為 0 (可用), 1 (已預訂) 或 2 (鎖定)。' 
            });
        }
        
        const db = req.app.locals.db;

        // 執行資料庫更新操作
        const result = await db.update(
            'seat', 
            { seatState: seatState }, 
            { showingID, seatNumber }
        );

        if (result.changes === 0) {
            // 可能是找不到座位，或者狀態值沒有變化
            const existingSeat = await db.findAll('seat', { showingID, seatNumber });
            if (existingSeat.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: `找不到場次 ${showingID} 的座位 ${seatNumber}。` 
                });
            }
            // 如果找到了但沒有變更，返回 200
            return res.status(200).json({
                success: true,
                message: `座位 ${seatNumber} 狀態已是 ${seatState}，無需更新。`,
                changes: 0
            });
        }

        res.json({
            success: true,
            message: `座位 ${seatNumber} 狀態更新成功為 ${seatState}。`,
            changes: result.changes
        });

    } catch (error) {
        console.error('更新座位狀態失敗:', error);
        res.status(500).json({
            success: false,
            error: '更新座位狀態失敗',
            details: error.message
        });
    }
});
// 假設您在 routes/showings.js 或類似的路由檔案中

// PUT /api/showings/:id/seats/:seat
// 用於更新特定場次座位的狀態 (例如：設為維修/鎖定)
router.put('/:id/seats/:seat', async (req, res) => {
    try {
        const showingID = req.params.id;      // H00001
        const seatNumber = req.params.seat;   // A01
        const { seatState } = req.body;       // 預期接收新的狀態 (0: 可用, 1: 已預訂, 2: 鎖定)

        // 檢查輸入
        if (typeof seatState === 'undefined' || !Number.isInteger(seatState)) {
            return res.status(400).json({ 
                success: false, 
                error: '請提供有效的 seatState 欄位 (整數)。' 
            });
        }
        
        const db = req.app.locals.db;

        // 執行資料庫更新操作
        const result = await db.update(
            'seat', 
            { seatState: seatState }, 
            { showingID, seatNumber }
        );

        if (result.changes === 0) {
            // 可能是找不到座位，或者狀態值沒有變化
            const existingSeat = await db.find('seat', { showingID, seatNumber });
            if (existingSeat.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    error: `找不到場次 ${showingID} 的座位 ${seatNumber}。` 
                });
            }
            // 如果找到了但沒有變更，也算成功
            return res.status(200).json({
                success: true,
                message: `場次 ${showingID} 的座位 ${seatNumber} 狀態已是 ${seatState}，無需更新。`,
                changes: 0
            });
        }

        res.json({
            success: true,
            message: `場次 ${showingID} 的座位 ${seatNumber} 狀態更新成功為 ${seatState}。`,
            changes: result.changes
        });

    } catch (error) {
        console.error('更新座位狀態失敗:', error);
        res.status(500).json({
            success: false,
            error: '更新座位狀態失敗',
            details: error.message
        });
    }
});

// 假設您在 routes/showings.js 或 seats.js 中

// POST /api/seats/reserve
// 用於預約多個座位，需確保原子性
router.post('/reserve', async (req, res) => {
    const db = req.app.locals.db;
    
    // 預期接收的資料
    const { showingID, seatNumbers, memberID } = req.body; 

    // 基礎驗證
    if (!showingID || !seatNumbers || seatNumbers.length === 0 || !memberID) {
        return res.status(400).json({
            success: false,
            error: '請提供完整的場次ID、座位列表和會員ID。'
        });
    }
    
    // 確保所有操作在一個交易中完成
    try {
        await db.beginTransaction(); // 開始資料庫交易 (假設您的 db 實例有此方法)

        let reservedSuccessfully = [];
        let failedSeats = [];

        // 1. 檢查並鎖定座位 (Select for Update 邏輯)
        for (const seatNumber of seatNumbers) {
            // 檢查座位當前狀態 (seatState = 0: 可用)
            const seatRecord = await db.findAll(
                'seat', 
                { showingID, seatNumber }
                // 💡 提示：在 PostgreSQL/MySQL 中，這裡會加上 FOR UPDATE 鎖定
            );

            if (seatRecord.length === 0) {
                failedSeats.push({ seat: seatNumber, reason: '座位不存在' });
                continue;
            }

            // 假設 0=可用，1=已預訂，2=鎖定/維修
            if (seatRecord[0].seatState !== 0) {
                failedSeats.push({ 
                    seat: seatNumber, 
                    reason: `狀態不可用 (當前狀態: ${seatRecord[0].seatState})` 
                });
                continue;
            }

            // 2. 更新座位狀態為已預訂 (seatState = 1)
            const updateResult = await db.update(
                'seat', 
                { seatState: 1 }, 
                { showingID, seatNumber }
            );

            if (updateResult.changes > 0) {
                reservedSuccessfully.push(seatNumber);
            } else {
                failedSeats.push({ seat: seatNumber, reason: '更新狀態失敗' });
            }
        }

        // 3. 處理結果並建立訂單紀錄 (如果所有座位都預約失敗，則回滾)
        if (reservedSuccessfully.length === 0) {
            await db.rollback();
            return res.status(409).json({
                success: false,
                error: '預約失敗，所有座位皆已有人預訂或狀態無效。',
                details: failedSeats
            });
        }
        
        // 4. 建立訂單紀錄 (bookingrecord) - 簡化邏輯
        const newOrderID = `O${Date.now()}`; // 產生一個新的訂單 ID

        for (const seatNumber of reservedSuccessfully) {
            await db.insert('bookingrecord', {
                orderID: newOrderID,
                ticketID: `P${Math.random().toString(36).substring(2, 9)}`, // 隨機票券 ID
                memberID: memberID,
                showingID: showingID,
                orderStateID: 'S00005', // 暫定為待取票
                mealsID: null,
                ticketTypeID: 'T00001', // 暫定為全票
                bookingTime: new Date().toISOString(),
                seatID: seatNumber
            });
        }

        await db.commit(); // 提交交易

        res.status(200).json({
            success: true,
            message: `成功預約 ${reservedSuccessfully.length} 個座位並創建訂單。`,
            orderID: newOrderID,
            reservedSeats: reservedSuccessfully,
            failedSeats: failedSeats
        });

    } catch (error) {
        // 如果中間有任何錯誤，執行回滾
        await db.rollback(); 
        console.error('預約交易失敗:', error);
        res.status(500).json({
            success: false,
            error: '預約座位發生內部錯誤，交易已回滾。',
            details: error.message
        });
    }
});
// routes/showing.js

// 引入 Express 和 Router 實例... (假設已完成)
// const express = require('express');
// const router = express.Router();
// ...

// ----------------------------------------------------
// API: 查詢電影所有場次 (GET /api/movies/:id/showings)
// ----------------------------------------------------
router.get('/movies/:id/showings', async (req, res) => {
    try {
        const movieID = req.params.id; // 取得 URL 參數中的電影 ID

        if (!movieID) {
            return res.status(400).json({ 
                success: false, 
                error: '請提供有效的電影 ID' 
            });
        }

        const db = req.app.locals.db;
        
        // 1. 查詢所有屬於該 movieID 且尚未過期的場次
        // ⚠️ 假設 showingTime 欄位儲存為可比較的格式 (例如 ISO 8601 字符串或 Epoch Time)
        const now = new Date().toISOString(); 
        
        const showings = await db.findAll('showing', {
            movieID: movieID,
            // 選擇性加入過濾條件：只顯示未開始的場次
            // 例如: WHERE showingTime > ?
            // 如果 db.findAll 不支援複雜條件，您可能需要使用 db.query
        });

        // 2. 為了確保資料完整性，建議取出該場次的影廳、版本等資訊
        // 這裡僅簡單回傳 showing 表的結果。
        // 如果需要 JOIN 查詢，建議使用 db.query
        
        if (showings.length === 0) {
            return res.status(404).json({ 
                success: true, 
                message: `找不到電影 ID: ${movieID} 的任何場次`,
                showings: []
            });
        }

        res.json({ 
            success: true, 
            movieID: movieID,
            count: showings.length,
            showings: showings 
        });

    } catch (error) {
        console.error('查詢電影場次失敗:', error);
        res.status(500).json({ 
            success: false, 
            error: '伺服器內部錯誤，無法查詢電影場次', 
            details: error.message 
        });
    }
});

// module.exports = router; // 記得匯出路由

module.exports = router;