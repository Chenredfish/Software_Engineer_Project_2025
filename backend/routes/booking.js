// routes/booking.js - 訂票相關API
const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

router.get('/search', async (req, res) => {
    try {
        const db = req.app.locals.db;
        
        // req.query 包含 URL 中的所有查詢參數 (例如: ?memberID=M001&orderStateID=S01)
        const searchCriteria = req.query; 

        // 1. 檢查是否有提供任何查詢條件
        if (Object.keys(searchCriteria).length === 0) {
            // 如果沒有提供條件，可以選擇返回所有紀錄，或者提示使用者
            return res.status(400).json({ 
                success: false, 
                error: '請提供至少一個搜尋條件。',
                availableFields: [
                    'orderID', 'memberID', 'showingID', 
                    'ticketID', 'orderStateID', 'mealsID', 
                    'ticketTypeID', 'bookingTime', 'seatID'
                ]
            });
        }
        
        // 2. 執行資料庫查詢
        // 由於 db.findAll 支援傳入物件作為 WHERE 條件，這裡可以直接傳遞 searchCriteria
        const bookings = await db.findAll('bookingrecord', searchCriteria);

        // 3. 返回結果
        res.json({
            success: true,
            criteria: searchCriteria,
            count: bookings.length,
            bookings: bookings
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: '多條件搜尋訂票紀錄失敗', 
            details: error.message 
        });
    }
});
// 查詢所有訂票紀錄
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bookings = await db.findAll('bookingrecord');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: '查詢訂票紀錄失敗', details: error.message });
  }
});

// 查詢單一訂票紀錄
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const booking = await db.findAll('bookingrecord', { orderID: req.params.id });
    if (booking.length === 0) {
      return res.status(404).json({ error: '找不到指定訂票紀錄' });
    }
    res.json(booking[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢訂票紀錄失敗', details: error.message });
  }
});

// 新增訂票紀錄 (需要登入)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { 
      showingID, 
      ticketID, 
      orderStateID, 
      mealsID, 
      ticketTypeID, 
      seatID 
    } = req.body;
    
    // 輸入驗證
    if (!showingID || !ticketID || !orderStateID || !ticketTypeID || !seatID) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整訂票資訊' 
      });
    }
    
    // ID 長度驗證 (所有 ID 都是 6 字元)
    const ids = { showingID, ticketID, orderStateID, ticketTypeID, seatID };
    if (mealsID) ids.mealsID = mealsID;
    
    for (const [key, value] of Object.entries(ids)) {
      if (value.length !== 6) {
        return res.status(400).json({ 
          success: false,
          error: `${key} 必須為 6 字元` 
        });
      }
    }

    const db = req.app.locals.db;
    
    // 生成訂單 ID
    const allBookings = await db.findAll('bookingrecord');
    const nextOrderNum = String(allBookings.length + 1).padStart(6, '0');
    const orderID = `O${nextOrderNum.substring(1)}`;
    
    const newBooking = {
      orderID,
      memberID: req.memberID, // 從登入狀態獲取
      showingID,
      ticketID,
      orderStateID,
      mealsID: mealsID || null,
      ticketTypeID,
      bookingTime: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      seatID
    };
    
    await db.insert('bookingrecord', newBooking);
    res.status(201).json({ 
      success: true,
      message: '訂票成功',
      orderID: orderID,
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '訂票失敗', 
      details: error.message 
    });
  }
});

// 查詢會員的所有訂票紀錄 (需要登入)
router.get('/member/:memberID', requireAuth, async (req, res) => {
  try {
    // 只允許查看自己的訂票紀錄
    if (req.memberID !== req.params.memberID) {
      return res.status(403).json({ 
        success: false,
        error: '無權限查看此會員的訂票紀錄' 
      });
    }

    const db = req.app.locals.db;
    const bookings = await db.findAll('bookingrecord', { memberID: req.params.memberID });
    res.json({
      success: true,
      bookings: bookings,
      count: bookings.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢會員訂票紀錄失敗', 
      details: error.message 
    });
  }
});

// 更新訂票紀錄 (需要登入，只能修改自己的訂票)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // 檢查訂票是否屬於該會員
    const booking = await db.findAll('bookingrecord', { orderID: req.params.id });
    if (booking.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: '找不到指定訂票紀錄' 
      });
    }
    
    if (booking[0].memberID !== req.memberID) {
      return res.status(403).json({ 
        success: false,
        error: '無權限修改此訂票紀錄' 
      });
    }
    
    // 不允許修改 orderID 和 memberID
    const { orderID, memberID, ...updateData } = req.body;
    
    await db.update('bookingrecord', { orderID: req.params.id }, updateData);
    res.json({ 
      success: true,
      message: '更新訂票紀錄成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '更新訂票紀錄失敗', 
      details: error.message 
    });
  }
});

