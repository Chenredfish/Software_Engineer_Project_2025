// routes/cinema.js - 影城相關API
const express = require('express');
const router = express.Router();

// 查詢所有影城
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const cinemas = await db.findAll('cinema');
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ error: '查詢影城失敗', details: error.message });
  }
});

// 查詢單一影城
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const cinema = await db.findAll('cinema', { cinemaID: req.params.id });
    if (cinema.length === 0) {
      return res.status(404).json({ error: '找不到指定影城' });
    }
    res.json(cinema[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢影城失敗', details: error.message });
  }
});

// 新增影城 (符合資料格式規格)
router.post('/', async (req, res) => {
  try {
    const { cinemaID, cinemaAddress, cinemaName, cinemaPhoneNumber, cinemaBusinessTime, cinemaPhoto } = req.body;
    
    // 輸入驗證
    if (!cinemaID || !cinemaAddress || !cinemaName || !cinemaPhoneNumber || !cinemaBusinessTime) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整影城資訊' 
      });
    }
    
    // 影城 ID 長度驗證 (6 字元)
    if (cinemaID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '影城 ID 必須為 6 字元' 
      });
    }
    
    // 地址長度驗證 (最大 50 字元)
    if (cinemaAddress.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '影城地址長度不可超過 50 字元' 
      });
    }
    
    // 影城名稱長度驗證 (最大 50 字元)
    if (cinemaName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '影城名稱長度不可超過 50 字元' 
      });
    }
    
    // 影城電話驗證 (台灣電話 10 位數字)
    if (cinemaPhoneNumber.toString().length !== 10) {
      return res.status(400).json({ 
        success: false,
        error: '影城電話必須為 10 位數字' 
      });
    }
    
    // 營業時間長度驗證 (最大 100 字元)
    if (cinemaBusinessTime.length > 100) {
      return res.status(400).json({ 
        success: false,
        error: '營業時間描述長度不可超過 100 字元' 
      });
    }
    
    // 影城圖片路徑驗證 (最大 50 字元)
    if (cinemaPhoto && cinemaPhoto.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '影城圖片路徑長度不可超過 50 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('cinema', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增影城成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增影城失敗', 
      details: error.message 
    });
  }
});

// 更新影城
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.update('cinema', { cinemaID: req.params.id }, req.body);
    res.json({ message: '更新影城成功' });
  } catch (error) {
    res.status(500).json({ error: '更新影城失敗', details: error.message });
  }
});

// 刪除影城
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.delete('cinema', { cinemaID: req.params.id });
    res.json({ message: '刪除影城成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除影城失敗', details: error.message });
  }
});

module.exports = router;