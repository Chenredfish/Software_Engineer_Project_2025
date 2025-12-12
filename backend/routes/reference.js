// routes/reference.js - 參考資料相關API (餐點、票種、分級等)
const express = require('express');
const router = express.Router();

// 電影分級 API
router.get('/rated', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rated = await db.findAll('rated');
    res.json(rated);
  } catch (error) {
    res.status(500).json({ error: '查詢電影分級失敗', details: error.message });
  }
});

router.post('/rated', async (req, res) => {
  try {
    const { ratedID, rateName } = req.body;
    
    // 輸入驗證
    if (!ratedID || !rateName) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整分級資訊' 
      });
    }
    
    // 分級 ID 長度驗證 (6 字元)
    if (ratedID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '分級 ID 必須為 6 字元' 
      });
    }
    
    // 分級名稱長度驗證 (最大 50 字元)
    if (rateName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '分級名稱長度不可超過 50 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('rated', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增分級成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增分級失敗', 
      details: error.message 
    });
  }
});

// 電影版本 API
router.get('/versions', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const versions = await db.findAll('version');
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: '查詢電影版本失敗', details: error.message });
  }
});

router.post('/versions', async (req, res) => {
  try {
    const { versionID, versionName } = req.body;
    
    // 輸入驗證
    if (!versionID || !versionName) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整版本資訊' 
      });
    }
    
    // 版本 ID 長度驗證 (6 字元)
    if (versionID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '版本 ID 必須為 6 字元' 
      });
    }
    
    // 版本名稱長度驗證 (最大 50 字元)
    if (versionName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '版本名稱長度不可超過 50 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('version', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增版本成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增版本失敗', 
      details: error.message 
    });
  }
});

// 餐點 API
router.get('/meals', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const meals = await db.findAll('meals');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: '查詢餐點失敗', details: error.message });
  }
});

// 餐點管理 API (符合資料格式規格)
router.post('/meals', async (req, res) => {
  try {
    const { mealsID, mealName, mealsPrice, mealsDisp, mealsPhoto } = req.body;
    
    // 輸入驗證
    if (!mealsID || !mealName || mealsPrice === undefined || !mealsDisp) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整餐點資訊' 
      });
    }
    
    // 餐點 ID 長度驗證 (6 字元)
    if (mealsID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '餐點 ID 必須為 6 字元' 
      });
    }
    
    // 餐點名稱長度驗證 (最大 10 字元)
    if (mealName.length > 10) {
      return res.status(400).json({ 
        success: false,
        error: '餐點名稱長度不可超過 10 字元' 
      });
    }
    
    // 金額驗證 (不可超過 100 萬)
    if (mealsPrice < 0 || mealsPrice > 1000000) {
      return res.status(400).json({ 
        success: false,
        error: '餐點金額必須在 0-1000000 之間' 
      });
    }
    
    // 餐點描述長度驗證 (最大 2000 字元)
    if (mealsDisp.length > 2000) {
      return res.status(400).json({ 
        success: false,
        error: '餐點描述長度不可超過 2000 字元' 
      });
    }
    
    // 餐點圖片路徑驗證 (最大 100 字元)
    if (mealsPhoto && mealsPhoto.length > 100) {
      return res.status(400).json({ 
        success: false,
        error: '餐點圖片路徑長度不可超過 100 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('meals', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增餐點成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增餐點失敗', 
      details: error.message 
    });
  }
});

// 票種 API
router.get('/ticketclasses', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ticketclasses = await db.findAll('ticketclass');
    res.json(ticketclasses);
  } catch (error) {
    res.status(500).json({ error: '查詢票種失敗', details: error.message });
  }
});

// 票種管理 API (符合資料格式規格)
router.post('/ticketclasses', async (req, res) => {
  try {
    const { ticketClassID, ticketClassName, ticketClassPrice, ticketInfo } = req.body;
    
    // 輸入驗證
    if (!ticketClassID || !ticketClassName || ticketClassPrice === undefined || !ticketInfo) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整票種資訊' 
      });
    }
    
    // 票種 ID 長度驗證 (6 字元)
    if (ticketClassID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '票種 ID 必須為 6 字元' 
      });
    }
    
    // 票種名稱長度驗證 (最大 50 字元)
    if (ticketClassName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '票種名稱長度不可超過 50 字元' 
      });
    }
    
    // 票種價格驗證 (不可超過 100 萬)
    if (ticketClassPrice < 0 || ticketClassPrice > 1000000) {
      return res.status(400).json({ 
        success: false,
        error: '票種價格必須在 0-1000000 之間' 
      });
    }
    
    // 票種描述長度驗證 (最大 2000 字元)
    if (ticketInfo.length > 2000) {
      return res.status(400).json({ 
        success: false,
        error: '票種描述長度不可超過 2000 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('ticketclass', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增票種成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增票種失敗', 
      details: error.message 
    });
  }
});

// 訂單狀態 API
router.get('/orderstatus', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const orderstatus = await db.findAll('orderstatus');
    res.json(orderstatus);
  } catch (error) {
    res.status(500).json({ error: '查詢訂單狀態失敗', details: error.message });
  }
});

router.post('/orderstatus', async (req, res) => {
  try {
    const { orderStatusID, orderStatusName, orderInfo } = req.body;
    
    // 輸入驗證
    if (!orderStatusID || !orderStatusName || !orderInfo) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整訂單狀態資訊' 
      });
    }
    
    // 訂單狀態 ID 長度驗證 (6 字元)
    if (orderStatusID.length !== 6) {
      return res.status(400).json({ 
        success: false,
        error: '訂單狀態 ID 必須為 6 字元' 
      });
    }
    
    // 訂單狀態名稱長度驗證 (最大 50 字元)
    if (orderStatusName.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '訂單狀態名稱長度不可超過 50 字元' 
      });
    }
    
    // 訂單狀態描述長度驗證 (最大 2000 字元)
    if (orderInfo.length > 2000) {
      return res.status(400).json({ 
        success: false,
        error: '訂單狀態描述長度不可超過 2000 字元' 
      });
    }
    
    const db = req.app.locals.db;
    await db.insert('orderstatus', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增訂單狀態成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增訂單狀態失敗', 
      details: error.message 
    });
  }
});

module.exports = router;