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
/**
 * 模擬生成唯一的票券 ID (ticketID)
 */
function generateTicketID() {
    return 'T' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 100);
}

// 假設 '無餐點' 或預設餐點的 ID
const DEFAULT_MEALS_ID = 'M00001'; 

// ----------------------------------------------------
// API: 完整訂票流程 (POST /api/bookings/create)
// ----------------------------------------------------
router.post('/create', async (req, res) => {
    const db = req.app.locals.db;
    const { 
        memberID, showingID, seatNumbers, ticketTypeID, unitPrice, 
        paymentMethod, cardNumber, securityCode, expirationDate 
    } = req.body;

    // --- 1. 基礎參數與付款方式檢查 ---
    if (!memberID || !showingID || !seatNumbers || seatNumbers.length === 0 || !ticketTypeID || !unitPrice || !paymentMethod) {
        return res.status(400).json({ success: false, error: '請提供完整的訂票資訊及付款方式' });
    }
    
    // 付款方式特有檢查
    if (paymentMethod === 'creditcard') {
        if (!cardNumber || !securityCode || !expirationDate) {
            return res.status(400).json({ success: false, error: '選擇信用卡付款，請提供完整的卡號、安全碼及到期日' });
        }
    } else if (paymentMethod !== 'balance') {
        return res.status(400).json({ success: false, error: '付款方式錯誤，請選擇 balance 或 creditcard' });
    }

    const totalAmount = unitPrice * seatNumbers.length;
    let orderID = null;
    const orderDate = new Date().toISOString(); // 用於 bookingTime 欄位
    let seatDetails = []; // 儲存 { seatNumber, seatID }

    try {
        // 2. 交易開始 
        await db.beginTransaction();
        
        // --- 3. 檢查座位狀態 & 取得 seatID (原子性操作) ---
        const placeholders = seatNumbers.map(() => '?').join(',');
        const seatCheckQuery = `
            SELECT seatNumber, seatState, seatID 
            FROM seat 
            WHERE showingID = ? AND seatNumber IN (${placeholders})
        `;
        const seats = await db.query(seatCheckQuery, [showingID, ...seatNumbers]);

        if (seats.length !== seatNumbers.length) {
            throw new Error('請求的座位號碼部分或全部不存在。');
        }

        const unavailableSeats = seats.filter(s => s.seatState !== 0);
        if (unavailableSeats.length > 0) {
            throw new Error(`座位已被預訂或鎖定: ${unavailableSeats.map(s => s.seatNumber).join(', ')}`);
        }
        
        seatDetails = seats.map(s => ({ seatNumber: s.seatNumber, seatID: s.seatID }));

        // --- 4. 檢查餘額/執行扣款或授權 ---
        let finalBalance = null;
        const [member] = await db.findAll('member', { memberID: memberID });
        if (!member) {
            throw new Error('會員 ID 不存在。');
        }

        if (paymentMethod === 'balance') {
            // 餘額扣款邏輯
            if (member.memberBalance < totalAmount) {
                throw new Error(`餘額不足。所需金額: ${totalAmount}, 當前餘額: ${member.memberBalance}`);
            }
            finalBalance = member.memberBalance - totalAmount;
            await db.update('member', { memberBalance: finalBalance }, { memberID: memberID });
            
        } else if (paymentMethod === 'creditcard') {
            // 信用卡授權模擬
            const authSuccess = Math.random() > 0.1; 
            if (!authSuccess) {
                throw new Error('信用卡授權失敗，請檢查卡片資訊或更換付款方式。');
            }
            finalBalance = member.memberBalance; 
        }

        // --- 5. 建立訂票子記錄 (bookingrecord) & 6. 更新座位狀態 ---
        orderID = generateOrderID(); // 生成本次交易的唯一 ID

        const bookingRecords = seatDetails.map((detail) => ({
            orderID: orderID,
            memberID: memberID, 
            showingID: showingID,
            seatID: detail.seatID,       // 寫入查詢到的 seatID
            ticketID: generateTicketID(), // 生成每張票券的唯一 ID
            mealsID: DEFAULT_MEALS_ID,    // 預設餐點 ID
            ticketTypeID: ticketTypeID,
            orderStateID: 'S00001', 
            bookingTime: orderDate,      // 寫入訂單時間
            // 由於您的 bookingrecord 結構沒有 orderAmount 和 ticketPrice，
            // 這裡不寫入，但您可以在後端日誌中記錄。
        }));
        
        // 批量插入 bookingrecord
        for (const record of bookingRecords) {
            await db.insert('bookingrecord', record); 
        }

        // 更新座位狀態 (將座位設為已預訂: 1)
        const seatUpdateQuery = `
            UPDATE seat SET seatState = 1 WHERE showingID = ? AND seatNumber IN (${placeholders})
        `;
        await db.query(seatUpdateQuery, [showingID, ...seatNumbers]);

        // 7. 交易提交
        await db.commit();

        res.status(201).json({ 
            success: true, 
            message: `訂票成功，已透過 ${paymentMethod === 'balance' ? '會員餘額' : '信用卡'} 完成付款與訂單建立`,
            orderID: orderID,
            reservedSeats: seatNumbers,
            totalAmount: totalAmount,
            newBalance: finalBalance
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