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
    const { seatState } = req.body;
    
    // 座位狀態驗證 (布林值: 0 或 1)
    if (seatState !== 0 && seatState !== 1) {
      return res.status(400).json({ 
        success: false,
        error: '座位狀態必須為 0 (空位) 或 1 (已佔用)' 
      });
    }
    
    const db = req.app.locals.db;
    await db.update('seat', 
      { 
        showingID: req.params.showingID, 
        seatNumber: req.params.seatNumber 
      }, 
      { seatState }
    );
    
    res.json({ 
      success: true,
      message: '更新座位狀態成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '更新座位狀態失敗', 
      details: error.message 
    });
  }
});

module.exports = router;