// routes/admin.js - 管理員相關API
const express = require('express');
const router = express.Router();

// 管理員登入
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    
    if (!account || !password) {
      return res.status(400).json({ error: '請提供帳號和密碼' });
    }

    // 帳號密碼長度驗證 (最大 50 字元)
    if (account.length > 50 || password.length > 50) {
      return res.status(400).json({ 
        error: '帳號或密碼長度不可超過 50 字元' 
      });
    }

    const db = req.app.locals.db;
    const admins = await db.findAll('supervisor', { 
      supervisorAccount: account,
      supervisorPwd: password 
    });

    if (admins.length === 0) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    res.json({ 
      message: '登入成功',
      admin: { account: admins[0].supervisorAccount }
    });
  } catch (error) {
    res.status(500).json({ error: '登入失敗', details: error.message });
  }
});

// 新增管理員帳號
router.post('/create', async (req, res) => {
  try {
    const { supervisorAccount, supervisorPwd } = req.body;
    
    // 輸入驗證
    if (!supervisorAccount || !supervisorPwd) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整管理員資訊' 
      });
    }
    
    // 帳號密碼長度驗證 (最大 50 字元)
    if (supervisorAccount.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '管理員帳號長度不可超過 50 字元' 
      });
    }
    
    if (supervisorPwd.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '管理員密碼長度不可超過 50 字元' 
      });
    }
    
    const db = req.app.locals.db;
    
    // 檢查帳號是否已存在
    const existingAdmins = await db.findAll('supervisor', { 
      supervisorAccount: supervisorAccount 
    });

    if (existingAdmins.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: '此管理員帳號已存在' 
      });
    }
    
    await db.insert('supervisor', req.body);
    res.status(201).json({ 
      success: true,
      message: '新增管理員成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '新增管理員失敗', 
      details: error.message 
    });
  }
});

// 查詢所有管理員 (隱藏密碼)
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const supervisors = await db.findAll('supervisor');
    
    // 隱藏密碼欄位
    const safeSupervisors = supervisors.map(supervisor => {
      const { supervisorPwd, ...safeSupervisor } = supervisor;
      return safeSupervisor;
    });
    
    res.json(safeSupervisors);
  } catch (error) {
    res.status(500).json({ error: '查詢管理員失敗', details: error.message });
  }
});

module.exports = router;