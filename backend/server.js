const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: '威秀影城後端 API 服務運行中 (SQLite 版本)',
    version: '1.0.0',
    database: 'SQLite',
    documentation: '/api'
  });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: '威秀影城後端 API (SQLite 版本)',
    version: '1.0.0',
    database: 'SQLite',
    features: ['無需安裝 MySQL', '檔案型資料庫', '即開即用'],
    endpoints: {
      auth: {
        'POST /api/admin/login': '管理員登入'
      },
      core_tables: {
        'GET|POST|PUT|DELETE /api/cinemas': '影城管理',
        'GET|POST|PUT|DELETE /api/movies': '電影管理', 
        'GET|POST|PUT|DELETE /api/members': '會員管理',
        'GET|POST /api/bookings': '訂票紀錄管理',
        'GET|POST|PUT|DELETE /api/showings': '場次管理',
        'GET|POST /api/theaters': '影廳管理'
      },
      reference_tables: {
        'GET /api/meals': '查詢餐點',
        'GET /api/rated': '查詢電影分級',
        'GET /api/versions': '查詢電影版本',
        'GET /api/ticketclasses': '查詢票種',
        'GET /api/orderstatus': '查詢訂單狀態'
      },
      special_operations: {
        'GET /api/seats/:showingID': '查詢場次座位',
        'PUT /api/seats/:showingID/:seatNumber': '更新座位狀態',
        'GET /api/cinemas/:id/movies': '查詢影城電影',
        'GET /api/movies/:id/showings': '查詢電影場次',
        'GET /api/members/:id/bookings': '查詢會員訂票紀錄'
      }
    }
  });
});

// Test database connection endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT 1 as test, datetime("now") as current_time');
    res.json({ 
      message: 'SQLite 資料庫連接成功', 
      data: result[0],
      database: 'SQLite',
      database_file: 'moviesql.db'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'SQLite 資料庫連接失敗', 
      details: error.message 
    });
  }
});

