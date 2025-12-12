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