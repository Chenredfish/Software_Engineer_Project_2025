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
                    'ticketTypeID', 'bookingTime', 'seatNumber'
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
      seatNumber 
    } = req.body;
    
    // 輸入驗證
    if (!showingID || !ticketID || !orderStateID || !ticketTypeID || !seatNumber) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整訂票資訊' 
      });
    }
    
    // ID 長度驗證 (所有 ID 都是 6 字元)
    const ids = { showingID, ticketID, orderStateID, ticketTypeID, seatNumber };
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
      seatNumber
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
    
    // 添加完整的 JOIN 查詢，包含餐點資訊
    const query = `
      SELECT 
        br.*,
        s.showingTime,
        m.movieName,
        t.theaterName,
        c.cinemaName,
        tc.ticketClassName,
        tc.ticketClassPrice,
        os.orderStatusName,
        ml.mealName,
        ml.mealsPrice
      FROM bookingrecord br
      LEFT JOIN showing s ON br.showingID = s.showingID
      LEFT JOIN movie m ON s.movieID = m.movieID
      LEFT JOIN theater t ON s.theaterID = t.theaterID
      LEFT JOIN cinema c ON t.cinemaID = c.cinemaID
      LEFT JOIN ticketclass tc ON br.ticketTypeID = tc.ticketClassID
      LEFT JOIN orderstatus os ON br.orderStateID = os.orderStatusID
      LEFT JOIN meals ml ON br.mealsID = ml.mealsID
      WHERE br.memberID = ?
      ORDER BY br.bookingTime DESC
    `;
    
    const bookings = await db.query(query, [req.params.memberID]);
    
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
    
    // 退票時需要釋放座位並刪除相關記錄
    const showingID = booking[0].showingID;
    const seatNumber = booking[0].seatNumber;
    
    console.log(`退票: 釋放座位 ${showingID}-${seatNumber}`);
    
    // 1. 更新座位狀態為可用 (0)
    await db.update('seat', 
      { seatState: 0 },
      { showingID: showingID, seatNumber: seatNumber }
    );
    
    // 2. 刪除訂票記錄（ticketID 包含在 bookingrecord 中）
    await db.delete('bookingrecord', { orderID: req.params.id });
    
    res.json({ 
      success: true,
      message: '取消訂票成功，座位已釋放' 
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

// 輔助函數 (請確保在您的專案中這些函數可以被正確使用)
function generateOrderID() {
    return 'O' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
}

function generateTicketID() {
    return 'T' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
}

const DEFAULT_MEALS_ID = null; // 假設無餐點的預設值

// ----------------------------------------------------
// API: 完整訂票流程 (POST /api/bookings/create)
// ----------------------------------------------------
router.post('/create', async (req, res) => {
    const db = req.app.locals.db;
    const { 
        memberID, showingID, seatNumbers, ticketTypeID, unitPrice, 
        paymentMethod, mealsID, cardNumber, securityCode, expirationDate 
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
        return res.status(400).json({ success: false, error: '付款方式錯誤，請選擇 balance (儲值卡) 或 creditcard (信用卡)' });
    }

    const totalAmount = unitPrice * seatNumbers.length;
    const bookingTime = new Date().toISOString(); // 用於 bookingTime 欄位

    try {
        await db.beginTransaction();
        
        // --- 2. 檢查座位狀態 ---
        const placeholders = seatNumbers.map(() => '?').join(',');
        const seatCheckQuery = `
            SELECT seatNumber, seatState 
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
        
        // --- 3. 檢查餘額/執行扣款或授權 ---
        let finalBalance = null;
        const [member] = await db.findAll('member', { memberID: memberID });
        if (!member) {
            throw new Error('會員 ID 不存在。');
        }

        if (paymentMethod === 'balance') {
            // 餘額扣款邏輯 (儲值卡)
            if (member.memberBalance < totalAmount) {
                throw new Error(`餘額不足。所需金額: ${totalAmount}, 當前餘額: ${member.memberBalance}`);
            }
            finalBalance = member.memberBalance - totalAmount;
            await db.update('member', { memberBalance: finalBalance }, { memberID: memberID });
            
        } else if (paymentMethod === 'creditcard') {
            // 信用卡授權模擬
            const authSuccess = Math.random() > 0.1; // 模擬 90% 成功率
            if (false) {
                throw new Error('信用卡授權失敗，請檢查卡片資訊或更換付款方式。');
            }
            finalBalance = member.memberBalance; // 信用卡付款，餘額不變
        }

        // --- 4. 建立訂票記錄 (bookingrecord) & 5. 更新座位狀態 ---
        orderID = generateOrderID(); // 生成本次交易的唯一 ID

        const bookingRecords = seatNumbers.map((seatNumber) => ({
            orderID: orderID,
            ticketID: generateTicketID(), // 生成每張票券的唯一 ID
            memberID: memberID, 
            showingID: showingID,
            orderStateID: 'S00001',       // 假設 S00001 = 訂單成立
            mealsID: mealsID || DEFAULT_MEALS_ID,    
            ticketTypeID: ticketTypeID,
            bookingTime: bookingTime,     // 寫入訂單時間
            seatNumber: seatNumber,       // 寫入座位號碼 (符合您的 DB 結構)
            paymentMethod: paymentMethod  // 寫入付款方式 (符合您的 DB 結構)
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

        // 6. 交易提交
        await db.commit();

        res.status(201).json({ 
            success: true, 
            message: `訂票成功，已透過 ${paymentMethod} 完成付款與訂單建立`,
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