// 初始化範例資料
app.post('/api/init-sample-data', async (req, res) => {
    try {
        // 完整的範例資料集合 (已補齊所有必要的外鍵表)
        const sampleData = {
            // 基礎參考表 (必須先插入)
            rated: [
                { ratedID: 'R001', rateName: '普遍級' },
                { ratedID: 'R002', rateName: '保護級' }, // 修正 '護眼級' 為 '保護級'，更常用
                { ratedID: 'R003', rateName: '輔導級' },
                { ratedID: 'R004', rateName: '限制級' }
            ],
            version: [
                { versionID: 'V001', versionName: '2D' },
                { versionID: 'V002', versionName: '3D' },
                { versionID: 'V003', versionName: 'IMAX' },
                { versionID: 'V004', versionName: '4DX' }
            ],
            supervisor: [
                { supervisorAccount: 'admin', supervisorPwd: 'admin123' }
            ],
            orderstatus: [ // 新增：訂單狀態 (bookingrecord 依賴)
                { orderStatusID: 'S001', orderStatusName: '已成立待付款' },
                { orderStatusID: 'S002', orderStatusName: '付款成功' },
                { orderStatusID: 'S003', orderStatusName: '已取消/退款' },
            ],
            ticketclass: [ // 新增：票種 (bookingrecord 依賴)
                { ticketClassID: 'TC01', ticketClassName: '全票', ticketClassPrice: 300, ticketInfo: '一般成人票' },
                { ticketClassID: 'TC02', ticketClassName: '學生票', ticketClassPrice: 250, ticketInfo: '需出示學生證' },
            ],
            meals: [ // 新增：餐點 (bookingrecord 依賴)
                { mealsID: 'ML01', mealName: '單人套餐', mealsPrice: 150, mealsDisp: '爆米花+中可樂', mealsPhoto: 'set1.jpg' },
                { mealsID: 'ML02', mealName: '雙人套餐', mealsPrice: 350, mealsDisp: '大爆米花+兩杯大可樂', mealsPhoto: 'set2.jpg' },
            ],
            
            // 影城與影廳 (showing 依賴 cinema, theater)
            cinema: [
                { 
                    cinemaID: 'C001', 
                    cinemaName: '威秀影城板橋大遠百',
                    cinemaAddress: '新北市板橋區縣民大道二段7號',
                    cinemaPhoneNumber: '0233121212',
                    cinemaBusinessTime: '10:00-24:00',
                    cinemaPhoto: 'banqiao.jpg'
                },
                { 
                    cinemaID: 'C002', 
                    cinemaName: '威秀影城台北京站',
                    cinemaAddress: '台北市大同區承德路一段1號',
                    cinemaPhoneNumber: '0225371818',
                    cinemaBusinessTime: '09:30-24:00',
                    cinemaPhoto: 'taipei.jpg'
                }
            ],
            theater: [ // 新增：影廳 (showing 依賴)
                { theaterID: 'T01', theaterName: 'A廳', cinemaID: 'C001' },
                { theaterID: 'T02', theaterName: 'IMAX 廳', cinemaID: 'C001' },
                { theaterID: 'T03', theaterName: 'B廳', cinemaID: 'C002' },
            ],
            
            // 核心業務表
            movie: [ // (showing 依賴)
                {
                    movieID: 'M001',
                    movieName: '阿凡達：水之道',
                    movieTime: '03:12:00',
                    ratedID: 'R002',
                    movieStartDate: '2024-12-15',
                    movieInfo: '詹姆斯·卡麥隆執導的科幻史詩電影',
                    director: '詹姆斯·卡麥隆',
                    actors: '山姆·沃辛頓, 柔伊·莎達娜',
                    moviePhoto: 'avatar2.jpg'
                },
                {
                    movieID: 'M002',
                    movieName: '捍衛戰士：獨行俠',
                    movieTime: '02:11:00',
                    ratedID: 'R003',
                    movieStartDate: '2024-12-20',
                    movieInfo: '湯姆·克魯斯主演的動作片',
                    director: '約瑟夫·科金斯基',
                    actors: '湯姆·克魯斯, 詹妮弗·康納利',
                    moviePhoto: 'topgun.jpg'
                }
            ],
            member: [ // (bookingrecord 依賴)
                { memberID: 'M101', memberAccount: 'user_alpha', memberPwd: 'pass1234', memberName: '王小明', memberBirth: '1990-05-20', memberPhone: '0911222333', memberBalance: 500 },
                { memberID: 'M102', memberAccount: 'user_beta', memberPwd: 'pass5678', memberName: '李佳穎', memberBirth: '1995-12-10', memberPhone: '0988777666', memberBalance: 1000 },
            ],
            
            // 關聯表
            showing: [ // (bookingrecord 依賴)
                // M001 在 C001 的 T02 (IMAX 廳) 播放 3D 版
                { showingID: 'S101', movieID: 'M001', theaterID: 'T02', versionID: 'V002', showingTime: '2025-12-08 18:30:00' }, 
                // M002 在 C001 的 T01 (A廳) 播放 2D 版
                { showingID: 'S102', movieID: 'M002', theaterID: 'T01', versionID: 'V001', showingTime: '2025-12-08 21:00:00' }, 
            ],

            // 訂票紀錄 (修正鍵名為 bookingrecord)
            bookingrecord: [ 
                // M101 成功訂票 S101
                { orderID: 'O1001', ticketID: 'TKT001', memberID: 'M101', showingID: 'S101', orderStateID: 'S002', mealsID: 'ML01', ticketTypeID: 'TC01', bookingTime: '2025-12-07 10:00:00', seatID: 'A05' }, 
                // M102 取消訂票 S102 (不選餐點)
                { orderID: 'O1002', ticketID: 'TKT002', memberID: 'M102', showingID: 'S102', orderStateID: 'S003', mealsID: null, ticketTypeID: 'TC02', bookingTime: '2025-12-07 10:30:00', seatID: 'C12' }, 
            ],
        };

        // 調整插入順序以滿足外鍵要求
        const insertionOrder = [
            'rated', 'version', 'orderstatus', 'ticketclass', 'meals', 'supervisor', 
            'cinema', 'theater', 
            'movie', 'member', 
            'showing', 
            'bookingrecord'
        ];

        let insertCount = 0;
        
        for (const table of insertionOrder) {
            const records = sampleData[table];
            if (!records) continue; 
            
            for (const record of records) {
                try {
                    // 這裡使用 db.insert，因為您的原始代碼使用這個單筆插入迴圈
                    await db.insert(table, record); 
                    insertCount++;
                } catch (error) {
                    // 忽略重複鍵錯誤
                    if (!error.message.includes('UNIQUE constraint failed')) {
                        // 輸出所有非 UNIQUE 錯誤，以供除錯
                        console.error(`❌ 插入 ${table} 資料失敗:`, error.message, record);
                        throw new Error(`初始化資料庫失敗 (${table}): ${error.message}`);
                    }
                }
            }
        }

        res.json({
            message: '範例資料初始化完成 (已修正外鍵依賴和表格名稱)',
            inserted_records: insertCount,
            tables_initialized: Object.keys(sampleData).length
        });

    } catch (error) {
        res.status(500).json({
            error: '初始化範例資料失敗',
            details: error.message
        });
    }
});

