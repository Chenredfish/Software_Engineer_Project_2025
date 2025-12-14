// routes/auth.js - 會員認證相關API
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendEmail } = require('../emailConfig');

// 簡易 session 驗證中間件
function requireAuth(req, res, next) {
  const sessionToken = req.headers.authorization || req.body.sessionToken;
  
  if (!sessionToken) {
    return res.status(401).json({ 
      success: false,
      error: '需要登入才能使用此功能' 
    });
  }

  // 簡易 token 格式驗證 (session_memberID_timestamp)
  if (!sessionToken.startsWith('session_')) {
    return res.status(401).json({ 
      success: false,
      error: '無效的登入狀態' 
    });
  }

  // 提取 memberID (實際應用應使用 JWT 等安全機制)
  const tokenParts = sessionToken.split('_');
  if (tokenParts.length !== 3) {
    return res.status(401).json({ 
      success: false,
      error: '無效的登入狀態格式' 
    });
  }

  req.memberID = tokenParts[1];
  next();
}

// 會員登入
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    
    if (!account || !password) {
      return res.status(400).json({ 
        success: false,
        error: '請提供帳號和密碼' 
      });
    }

    // 帳號長度驗證 (最大 50 字元)
    if (account.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '帳號長度不可超過 50 字元' 
      });
    }

    // 密碼長度驗證 (最大 50 字元)
    if (password.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '密碼長度不可超過 50 字元' 
      });
    }

    // 查詢會員帳號
    const db = req.app.locals.db;
    const members = await db.findAll('member', { 
      memberAccount: account 
    });

    if (members.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: '帳號不存在' 
      });
    }

    const member = members[0];

    // 驗證密碼 (目前使用明文比對，實際應用建議使用 bcrypt)
    if (member.memberPwd !== password) {
      return res.status(401).json({ 
        success: false,
        error: '密碼錯誤' 
      });
    }

    // 登入成功，隱藏敏感資訊
    const { memberPwd, ...safeProfile } = member;
    
    res.json({ 
      success: true,
      message: '登入成功',
      member: safeProfile,
      sessionToken: `session_${member.memberID}_${Date.now()}`, // 簡易 session token
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '登入失敗', 
      details: error.message 
    });
  }
});

// 會員註冊 (支援身分證字號作為主鍵)
router.post('/register', async (req, res) => {
  try {
    const { 
      memberID,        // 身分證字號 (主鍵)
      memberAccount, 
      memberPwd, 
      memberName, 
      memberBirth, 
      memberPhone 
    } = req.body;
    
    // 基本資料驗證
    if (!memberID || !memberAccount || !memberPwd || !memberName || !memberBirth || !memberPhone) {
      return res.status(400).json({ 
        success: false,
        error: '請填寫完整註冊資訊（包含身分證字號）' 
      });
    }
    
    // 身分證字號格式驗證 (台灣身分證 10 字元)
    const idRegex = /^[A-Z][12]\d{8}$/;
    if (!idRegex.test(memberID) || memberID.length !== 10) {
      return res.status(400).json({ 
        success: false,
        error: '身分證字號格式錯誤，請輸入正確的台灣身分證字號格式' 
      });
    }
    
    // 會員帳號長度驗證 (最大 50 字元，無最小限制)
    if (memberAccount.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '會員帳號長度不可超過 50 字元' 
      });
    }

    // 會員密碼長度驗證 (最大 50 字元)
    if (memberPwd.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '會員密碼長度不可超過 50 字元' 
      });
    }

    // 會員姓名長度驗證 (最大 10 字元)
    if (memberName.length > 10) {
      return res.status(400).json({ 
        success: false,
        error: '會員姓名長度不可超過 10 字元' 
      });
    }

    // 電話號碼格式驗證 (台灣電話 10 位數字)
    const phoneRegex = /^09\d{8}$/;
    // 電話號碼長度和格式驗證 (台灣電話 10 位數字)
    if (memberPhone.toString().length !== 10 || !phoneRegex.test(memberPhone)) {
      return res.status(400).json({ 
        success: false,
        error: '電話號碼格式錯誤，需為 10 位數字的台灣電話號碼 (09xxxxxxxx)' 
      });
    }

    // 生日格式驗證 (YYYY-MM-DD)
    const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthRegex.test(memberBirth)) {
      return res.status(400).json({ 
        success: false,
        error: '生日格式錯誤 (需為 YYYY-MM-DD)' 
      });
    }

    const db = req.app.locals.db;
    
    // 檢查身分證字號是否已存在
    const existingIDs = await db.findAll('member', { 
      memberID: memberID 
    });

    if (existingIDs.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: '此身分證字號已被使用' 
      });
    }
    
    // 檢查帳號是否已存在
    const existingAccounts = await db.findAll('member', { 
      memberAccount: memberAccount 
    });

    if (existingAccounts.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: '此帳號已被使用' 
      });
    }

    // 檢查電話是否已被使用
    const existingPhones = await db.findAll('member', { 
      memberPhone: memberPhone 
    });

    if (existingPhones.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: '此電話號碼已被使用' 
      });
    }

    // 使用提供的身分證字號作為主鍵
    // 建立新會員資料
    const newMember = {
      memberID: memberID,
      memberAccount,
      memberPwd, // 實際應用建議使用 bcrypt 加密
      memberName,
      memberBirth,
      memberPhone,
      memberBalance: 0 // 預設餘額為 0
    };

    await db.insert('member', newMember);
    
    // 註冊成功，隱藏密碼
    const { memberPwd: pwd, ...safeProfile } = newMember;
    
    res.status(201).json({ 
      success: true,
      message: '註冊成功',
      member: safeProfile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '註冊失敗', 
      details: error.message 
    });
  }
});

