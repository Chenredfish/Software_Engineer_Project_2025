// routes/admin.js - 管理員相關API
const express = require('express');
const router = express.Router();

// 管理員認證中間件
function requireAdminAuth(req, res, next) {
  const adminToken = req.headers.authorization || req.body.adminToken;
  
  if (!adminToken) {
    return res.status(401).json({ 
      success: false,
      error: '需要管理員權限才能使用此功能' 
    });
  }

  // 簡易 admin token 格式驗證 (admin_account_timestamp)
  if (!adminToken.startsWith('admin_')) {
    return res.status(401).json({ 
      success: false,
      error: '無效的管理員登入狀態' 
    });
  }

  // 提取管理員帳號
  const tokenParts = adminToken.split('_');
  if (tokenParts.length !== 3) {
    return res.status(401).json({ 
      success: false,
      error: '無效的管理員登入狀態格式' 
    });
  }

  req.adminAccount = tokenParts[1];
  next();
}

// 管理員登入
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    
    if (!account || !password) {
      return res.status(400).json({ 
        success: false,
        error: '請提供帳號和密碼' 
      });
    }

    // 帳號密碼長度驗證 (最大 50 字元)
    if (account.length > 50 || password.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '帳號或密碼長度不可超過 50 字元' 
      });
    }

    const db = req.app.locals.db;
    const admins = await db.findAll('supervisor', { 
      supervisorAccount: account,
      supervisorPwd: password 
    });

    if (admins.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: '帳號或密碼錯誤' 
      });
    }

    res.json({ 
      success: true,
      message: '管理員登入成功',
      admin: { account: admins[0].supervisorAccount },
      adminToken: `admin_${admins[0].supervisorAccount}_${Date.now()}`, // 管理員 session token
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

// ========================================
// 管理員專用資料查看 API (需要管理員權限)
// ========================================

// 管理員查看所有會員 (包含密碼)
router.get('/members', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const members = await db.findAll('member');
    
    res.json({
      success: true,
      message: '管理員查看會員資料',
      count: members.length,
      members: members,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢會員資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有電影
router.get('/movies', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movies = await db.findAll('movie');
    
    res.json({
      success: true,
      message: '管理員查看電影資料',
      count: movies.length,
      movies: movies,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢電影資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有影城
router.get('/cinemas', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const cinemas = await db.findAll('cinema');
    
    res.json({
      success: true,
      message: '管理員查看影城資料',
      count: cinemas.length,
      cinemas: cinemas,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢影城資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有場次
router.get('/showings', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const showings = await db.findAll('showing');
    
    res.json({
      success: true,
      message: '管理員查看場次資料',
      count: showings.length,
      showings: showings,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢場次資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有訂票記錄
router.get('/bookings', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const bookings = await db.findAll('bookingrecord');
    
    res.json({
      success: true,
      message: '管理員查看訂票記錄',
      count: bookings.length,
      bookings: bookings,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢訂票記錄失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有餐點
router.get('/meals', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const meals = await db.findAll('meals');
    
    res.json({
      success: true,
      message: '管理員查看餐點資料',
      count: meals.length,
      meals: meals,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢餐點資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有票種
router.get('/ticketclasses', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ticketclasses = await db.findAll('ticketclass');
    
    res.json({
      success: true,
      message: '管理員查看票種資料',
      count: ticketclasses.length,
      ticketclasses: ticketclasses,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢票種資料失敗', 
      details: error.message 
    });
  }
});

// 管理員系統概覽
router.get('/dashboard', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // 獲取各表格統計資料
    const stats = {};
    const tables = [
      'member', 'movie', 'cinema', 'showing', 'bookingrecord', 
      'meals', 'ticketclass', 'supervisor', 'orderstatus', 
      'version', 'rated', 'theater', 'seat', 'movielist', 
      'password_reset_tokens'
    ];
    
    for (const table of tables) {
      try {
        const data = await db.findAll(table);
        stats[table] = {
          count: data.length,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        stats[table] = {
          count: 0,
          error: error.message
        };
      }
    }
    
    res.json({
      success: true,
      message: '管理員系統概覽',
      admin: req.adminAccount,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '獲取系統概覽失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有管理員 (包含密碼)
router.get('/supervisors', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const supervisors = await db.findAll('supervisor');
    
    res.json({
      success: true,
      message: '管理員查看管理員資料',
      count: supervisors.length,
      supervisors: supervisors,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢管理員資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有訂單狀態
router.get('/orderstatus', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const orderstatus = await db.findAll('orderstatus');
    
    res.json({
      success: true,
      message: '管理員查看訂單狀態資料',
      count: orderstatus.length,
      orderstatus: orderstatus,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢訂單狀態資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有電影版本
router.get('/versions', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const versions = await db.findAll('version');
    
    res.json({
      success: true,
      message: '管理員查看電影版本資料',
      count: versions.length,
      versions: versions,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢電影版本資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有電影分級
router.get('/rated', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const rated = await db.findAll('rated');
    
    res.json({
      success: true,
      message: '管理員查看電影分級資料',
      count: rated.length,
      rated: rated,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢電影分級資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有影廳
router.get('/theaters', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const theaters = await db.findAll('theater');
    
    res.json({
      success: true,
      message: '管理員查看影廳資料',
      count: theaters.length,
      theaters: theaters,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢影廳資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有座位
router.get('/seats', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const seats = await db.findAll('seat');
    
    res.json({
      success: true,
      message: '管理員查看座位資料',
      count: seats.length,
      seats: seats,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢座位資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看所有影城電影列表
router.get('/movielist', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const movielist = await db.findAll('movielist');
    
    res.json({
      success: true,
      message: '管理員查看影城電影列表資料',
      count: movielist.length,
      movielist: movielist,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢影城電影列表資料失敗', 
      details: error.message 
    });
  }
});

// 管理員查看密碼重設權杖 (調試用)
router.get('/password-reset-tokens', requireAdminAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const tokens = await db.findAll('password_reset_tokens');
    
    res.json({
      success: true,
      message: '管理員查看密碼重設權杖',
      count: tokens.length,
      tokens: tokens,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: '查詢密碼重設權杖失敗', 
      details: error.message 
    });
  }
});

// 管理員登出
router.post('/logout', requireAdminAuth, async (req, res) => {
  try {
    // 這裡可以將 admin token 加入黑名單
    res.json({ 
      success: true,
      message: '管理員登出成功',
      admin: req.adminAccount,
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

// ========================================
// 管理員通用 CRUD 操作 (高權限)
// ========================================

// 通用新增資料 - POST /api/admin/create/:table
router.post('/create/:table', requireAdminAuth, async (req, res) => {
  try {
    const tableName = req.params.table;
    const data = req.body;
    
    // 驗證資料不能為空
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        error: '請提供要新增的資料'
      });
    }
    
    const db = req.app.locals.db;
    await db.insert(tableName, data);
    
    res.json({
      success: true,
      message: `成功在 ${tableName} 表格新增資料`,
      table: tableName,
      data: data,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `新增 ${req.params.table} 資料失敗`,
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// 通用修改資料 - PUT /api/admin/update/:table
router.put('/update/:table', requireAdminAuth, async (req, res) => {
  try {
    const tableName = req.params.table;
    const { conditions, data } = req.body;
    
    // 驗證必要參數
    if (!conditions || Object.keys(conditions).length === 0) {
      return res.status(400).json({
        success: false,
        error: '請提供更新條件 (conditions)'
      });
    }
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        error: '請提供要更新的資料 (data)'
      });
    }
    
    const db = req.app.locals.db;
    await db.update(tableName, conditions, data);
    
    res.json({
      success: true,
      message: `成功更新 ${tableName} 表格資料`,
      table: tableName,
      conditions: conditions,
      data: data,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `更新 ${req.params.table} 資料失敗`,
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// 通用刪除資料 - DELETE /api/admin/delete/:table
router.delete('/delete/:table', requireAdminAuth, async (req, res) => {
  try {
    const tableName = req.params.table;
    const conditions = req.body;
    
    // 驗證刪除條件
    if (!conditions || Object.keys(conditions).length === 0) {
      return res.status(400).json({
        success: false,
        error: '請提供刪除條件以避免誤刪所有資料'
      });
    }
    
    const db = req.app.locals.db;
    
    // 先查詢要刪除的資料（用於記錄）
    const toDelete = await db.findAll(tableName, conditions);
    
    // 執行刪除
    await db.delete(tableName, conditions);
    
    res.json({
      success: true,
      message: `成功從 ${tableName} 表格刪除 ${toDelete.length} 筆資料`,
      table: tableName,
      conditions: conditions,
      deletedCount: toDelete.length,
      deletedData: toDelete,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `刪除 ${req.params.table} 資料失敗`,
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// 批量操作 - POST /api/admin/batch
router.post('/batch', requireAdminAuth, async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({
        success: false,
        error: '請提供操作陣列 (operations)'
      });
    }
    
    const db = req.app.locals.db;
    const results = [];
    
    for (const op of operations) {
      try {
        const { type, table, data, conditions } = op;
        let result;
        
        switch (type) {
          case 'create':
            await db.insert(table, data);
            result = { type: 'create', table, success: true };
            break;
            
          case 'update':
            await db.update(table, conditions, data);
            result = { type: 'update', table, success: true };
            break;
            
          case 'delete':
            await db.delete(table, conditions);
            result = { type: 'delete', table, success: true };
            break;
            
          default:
            result = { type, table, success: false, error: '不支援的操作類型' };
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          type: op.type,
          table: op.table,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      message: `批量操作完成，執行了 ${operations.length} 個操作`,
      results: results,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '批量操作失敗',
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// CRUD 操作 API
// 新增資料到指定表格
router.post('/create/:table', requireAdminAuth, async (req, res) => {
  try {
    const { table } = req.params;
    const data = req.body;
    const db = req.app.locals.db;

    // 驗證表格名稱
    const allowedTables = ['member', 'movie', 'cinema', 'showing', 'bookingrecord', 
                          'meals', 'ticketclass', 'supervisor', 'orderstatus', 
                          'version', 'rated', 'theater', 'seat', 'movielist'];
    
    if (!allowedTables.includes(table)) {
      return res.status(400).json({
        success: false,
        error: '無效的表格名稱'
      });
    }

    // 執行新增操作
    const result = await db.create(table, data);
    
    res.json({
      success: true,
      message: `成功新增資料到 ${table}`,
      data: result,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '新增資料失敗',
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// 修改指定表格的資料
router.put('/update/:table', requireAdminAuth, async (req, res) => {
  try {
    const { table } = req.params;
    const { conditions, data } = req.body;
    const db = req.app.locals.db;

    // 驗證表格名稱
    const allowedTables = ['member', 'movie', 'cinema', 'showing', 'bookingrecord', 
                          'meals', 'ticketclass', 'supervisor', 'orderstatus', 
                          'version', 'rated', 'theater', 'seat', 'movielist'];
    
    if (!allowedTables.includes(table)) {
      return res.status(400).json({
        success: false,
        error: '無效的表格名稱'
      });
    }

    // 執行修改操作
    const result = await db.update(table, data, conditions);
    
    res.json({
      success: true,
      message: `成功修改 ${table} 資料`,
      changes: result.changes,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '修改資料失敗',
      details: error.message,
      admin: req.adminAccount
    });
  }
});

// 刪除指定表格的資料
router.delete('/delete/:table', requireAdminAuth, async (req, res) => {
  try {
    const { table } = req.params;
    const conditions = req.body;
    const db = req.app.locals.db;

    // 驗證表格名稱
    const allowedTables = ['member', 'movie', 'cinema', 'showing', 'bookingrecord', 
                          'meals', 'ticketclass', 'supervisor', 'orderstatus', 
                          'version', 'rated', 'theater', 'seat', 'movielist'];
    
    if (!allowedTables.includes(table)) {
      return res.status(400).json({
        success: false,
        error: '無效的表格名稱'
      });
    }

    // 執行刪除操作
    const result = await db.delete(table, conditions);
    
    res.json({
      success: true,
      message: `成功刪除 ${table} 資料`,
      changes: result.changes,
      admin: req.adminAccount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '刪除資料失敗',
      details: error.message,
      admin: req.adminAccount
    });
  }
});

module.exports = router;