// routes/member.js - 會員相關API (不包含認證)
const express = require('express');
const router = express.Router();
const { requireAuth } = require('./auth');

// 查詢所有會員 (隱藏密碼)
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const members = await db.findAll('member');
    // 隱藏密碼欄位
    const safeMembers = members.map(member => {
      const { memberPwd, ...safeMember } = member;
      return safeMember;
    });
    res.json(safeMembers);
  } catch (error) {
    res.status(500).json({ error: '查詢會員失敗', details: error.message });
  }
});

// 查詢所有會員 (測試用，包含密碼) - 僅供開發測試使用
router.get('/debug/with-passwords', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const members = await db.findAll('member');
    // 測試環境：返回完整資料包含密碼
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: '查詢會員失敗', details: error.message });
  }
});

// 查詢單一會員 (需要登入，只能查看自己的資料)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // 只允許查看自己的資料 (除非是管理員)
    if (req.memberID !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        error: '無權限查看此會員資料' 
      });
    }

    const db = req.app.locals.db;
    const member = await db.findAll('member', { memberID: req.params.id });
    if (member.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: '找不到指定會員' 
      });
    }
    
    // 隱藏密碼欄位
    const { memberPwd, ...safeMember } = member[0];
    res.json({
      success: true,
      member: safeMember,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢會員失敗', 
      details: error.message 
    });
  }
});

// 新增會員 (管理員功能)
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.insert('member', req.body);
    res.status(201).json({ message: '新增會員成功' });
  } catch (error) {
    res.status(500).json({ error: '新增會員失敗', details: error.message });
  }
});

// 更新會員資料 (需要登入，只能修改自己的資料)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    // 只允許修改自己的資料 (除非是管理員)
    if (req.memberID !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        error: '無權限修改此會員資料' 
      });
    }

    const db = req.app.locals.db;
    
    // 不允許直接修改 memberID 和 memberBalance
    const { memberID, memberBalance, ...updateData } = req.body;
    
    await db.update('member', updateData, { memberID: req.params.id });//聽說換順序就可以更新資料庫了， 軒
    res.json({ 
      success: true,
      message: '更新會員資料成功' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '更新會員資料失敗', 
      details: error.message 
    });
  }
});

// 會員儲值 (需要登入)
router.post('/:id/topup', requireAuth, async (req, res) => {
  try {
    // 只允許為自己儲值 (除非是管理員)
    if (req.memberID !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        error: '無權限為此會員儲值' 
      });
    }

    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: '儲值金額必須大於 0' 
      });
    }
    
    // 儲值金額不可超過 100 萬 (單筆)
    if (amount > 1000000) {
      return res.status(400).json({ 
        success: false,
        error: '單筆儲值金額不可超過 1,000,000 元' 
      });
    }

    const db = req.app.locals.db;
    
    // 查詢現有餘額
    const members = await db.findAll('member', { memberID: req.params.id });
    if (members.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: '找不到指定會員' 
      });
    }
    
    const currentBalance = members[0].memberBalance || 0;
    const newBalance = currentBalance + amount;
    
    // 餘額上限檢查 (100 萬)
    if (newBalance > 1000000) {
      return res.status(400).json({ 
        success: false,
        error: `儲值後餘額將超過上限 1,000,000 元 (目前餘額: ${currentBalance})` 
      });
    }
    
    // 更新餘額
    await db.update('member', { memberID: req.params.id }, { 
      memberBalance: newBalance 
    });
    
    res.json({ 
      success: true,
      message: '儲值成功',
      previousBalance: currentBalance,
      topupAmount: amount,
      newBalance: newBalance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '儲值失敗', 
      details: error.message 
    });
  }
});

// 刪除會員 (管理員功能)
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    await db.delete('member', { memberID: req.params.id });
    res.json({ message: '刪除會員成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除會員失敗', details: error.message });
  }
});

module.exports = router;