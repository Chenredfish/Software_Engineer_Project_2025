// routes/booking.js - 訂票相關API
const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

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

module.exports = router;