// ==================== CORE TABLES API ====================

// Cinema routes
app.get('/api/cinemas', async (req, res) => {
  try {
    const cinemas = await db.findAll('cinema');
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ error: '查詢影城失敗', details: error.message });
  }
});

app.get('/api/cinemas/:id', async (req, res) => {
  try {
    const cinema = await db.findAll('cinema', { cinemaID: req.params.id });
    if (cinema.length === 0) {
      return res.status(404).json({ error: '找不到指定影城' });
    }
    res.json(cinema[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢影城失敗', details: error.message });
  }
});

app.post('/api/cinemas', async (req, res) => {
  try {
    await db.insert('cinema', req.body);
    res.status(201).json({ message: '新增影城成功' });
  } catch (error) {
    res.status(500).json({ error: '新增影城失敗', details: error.message });
  }
});

app.put('/api/cinemas/:id', async (req, res) => {
  try {
    const result = await db.update('cinema', req.body, { cinemaID: req.params.id });
    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到指定影城' });
    }
    res.json({ message: '更新影城成功' });
  } catch (error) {
    res.status(500).json({ error: '更新影城失敗', details: error.message });
  }
});

app.delete('/api/cinemas/:id', async (req, res) => {
  try {
    const result = await db.delete('cinema', { cinemaID: req.params.id });
    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到指定影城' });
    }
    res.json({ message: '刪除影城成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除影城失敗', details: error.message });
  }
});