// 會員登出 (需要登入狀態)
router.post('/logout', requireAuth, async (req, res) => {
  try {
    // 這裡可以將 token 加入黑名單 (簡易版本就直接成功)
    res.json({ 
      success: true,
      message: '登出成功',
      memberID: req.memberID,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '登出失敗', 
      details: error.message 
    });
  }
});

// 獲取會員個人資料 (需要登入)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const members = await db.findAll('member', { memberID: req.memberID });
    
    if (members.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: '會員不存在' 
      });
    }

    const { memberPwd, ...safeProfile } = members[0];
    
    res.json({ 
      success: true,
      member: safeProfile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '獲取資料失敗', 
      details: error.message 
    });
  }
});

// 驗證會員帳號是否存在 (用於前端即時驗證)
router.post('/check-account', async (req, res) => {
  try {
    const { account } = req.body;
    
    if (!account) {
      return res.status(400).json({ 
        success: false,
        error: '請提供帳號' 
      });
    }

    const db = req.app.locals.db;
    const members = await db.findAll('member', { 
      memberAccount: account 
    });

    res.json({ 
      success: true,
      exists: members.length > 0,
      available: members.length === 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '帳號檢查失敗', 
      details: error.message 
    });
  }
});

// ----------------------------------------------------
// API 1: 請求重設密碼 (POST /api/auth/forgot-password)
// ----------------------------------------------------
// ----------------------------------------------------
// API 1: 請求重設密碼 (POST /api/auth/forgot-password)
// ----------------------------------------------------
router.post('/forgot-password', async (req, res) => {
    try {
        const { account } = req.body; 
        if (!account) {
             return res.status(400).json({ success: false, error: '請提供會員帳號/郵箱' });
        }

        const db = req.app.locals.db;
        const members = await db.findAll('member', { memberAccount: account });

        if (members.length === 0) {
          // 1. 安全回應
          await new Promise(resolve => setTimeout(resolve, 1000));
          return res.json({ success: true, message: '若帳號存在，重設密碼連結已發送到您的郵箱' });
        }

        const member = members[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = Date.now() + (60 * 60 * 1000); // 1 小時後過期

        // 1. 儲存 Token 到獨立資料表
        await db.insert('password_reset_tokens', {
            token: resetToken,
            memberAccount: member.memberAccount,
            expires: tokenExpires
        });

        // 2. 構建郵件內容
        // 🚨 替換 YOUR_FRONTEND_URL (假設是 http://localhost:8080)
        const resetLink = `http://localhost:8080/reset-password?token=${resetToken}`; 
        
        const emailContent = `
            <h2>密碼重設請求</h2>
            <p>請點擊以下連結重設您的密碼。此連結將於 1 小時後失效：</p>
            <p><a href="${resetLink}">重設密碼連結</a></p>
        `;

        // 3. 發送郵件
        const mailSent = await sendEmail(
            member.memberAccount, 
            '電影訂票系統 - 密碼重設通知',
            emailContent
        );

        res.json({ 
            success: true, 
            message: mailSent 
                ? '重設密碼連結已發送到您的郵箱，請檢查收件箱。' 
                : 'Token 已生成，但郵件發送失敗，請聯繫客服。' ,
            resetToken: resetToken
        });

    } catch (error) {
        res.status(500).json({ success: false, error: '請求重設密碼失敗', details: error.message });
    }
});


// ----------------------------------------------------
// API 2: 執行重設密碼 (PUT /api/auth/password-reset)
// ----------------------------------------------------
// ----------------------------------------------------
// API 2: 執行重設密碼 (PUT /api/auth/password-reset)
// ----------------------------------------------------
router.put('/password-reset', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        if (!resetToken || !newPassword) {
             return res.status(400).json({ success: false, error: '請提供權杖和新密碼' });
        }

        const db = req.app.locals.db;
        
        // 1. 從獨立資料表查詢權杖
        const tokens = await db.findAll('password_reset_tokens', { token: resetToken });
        
        if (tokens.length === 0) {
            return res.status(400).json({ success: false, error: '無效或已使用的重設密碼權杖' });
        }

        const tokenRecord = tokens[0];
        
        // 2. 檢查權杖是否過期
        if (tokenRecord.expires < Date.now()) {
            await db.delete('password_reset_tokens', { token: resetToken });
            return res.status(400).json({ success: false, error: '重設密碼權杖已過期，請重新發起請求' });
        }
        
        // 3. 執行密碼更新 (查詢會員ID)
        const memberAccountToUpdate = tokenRecord.memberAccount;
        
        // 🚨 注意：這裡假設 memberAccount 是唯一的，直接用它來更新密碼
        await db.update('member', 
            { memberPwd: newPassword }, 
            { memberAccount: memberAccountToUpdate }
        );
        
        // 4. 清除已使用的權杖 (重要：防止二次使用)
        await db.delete('password_reset_tokens', { token: resetToken });

        res.json({ success: true, message: '密碼重設成功，請使用新密碼登入' });
    } catch (error) {
        res.status(500).json({ success: false, error: '重設密碼失敗', details: error.message });
    }
});

// 導出路由器和中間件
module.exports = { router, requireAuth };