// 取消訂票 (需要登入，只能取消自己的訂票)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // 檢查訂票是否屬於該會員
    const booking = await db.findAll('bookingrecord', { orderID: req.params.id });
    if (booking.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: '找不到指定訂票紀錄' 
      });
    }
    
    if (booking[0].memberID !== req.memberID) {
      return res.status(403).json({ 
        success: false,
        error: '無權限取消此訂票' 
      });
    }
    
    await db.delete('bookingrecord', { orderID: req.params.id });
    res.json({ 
      success: true,
      message: '取消訂票成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '取消訂票失敗', 
      details: error.message 
    });
  }
});

// 假設您有一個 generateOrderID 函數，用於生成不重複的訂單 ID
function generateOrderID() {
    return 'B' + Date.now().toString().slice(-8) + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ----------------------------------------------------
// API: 完整訂票流程 (POST /api/bookings/create)
// ----------------------------------------------------
router.post('/create', async (req, res) => {
    const db = req.app.locals.db;
    const { memberID, showingID, seatNumbers, ticketTypeID, unitPrice } = req.body;

    if (!memberID || !showingID || !seatNumbers || seatNumbers.length === 0 || !ticketTypeID || !unitPrice) {
        return res.status(400).json({ success: false, error: '請提供完整的訂票資訊' });
    }

    const totalAmount = unitPrice * seatNumbers.length;
    let orderID = null;

    try {
        // 1. 交易開始
        await db.beginTransaction();
        
        // --- 2. 檢查座位狀態 (原子性操作) ---
        const placeholders = seatNumbers.map(() => '?').join(',');
        const seatCheckQuery = `
            SELECT seatNumber, seatState 
            FROM seat 
            WHERE showingID = ? AND seatNumber IN (${placeholders})
        `;
        const seats = await db.query(seatCheckQuery, [showingID, ...seatNumbers]);

        if (seats.length !== seatNumbers.length) {
            // 請求的座位數量和找到的座位數量不符
            throw new Error('請求的座位號碼部分或全部不存在。');
        }

        const unavailableSeats = seats.filter(s => s.seatState !== 0);
        if (unavailableSeats.length > 0) {
            throw new Error(`座位已被預訂或鎖定: ${unavailableSeats.map(s => s.seatNumber).join(', ')}`);
        }
        
        // --- 3. & 4. 檢查餘額並扣款 (原子性操作) ---
        const [member] = await db.findAll('member', { memberID: memberID });
        if (!member) {
            throw new Error('會員 ID 不存在。');
        }

        if (member.memberBalance < totalAmount) {
            throw new Error(`餘額不足。所需金額: ${totalAmount}, 當前餘額: ${member.memberBalance}`);
        }
        
        const newBalance = member.memberBalance - totalAmount;
        
        // 執行扣款
        await db.update('member', 
            { memberBalance: newBalance }, 
            { memberID: memberID }
        );

        // --- 5. 建立訂單主記錄 (orderrecord) ---
        orderID = generateOrderID();
        // 假設訂單狀態 S00001 = 交易成功
        await db.insert('orderrecord', {
            orderID: orderID,
            memberID: memberID,
            orderDate: new Date().toISOString(),
            orderStateID: 'S00001', 
            orderAmount: totalAmount
        });
        
        // --- 6. 建立訂票子記錄 (bookingrecord) & 7. 更新座位狀態 ---
        const seatUpdateQuery = `
            UPDATE seat SET seatState = 1 WHERE showingID = ? AND seatNumber IN (${placeholders})
        `;
        await db.query(seatUpdateQuery, [showingID, ...seatNumbers]);

        const bookingRecords = seatNumbers.map(seatNumber => ({
            orderID: orderID,
            showingID: showingID,
            seatNumber: seatNumber,
            ticketTypeID: ticketTypeID,
            ticketPrice: unitPrice,
            orderStateID: 'S00001' 
        }));
        
        // 由於 db.insert 不支援批次插入，您需要自行迭代或使用自定義的批次插入方法
        // 這裡我們假設 db.insert 可以接受單一物件，所以我們需要迴圈插入
        for (const record of bookingRecords) {
            await db.insert('bookingrecord', record);
        }

        // 8. 交易提交
        await db.commit();

        res.status(201).json({ 
            success: true, 
            message: '訂票成功，已完成扣款與訂單建立',
            orderID: orderID,
            reservedSeats: seatNumbers,
            totalAmount: totalAmount,
            newBalance: newBalance
        });

    } catch (error) {
        // 失敗則回滾
        await db.rollback();
        console.error('訂票交易失敗 (已回滾):', error.message);
        
        res.status(400).json({ 
            success: false, 
            error: error.message || '訂票流程失敗，交易已回滾',
            details: error.message 
        });
    }
});

module.exports = router;