// Movie routes
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await db.findAll('movie');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: '查詢電影失敗', details: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await db.findAll('movie', { movieID: req.params.id });
    if (movie.length === 0) {
      return res.status(404).json({ error: '找不到指定電影' });
    }
    res.json(movie[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢電影失敗', details: error.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    await db.insert('movie', req.body);
    res.status(201).json({ message: '新增電影成功' });
  } catch (error) {
    res.status(500).json({ error: '新增電影失敗', details: error.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const result = await db.update('movie', req.body, { movieID: req.params.id });
    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到指定電影' });
    }
    res.json({ message: '更新電影成功' });
  } catch (error) {
    res.status(500).json({ error: '更新電影失敗', details: error.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const result = await db.delete('movie', { movieID: req.params.id });
    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到指定電影' });
    }
    res.json({ message: '刪除電影成功' });
  } catch (error) {
    res.status(500).json({ error: '刪除電影失敗', details: error.message });
  }
});

// Member routes
app.get('/api/members', async (req, res) => {
  try {
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

app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await db.findAll('member', { memberID: req.params.id });
    if (member.length === 0) {
      return res.status(404).json({ error: '找不到指定會員' });
    }
    // 隱藏密碼欄位
    const { memberPwd, ...safeMember } = member[0];
    res.json(safeMember);
  } catch (error) {
    res.status(500).json({ error: '查詢會員失敗', details: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    await db.insert('member', req.body);
    res.status(201).json({ message: '新增會員成功' });
  } catch (error) {
    res.status(500).json({ error: '新增會員失敗', details: error.message });
  }
});

// Showing routes
app.get('/api/showings', async (req, res) => {
  try {
    const showings = await db.findAll('showing');
    res.json(showings);
  } catch (error) {
    res.status(500).json({ error: '查詢場次失敗', details: error.message });
  }
});

app.get('/api/showings/:id', async (req, res) => {
  try {
    const showing = await db.findAll('showing', { showingID: req.params.id });
    if (showing.length === 0) {
      return res.status(404).json({ error: '找不到指定場次' });
    }
    res.json(showing[0]);
  } catch (error) {
    res.status(500).json({ error: '查詢場次失敗', details: error.message });
  }
});

app.post('/api/showings', async (req, res) => {
  try {
    await db.insert('showing', req.body);
    res.status(201).json({ message: '新增場次成功' });
  } catch (error) {
    res.status(500).json({ error: '新增場次失敗', details: error.message });
  }
});

// Booking routes
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await db.findAll('bookingrecord');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: '查詢訂票紀錄失敗', details: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    await db.insert('bookingrecord', req.body);
    res.status(201).json({ message: '新增訂票紀錄成功' });
  } catch (error) {
    res.status(500).json({ error: '新增訂票紀錄失敗', details: error.message });
  }
});

// Theater routes
app.get('/api/theaters', async (req, res) => {
  try {
    const theaters = await db.findAll('theater');
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ error: '查詢影廳失敗', details: error.message });
  }
});

app.post('/api/theaters', async (req, res) => {
  try {
    await db.insert('theater', req.body);
    res.status(201).json({ message: '新增影廳成功' });
  } catch (error) {
    res.status(500).json({ error: '新增影廳失敗', details: error.message });
  }
});

// Meals
app.get('/api/meals', async (req, res) => {
  try {
    const meals = await db.findAll('meals');
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: '查詢餐點失敗', details: error.message });
  }
});

// Ticket Classes
app.get('/api/ticketclasses', async (req, res) => {
  try {
    const ticketclasses = await db.findAll('ticketclass');
    res.json(ticketclasses);
  } catch (error) {
    res.status(500).json({ error: '查詢票種失敗', details: error.message });
  }
});

// Order Status
app.get('/api/orderstatus', async (req, res) => {
  try {
    const orderstatus = await db.findAll('orderstatus');
    res.json(orderstatus);
  } catch (error) {
    res.status(500).json({ error: '查詢訂單狀態失敗', details: error.message });
  }
});

// Seat Management
app.get('/api/seats/:showingID', async (req, res) => {
  try {
    const seats = await db.findAll('seat', { showingID: req.params.showingID });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: '查詢座位失敗', details: error.message });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    
    if (!account || !password) {
      return res.status(400).json({ error: '請提供帳號和密碼' });
    }

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

// Reference tables
app.get('/api/rated', async (req, res) => {
  try {
    const rated = await db.findAll('rated');
    res.json(rated);
  } catch (error) {
    res.status(500).json({ error: '查詢分級失敗', details: error.message });
  }
});

app.get('/api/versions', async (req, res) => {
  try {
    const versions = await db.findAll('version');
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: '查詢版本失敗', details: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '伺服器內部錯誤', 
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: '找不到請求的資源', 
    path: req.path,
    method: req.method,
    documentation: '/api'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT} (SQLite 版本)`);
  console.log(`API文件: http://localhost:${PORT}/api`);
  console.log(`資料庫: SQLite (moviesql.db)`);
  console.log(`✨ 特色: 無需 MySQL 服務，即開即用！`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n正在關閉伺服器...');
  await db.close();
  process.exit(0);
});

module.exports = app;