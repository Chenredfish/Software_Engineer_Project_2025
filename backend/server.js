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
        'POST /api/auth/login': '會員登入',
        'POST /api/auth/register': '會員註冊',
        'POST /api/auth/logout': '會員登出 (需登入)',
        'GET /api/auth/profile': '獲取個人資料 (需登入)',
        'POST /api/auth/check-account': '檢查帳號可用性',
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

// 初始化範例資料 (從 DataBase 資料夾轉換)
app.post('/api/init-sample-data', async (req, res) => {
    try {
        // 完整的真實資料集合 (從 MySQL SQL 檔案轉換)
        const sampleData = {
            // 基礎參考表 (必須先插入)
            rated: [
                { ratedID: 'R00001', rateName: '限制級' },
                { ratedID: 'R00002', rateName: '輔導十五歲級' },
                { ratedID: 'R00003', rateName: '保護級' },
                { ratedID: 'R00004', rateName: '普遍級' },
                { ratedID: 'R00005', rateName: '待審級' }
            ],
            version: [
                { versionID: 'V00001', versionName: '2D 數位版' },
                { versionID: 'V00002', versionName: 'IMAX 3D' },
                { versionID: 'V00003', versionName: '4DX 2D' },
                { versionID: 'V00004', versionName: 'Dolby Atmos' },
                { versionID: 'V00005', versionName: '國語發音/中文字幕' }
            ],
            supervisor: [
                { supervisorAccount: 'admin', supervisorPwd: 'admin123' }
            ],
            orderstatus: [
                { orderStatusID: 'S00001', orderStatusName: '訂單成立', orderInfo: '客戶已完成訂票程序' },
                { orderStatusID: 'S00002', orderStatusName: '付款失敗', orderInfo: '訂單尚未完成付款' },
                { orderStatusID: 'S00003', orderStatusName: '已取票', orderInfo: '客戶已在現場取走實體票券' },
                { orderStatusID: 'S00004', orderStatusName: '已取消', orderInfo: '訂單已在規定時間內取消' },
                { orderStatusID: 'S00005', orderStatusName: '待取票', orderInfo: '已付款，等待客戶取票' }
            ],
            ticketclass: [
                { ticketClassID: 'T00001', ticketClassName: '全票', ticketClassPrice: 320, ticketInfo: '成人票價' },
                { ticketClassID: 'T00002', ticketClassName: '學生票', ticketClassPrice: 280, ticketInfo: '學生證購票優惠' },
                { ticketClassID: 'T00003', ticketClassName: '愛心票', ticketClassPrice: 160, ticketInfo: '身心障礙人士專用' },
                { ticketClassID: 'T00004', ticketClassName: '早場票', ticketClassPrice: 250, ticketInfo: '中午 12:00 前場次' },
                { ticketClassID: 'T00005', ticketClassName: '夜貓票', ticketClassPrice: 200, ticketInfo: '午夜 00:00 後場次' }
            ],
            meals: [
                { mealsID: 'M00001', mealName: '爆米花套餐', mealsPrice: 250, mealsDisp: '經典爆米花加兩杯飲料', mealsPhoto: 'Photo/meals/popcorn_set.jpg' },
                { mealsID: 'M00002', mealName: '熱狗堡', mealsPrice: 120, mealsDisp: '美式經典熱狗堡', mealsPhoto: 'Photo/meals/hotdog.jpg' },
                { mealsID: 'M00003', mealName: '吉拿棒', mealsPrice: 80, mealsDisp: '灑滿肉桂粉', mealsPhoto: 'Photo/meals/churros.jpg' },
                { mealsID: 'M00004', mealName: '汽水單杯', mealsPrice: 70, mealsDisp: '可口可樂/雪碧', mealsPhoto: 'Photo/meals/soda.jpg' },
                { mealsID: 'M00005', mealName: '礦泉水', mealsPrice: 50, mealsDisp: '純淨飲用水', mealsPhoto: 'Photo/meals/water.jpg' }
            ],
            
            // 影城與影廳 (showing 依賴 cinema, theater)
            cinema: [
                { 
                    cinemaID: 'C00001', 
                    cinemaName: '台北旗艦影城',
                    cinemaAddress: '台北市信義區忠孝東路 1 號',
                    cinemaPhoneNumber: '0227123456',
                    cinemaBusinessTime: 'Mon-Sun 10:00-02:00',
                    cinemaPhoto: 'Photo/cinima/taipei.jpg'
                },
                { 
                    cinemaID: 'C00002', 
                    cinemaName: '台中數位影城',
                    cinemaAddress: '台中市西屯區逢甲路 2 號',
                    cinemaPhoneNumber: '0423456789',
                    cinemaBusinessTime: 'Mon-Sun 11:00-01:00',
                    cinemaPhoto: 'Photo/cinima/taichung.jpg'
                },
                { 
                    cinemaID: 'C00003', 
                    cinemaName: '高雄港灣影城',
                    cinemaAddress: '高雄市新興區中正路 3 號',
                    cinemaPhoneNumber: '0778901234',
                    cinemaBusinessTime: 'Mon-Sun 09:30-03:00',
                    cinemaPhoto: 'Photo/cinima/kaohsiung.jpg'
                },
                { 
                    cinemaID: 'C00004', 
                    cinemaName: '板橋巨幕影城',
                    cinemaAddress: '新北市板橋區縣民大道',
                    cinemaPhoneNumber: '0229876543',
                    cinemaBusinessTime: 'Mon-Sun 10:30-01:30',
                    cinemaPhoto: 'Photo/cinima/banqiao.jpg'
                },
                { 
                    cinemaID: 'C00005', 
                    cinemaName: '中壢星光影城',
                    cinemaAddress: '桃園市中壢區復興路',
                    cinemaPhoneNumber: '0345678901',
                    cinemaBusinessTime: 'Mon-Sun 10:00-01:00',
                    cinemaPhoto: 'Photo/cinima/zhongli.jpg'
                }
            ],
            theater: [
                { theaterID: 'H00001', theaterName: '巨幕廳 A', cinemaID: 'C00001' },
                { theaterID: 'H00002', theaterName: '標準廳 1', cinemaID: 'C00001' },
                { theaterID: 'H00003', theaterName: '標準廳 2', cinemaID: 'C00002' },
                { theaterID: 'H00004', theaterName: 'VIP 包廂', cinemaID: 'C00003' },
                { theaterID: 'H00005', theaterName: '4D 體驗廳', cinemaID: 'C00004' }
            ],
            
            // 核心業務表
            movie: [
                {
                    movieID: 'D00001',
                    movieName: '阿凡達',
                    movieTime: '02:42:00',
                    ratedID: 'R00003',
                    movieStartDate: '2009-12-18',
                    movieInfo: '一個關於潘朵拉星球與人類衝突的科幻故事。',
                    director: '詹姆斯·卡麥隆',
                    actors: '山姆·沃辛頓, 柔伊·莎達娜',
                    moviePhoto: 'Photo/movie/avatar.jpg'
                },
                {
                    movieID: 'D00002',
                    movieName: '動物方城市',
                    movieTime: '01:48:00',
                    ratedID: 'R00004',
                    movieStartDate: '2016-03-04',
                    movieInfo: '兔子茱蒂與狐狸尼克攜手破案的動畫片。',
                    director: '拜倫·霍華德',
                    actors: '金妮弗·古德溫, 傑森·貝特曼',
                    moviePhoto: 'Photo/movie/zootopia.jpg'
                },
                {
                    movieID: 'D00003',
                    movieName: '出神入化',
                    movieTime: '01:55:00',
                    ratedID: 'R00002',
                    movieStartDate: '2013-05-31',
                    movieInfo: '四騎士利用魔術手法進行銀行劫案。',
                    director: '路易斯·賴托瑞',
                    actors: '傑西·艾森伯格, 馬克·盧法洛',
                    moviePhoto: 'Photo/movie/illusion.jpg'
                },
                {
                    movieID: 'D00004',
                    movieName: '大蟒蛇',
                    movieTime: '01:29:00',
                    ratedID: 'R00001',
                    movieStartDate: '1997-04-11',
                    movieInfo: '一支紀錄片小組在亞馬遜叢林遭遇巨蟒。',
                    director: '路易斯·羅沙',
                    actors: '珍妮弗·洛佩茲, 冰塊酷巴',
                    moviePhoto: 'Photo/movie/anaconda.jpg'
                },
                {
                    movieID: 'D00005',
                    movieName: '魔法壞女巫',
                    movieTime: '02:30:00',
                    ratedID: 'R00003',
                    movieStartDate: '2024-11-27',
                    movieInfo: '綠色皮膚女巫艾芙芭與白膚女巫葛琳達的友誼故事。',
                    director: '朱浩偉',
                    actors: '辛西婭·艾利沃, 亞莉安娜·格蘭德',
                    moviePhoto: 'Photo/movie/wicked.jpg'
                }
            ],
            member: [
                { memberID: 'A123456789', memberAccount: 'user_john', memberPwd: 'hashed_pwd1', memberName: '王大明', memberBirth: '1990-05-15', memberPhone: '0910123456', memberBalance: 5000 },
                { memberID: 'B234567890', memberAccount: 'user_mary', memberPwd: 'hashed_pwd2', memberName: '陳小美', memberBirth: '1985-11-20', memberPhone: '0920234567', memberBalance: 12000 },
                { memberID: 'C345678901', memberAccount: 'user_david', memberPwd: 'hashed_pwd3', memberName: '林志明', memberBirth: '2001-08-01', memberPhone: '0930345678', memberBalance: 800 },
                { memberID: 'D456789012', memberAccount: 'user_lisa', memberPwd: 'hashed_pwd4', memberName: '黃麗莎', memberBirth: '1995-03-25', memberPhone: '0940456789', memberBalance: 3500 },
                { memberID: 'E567890123', memberAccount: 'user_mike', memberPwd: 'hashed_pwd5', memberName: '吳麥克', memberBirth: '1976-01-10', memberPhone: '0950567890', memberBalance: 10000 }
            ],
            
            // 關聯表
            showing: [
                { showingID: 'S00001', movieID: 'D00001', theaterID: 'H00001', versionID: 'V00001', showingTime: '2025-12-05 14:30:00' },
                { showingID: 'S00002', movieID: 'D00002', theaterID: 'H00002', versionID: 'V00003', showingTime: '2025-12-05 18:00:00' },
                { showingID: 'S00003', movieID: 'D00003', theaterID: 'H00003', versionID: 'V00005', showingTime: '2025-12-06 10:00:00' },
                { showingID: 'S00004', movieID: 'D00004', theaterID: 'H00004', versionID: 'V00002', showingTime: '2025-12-06 20:30:00' },
                { showingID: 'S00005', movieID: 'D00001', theaterID: 'H00005', versionID: 'V00004', showingTime: '2025-12-07 16:45:00' }
            ],

            // 訂票紀錄 - 注意：原始資料使用 shwingID 而不是 showingID
            bookingrecord: [
                { orderID: 'O10001', ticketID: 'K1A001', memberID: 'A123456789', showingID: 'S00001', orderStateID: 'S00001', mealsID: 'M00001', ticketTypeID: 'T00001', bookingTime: '2025-12-01 10:30:00', seatID: 'A01' },
                { orderID: 'O10001', ticketID: 'K1A002', memberID: 'A123456789', showingID: 'S00001', orderStateID: 'S00001', mealsID: 'M00004', ticketTypeID: 'T00002', bookingTime: '2025-12-01 10:30:00', seatID: 'A02' },
                { orderID: 'O10002', ticketID: 'K2B001', memberID: 'B234567890', showingID: 'S00002', orderStateID: 'S00005', mealsID: 'M00003', ticketTypeID: 'T00001', bookingTime: '2025-12-02 12:45:00', seatID: 'B05' },
                { orderID: 'O10003', ticketID: 'K3C001', memberID: 'C345678901', showingID: 'S00004', orderStateID: 'S00004', mealsID: 'M00005', ticketTypeID: 'T00003', bookingTime: '2025-12-03 09:10:00', seatID: 'D01' },
                { orderID: 'O10004', ticketID: 'K4D001', memberID: 'D456789012', showingID: 'S00003', orderStateID: 'S00001', mealsID: 'M00001', ticketTypeID: 'T00004', bookingTime: '2025-12-04 15:20:00', seatID: 'C10' }
            ]
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
        let skippedCount = 0;
        
        for (const table of insertionOrder) {
            const records = sampleData[table];
            if (!records) continue; 
            
            for (const record of records) {
                try {
                    await db.insert(table, record); 
                    insertCount++;
                } catch (error) {
                    // 忽略重複鍵錯誤
                    if (error.message.includes('UNIQUE constraint failed')) {
                        skippedCount++;
                    } else {
                        console.error(`❌ 插入 ${table} 資料失敗:`, error.message, record);
                        throw new Error(`初始化資料庫失敗 (${table}): ${error.message}`);
                    }
                }
            }
        }

        res.json({
            message: '真實資料初始化完成 (從 DataBase 資料夾轉換)',
            inserted_records: insertCount,
            skipped_duplicates: skippedCount,
            tables_initialized: Object.keys(sampleData).length,
            summary: {
                cinemas: sampleData.cinema.length,
                movies: sampleData.movie.length,
                members: sampleData.member.length,
                showings: sampleData.showing.length,
                bookings: sampleData.bookingrecord.length
            }
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

app.get('/api/members/:id', requireAuth, async (req, res) => {
  try {
    // 只允許查看自己的資料 (除非是管理員)
    if (req.memberID !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        error: '無權限查看此會員資料' 
      });
    }

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

// 票種管理 API (符合資料格式規格)
app.post('/api/ticketclasses', async (req, res) => {
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

// 會員認證 API
// Member Authentication APIs

// 會員登入
app.post('/api/auth/login', async (req, res) => {
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
app.post('/api/auth/register', async (req, res) => {
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

    // 詳細格式驗證
    if (memberAccount.length < 3 || memberAccount.length > 20) {
      return res.status(400).json({ 
        success: false,
        error: '帳號長度須為 3-20 字元' 
      });
    }

    if (memberPwd.length < 6 || memberPwd.length > 50) {
      return res.status(400).json({ 
        success: false,
        error: '密碼長度須為 6-50 字元' 
      });
    }

    if (memberName.length < 2 || memberName.length > 10) {
      return res.status(400).json({ 
        success: false,
        error: '姓名長度須為 2-10 字元' 
      });
    }

    // 電話號碼格式驗證 (台灣手機格式)
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
      error: '登入狀態已過期' 
    });
  }

  req.memberID = tokenParts[1];
  next();
}

// 會員登出 (需要登入狀態)
app.post('/api/auth/logout', requireAuth, async (req, res) => {
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
app.get('/api/auth/profile', requireAuth, async (req, res) => {
  try {
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
app.post('/api/auth/check-account', async (req, res) => {
  try {
    const { account } = req.body;
    
    if (!account) {
      return res.status(400).json({ 
        success: false,
        error: '請提供帳號' 
      });
    }

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
    res.status(500).json({ error: '查詢電影分級失敗', details: error.message });
  }
});

// 餐點管理 API (符合資料格式規格)
app.post('/api/meals', async (req, res) => {
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