// routes/movie.js - 電影相關API
const express = require('express');
const router = express.Router();

// 查詢所有電影
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movies = await db.findAll('movie');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: '查詢電影失敗', details: error.message });
  }
});

// 查詢單一電影
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movie = await db.findAll('movie', { movieID: req.params.id });
    if (movie.length === 0) {
      return res.status(404).json({ error: '找不到指定電影' });
    }
    res.json(movie[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢電影失敗', details: error.message });
  }
});

// 新增電影 (符合資料格式規格)
router.post('/', async (req, res) => {
  try {
    const { 
      movieID, 
      movieName, 
      movieTime, 
      ratedID, 
      movieStartDate, 
      movieInfo, 
      moviePhoto, 
      director, 
      actors 
    } = req.body;
    
    // 輸入驗證
    if (!movieID || !movieName || !movieTime || !ratedID || !movieStartDate || !movieInfo || !director || !actors) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整電影資訊' 
      });
    }
    
    // 電影 ID 長度驗證 (6 字元)
    if (movieID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '電影 ID 必須為 6 字元' 
      });
    }
    
    // 電影名稱長度驗證 (最大 50 字元)
    if (movieName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '電影名稱長度不可超過 50 字元' 
      });
    }
    
    // 分級 ID 長度驗證 (6 字元)
    if (ratedID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '分級 ID 必須為 6 字元' 
      });
    }
    
    // 電影介紹長度驗證 (最大 2000 字元)
    if (movieInfo.length > 2000) {
      return res.status(400).json({ 
        success: false,
        error: '電影介紹長度不可超過 2000 字元' 
      });
    }
    
    // 電影圖片路徑驗證 (最大 50 字元)
    if (moviePhoto && moviePhoto.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '電影圖片路徑長度不可超過 50 字元' 
      });
    }
    
    // 導演名稱長度驗證 (最大 50 字元)
    if (director.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '導演名稱長度不可超過 50 字元' 
      });
    }
    
    // 主演名稱長度驗證 (最大 1000 字元)
    if (actors.length > 1000) {
      return res.status(400).json({ 
        success: false,
        error: '主演名稱長度不可超過 1000 字元' 
      });
    }
    
    // 上映日期格式驗證 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(movieStartDate)) {
      return res.status(400).json({ 
        success: false,
        error: '上映日期格式錯誤 (需為 YYYY-MM-DD)' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('movie', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增電影成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增電影失敗', 
      details: error.message 
    });
  }
});

// 更新電影
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.update('movie', { movieID: req.params.id }, req.body);
    res.json({ message: '更新電影成功' });
  } catch (error) {
    res.status(500).json({ error: '更新電影失敗', details: error.message });
  }
});

// 刪除電影
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.delete('movie', { movieID: req.params.id });
    res.json({ message: '刪除電影成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除電影失敗', details: error.message });
  }
});

module.exports = router;