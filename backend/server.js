// server.js - 主要伺服器檔案 (重構後)
const path = require('path');//為了讓照片能動加的，沒動其他東西，軒
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors());
app.use(express.json());

app.use(
  '/Photo',
  express.static(path.resolve(__dirname, './Photo'))
);//為了讓照片能動加的，沒動其他東西，軒

// 將資料庫實例附加到 app.locals，讓所有路由都能使用
app.locals.db = db;

// 匯入路由模組
const authRoutes = require('./routes/auth');
const cinemaRoutes = require('./routes/cinema');
const movieRoutes = require('./routes/movie');
const memberRoutes = require('./routes/member');
const referenceRoutes = require('./routes/reference');
const bookingRoutes = require('./routes/booking');
const showingRoutes = require('./routes/showing');
const adminRoutes = require('./routes/admin');

// 註冊路由
app.use('/api/auth', authRoutes.router);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/members', memberRoutes);
app.use('/api', referenceRoutes); // 參考資料路由 (rated, versions, meals, ticketclasses, orderstatus)
app.use('/api/bookings', bookingRoutes);
app.use('/api/showings', showingRoutes);
app.use('/api/admin', adminRoutes);

// 主頁路由 - API 說明
app.get('/', (req, res) => {
  res.json({
    message: '威秀影城後端系統 API',
    version: '2.0.0 (重構版)',
    documentation: 'README.md',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      authentication: {
        'POST /api/auth/login': '會員登入',
        'POST /api/auth/register': '會員註冊',
        'POST /api/auth/logout': '會員登出 (需登入)',
        'GET /api/auth/profile': '獲取個人資料 (需登入)',
        'POST /api/auth/check-account': '檢查帳號可用性'
      },
      core_tables: {
        'GET|POST|PUT|DELETE /api/cinemas': '影城管理',
        'GET|POST|PUT|DELETE /api/movies': '電影管理', 
        'GET|POST|PUT|DELETE /api/members': '會員管理',
        'GET|POST|PUT|DELETE /api/bookings': '訂票紀錄管理',
        'GET|POST|PUT|DELETE /api/showings': '場次管理',
        'GET /api/showings/:id/seats': '座位查詢'
      },
      reference_data: {
        'GET|POST /api/rated': '電影分級管理',
        'GET|POST /api/versions': '電影版本管理',
        'GET|POST /api/meals': '餐點管理',
        'GET|POST /api/ticketclasses': '票種管理',
        'GET|POST /api/orderstatus': '訂單狀態管理'
      },
      admin: {
        'POST /api/admin/login': '管理員登入',
        'GET|POST /api/admin': '管理員帳號管理'
      },
      utilities: {
        'GET /api/test': '測試資料庫連接',
        'POST /api/init-sample-data': '初始化範例資料'
      }
    }
  });
});

// 測試資料庫連接
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT 1 as test, datetime("now") as current_time');
    
    // 測試主要表格的資料量
    const stats = {};
    const mainTables = ['cinema', 'movie', 'member', 'showing', 'bookingrecord'];
    
    for (const table of mainTables) {
      try {
        const data = await db.findAll(table);
        stats[table] = data.length;
      } catch (error) {
        stats[table] = `error: ${error.message}`;
      }
    }

    res.json({
      message: '資料庫連接正常',
      database: './moviesql.db',
      test_query: result[0],
      data_statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: '資料庫連接失敗',
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
                { mealsID: 'M00001', mealName: '爆米花套餐', mealsPrice: 250, mealsDisp: '經典爆米花加兩杯飲料', mealsPhoto: 'Photo/meals/popcorn.jpg' },
                { mealsID: 'M00002', mealName: '熱狗堡', mealsPrice: 120, mealsDisp: '美式經典熱狗堡', mealsPhoto: 'Photo/meals/hotdog.jpg' },
                { mealsID: 'M00003', mealName: '吉拿棒', mealsPrice: 80, mealsDisp: '灑滿肉桂粉', mealsPhoto: 'Photo/meals/churros.jpg' },
                { mealsID: 'M00004', mealName: '汽水單杯', mealsPrice: 70, mealsDisp: '可口可樂/雪碧', mealsPhoto: 'Photo/meals/soda.jpg' },
                { mealsID: 'M00005', mealName: '礦泉水', mealsPrice: 50, mealsDisp: '純淨飲用水', mealsPhoto: 'Photo/meals/water.jpg' }
            ],
            
            // 影城與影廳 (showing 依賴 cinema, theater)
            cinema: [
                { 
                    cinemaID: 'C00001', 
                    cinemaAddress: '台北市信義區忠孝東路 1 號',
                    cinemaName: '台北旗艦影城',
                    cinemaPhoneNumber: '0227123456',
                    cinemaBusinessTime: 'Mon-Sun 10:00-02:00',
                    cinemaPhoto: 'Photo/cinema/taipei_flagship.jpg'
                },
                { 
                    cinemaID: 'C00002', 
                    cinemaAddress: '台中市西屯區台灣大道三段 100 號',
                    cinemaName: '台中數位影城',
                    cinemaPhoneNumber: '0423456789',
                    cinemaBusinessTime: 'Mon-Sun 09:30-01:30',
                    cinemaPhoto: 'Photo/cinema/taichung_digital.jpg'
                },
                { 
                    cinemaID: 'C00003', 
                    cinemaAddress: '高雄市前鎮區中華五路 789 號',
                    cinemaName: '高雄港灣影城',
                    cinemaPhoneNumber: '0776543210',
                    cinemaBusinessTime: 'Mon-Sun 10:00-24:00',
                    cinemaPhoto: 'Photo/cinema/kaohsiung_harbor.jpg'
                },
                { 
                    cinemaID: 'C00004', 
                    cinemaAddress: '新北市板橋區中山路一段 152 號',
                    cinemaName: '板橋巨幕影城',
                    cinemaPhoneNumber: '0229876543',
                    cinemaBusinessTime: 'Mon-Sun 10:30-01:00',
                    cinemaPhoto: 'Photo/cinema/banqiao_imax.jpg'
                },
                { 
                    cinemaID: 'C00005', 
                    cinemaAddress: '桃園市中壢區中正路 321 號',
                    cinemaName: '中壢星光影城',
                    cinemaPhoneNumber: '0334567890',
                    cinemaBusinessTime: 'Mon-Sun 11:00-02:00',
                    cinemaPhoto: 'Photo/cinema/zhongli_starlight.jpg'
                }
            ],
            theater: [
                // 為了匹配 showing，這裡使用 T00001 到 T00005
                { theaterID: 'T00001', theaterName: '一廳 IMAX', cinemaID: 'C00001' },
                { theaterID: 'T00002', theaterName: '二廳 2D', cinemaID: 'C00001' },
                { theaterID: 'T00003', theaterName: '三廳 Dolby', cinemaID: 'C00002' },
                { theaterID: 'T00004', theaterName: '四廳 4DX', cinemaID: 'C00002' },
                { theaterID: 'T00005', theaterName: '五廳 標準廳', cinemaID: 'C00003' }
            ],
            
            // 電影資料 (showing 依賴 movie)
            movie: [
                {
                    movieID: 'D00001',
                    movieName: '阿凡達',
                    movieTime: '02:42:00',
                    ratedID: 'R00003',
                    movieStartDate: '2009-12-18',
                    movieInfo: '一個關於潘朵拉星球與人類衝突的科幻故事。',
                    moviePhoto: 'Photo/movie/avatar.jpg',
                    director: '詹姆斯·卡麥隆',
                    actors: '山姆·沃辛頓, 柔伊·莎達娜'
                },
                {
                    movieID: 'D00002',
                    movieName: '動物方城市',
                    movieTime: '01:48:00',
                    ratedID: 'R00004',
                    movieStartDate: '2016-03-04',
                    movieInfo: '一隻兔子警官與狐狸騙子的冒險故事。',
                    moviePhoto: 'Photo/movie/zootopia.jpg',
                    director: '拜倫·霍華德',
                    actors: '金妮弗·古德溫, 傑森·貝特曼'
                },
                {
                    movieID: 'D00003',
                    movieName: '出神入化',
                    movieTime: '01:55:00',
                    ratedID: 'R00003',
                    movieStartDate: '2013-05-31',
                    movieInfo: '四位魔術師執行不可能的搶劫計畫。',
                    moviePhoto: 'Photo/movie/illusion.jpg',
                    director: '路易斯·賴托瑞',
                    actors: '傑西·艾森伯格, 馬克·盧法洛'
                },
                {
                    movieID: 'D00004',
                    movieName: '大蟒蛇',
                    movieTime: '01:29:00',
                    ratedID: 'R00002',
                    movieStartDate: '1997-04-11',
                    movieInfo: '亞馬遜叢林中的巨蟒威脅著探險隊。',
                    moviePhoto: 'Photo/movie/anaconda.jpg',
                    director: '路易斯·羅沙',
                    actors: '珍妮弗·洛佩茲, 冰塊酷巴'
                },
                {
                    movieID: 'D00005',
                    movieName: '魔法壞女巫',
                    movieTime: '02:30:00',
                    ratedID: 'R00004',
                    movieStartDate: '2024-11-27',
                    movieInfo: '綠野仙蹤前傳，講述西方壞女巫的故事。',
                    moviePhoto: 'Photo/movie/wicked.jpg',
                    director: '朱浩偉',
                    actors: '辛西婭·艾利沃, 亞莉安娜·格蘭德'
                }
            ],
            member: [
                { memberID: 'A123456789', memberAccount: 'user_john', memberPwd: 'hashed_pwd1', memberName: '王大明', memberBirth: '1990-05-15', memberPhone: '0910123456', memberBalance: 5000 },
                { memberID: 'B234567890', memberAccount: 'user_mary', memberPwd: 'hashed_pwd2', memberName: '陳小美', memberBirth: '1985-11-20', memberPhone: '0920234567', memberBalance: 12000 },
                { memberID: 'C345678901', memberAccount: 'user_david', memberPwd: 'hashed_pwd3', memberName: '林志明', memberBirth: '2001-08-01', memberPhone: '0930345678', memberBalance: 800 },
                { memberID: 'D456789012', memberAccount: 'user_lisa', memberPwd: 'hashed_pwd4', memberName: '黃麗莎', memberBirth: '1995-03-25', memberPhone: '0940456789', memberBalance: 3500 },
                { memberID: 'E567890123', memberAccount: 'user_mike', memberPwd: 'hashed_pwd5', memberName: '吳麥克', memberBirth: '1976-01-10', memberPhone: '0950567890', memberBalance: 10000 }
            ],
            // 新增：theater (影廳) 資料
            // 確保 theaterID 與 showing 中引用的 T00001~T00005 匹配，
            // 且 theaterID 應指向其父表 cinemaID
            theater: [
                { theaterID: 'T00001', theaterName: '一廳 IMAX', cinemaID: 'C00001' },
                { theaterID: 'T00002', theaterName: '二廳 2D', cinemaID: 'C00001' },
                { theaterID: 'T00003', theaterName: '三廳 Dolby', cinemaID: 'C00002' },
                { theaterID: 'T00004', theaterName: '四廳 4DX', cinemaID: 'C00002' },
                { theaterID: 'T00005', theaterName: '五廳 標準廳', cinemaID: 'C00003' }
            ],

            

            // 新增：ticket (票券) 資料
            // 確保 ticketID 與 bookingrecord 中引用的 O00001~O00005 匹配
            // 💡 注意: 這裡的 O00001-O00005 看起來像是訂單號，但您將它放在 ticketID 欄位。
            // 我假設這是一個專門記錄已發出票券的 ID，且與 orderID 暫時相同。
            // 關聯表
            showing: [
                { showingID: 'H00001', movieID: 'D00001', theaterID: 'T00001', versionID: 'V00002', showingTime: '2024-12-15 14:30:00' },
                { showingID: 'H00002', movieID: 'D00002', theaterID: 'T00002', versionID: 'V00001', showingTime: '2024-12-15 16:45:00' },
                { showingID: 'H00003', movieID: 'D00003', theaterID: 'T00003', versionID: 'V00004', showingTime: '2024-12-15 19:20:00' },
                { showingID: 'H00004', movieID: 'D00004', theaterID: 'T00004', versionID: 'V00001', showingTime: '2024-12-15 21:30:00' },
                { showingID: 'H00005', movieID: 'D00005', theaterID: 'T00005', versionID: 'V00003', showingTime: '2024-12-15 22:15:00' }
            ],
            // 新增：seat (座位) 資料
            // 確保 seatID 與 bookingrecord 中引用的 S00001~S00005 匹配
            seat: [
                { showingID: 'H00001', seatNumber: 'A01', seatState: 1 }, // H00001 A01 (已預訂)
                { showingID: 'H00001', seatNumber: 'A02', seatState: 0 }, // H00001 A02 (可用)
                { showingID: 'H00001', seatNumber: 'A03', seatState: 0 },
                { showingID: 'H00002', seatNumber: 'B01', seatState: 1 }, // H00002 B01 (已預訂)
                { showingID: 'H00002', seatNumber: 'B02', seatState: 0 },
                { showingID: 'H00003', seatNumber: 'C01', seatState: 0 }, // H00003 C01 (可用)
                { showingID: 'H00003', seatNumber: 'C02', seatState: 1 },
                { showingID: 'H00004', seatNumber: 'D01', seatState: 0 }, // H00004 D01 (可用)
                { showingID: 'H00004', seatNumber: 'D02', seatState: 1 },
                { showingID: 'H00005', seatNumber: 'E01', seatState: 0 }
            ],
            bookingrecord: [
                { 
                  orderID: 'O00001', memberID: 'A123456789', showingID: 'H00001', 
                  ticketID: 'O00001', orderStateID: 'S00001', mealsID: 'M00001', 
                  ticketTypeID: 'T00001', bookingTime: '2024-12-10 14:30:00', seatNumber: 'A01' // 填入 seat.A01
                },
                { 
                  orderID: 'O00002', memberID: 'B234567890', showingID: 'H00002', 
                  ticketID: 'O00002', orderStateID: 'S00003', mealsID: 'M00002', 
                  ticketTypeID: 'T00002', bookingTime: '2024-12-11 10:00:00', seatNumber: 'B01' // 填入 seat.B01
                },
                { 
                  orderID: 'O00003', memberID: 'C345678901', showingID: 'H00003', 
                  ticketID: 'O00003', orderStateID: 'S00001', mealsID: null, 
                  ticketTypeID: 'T00003', bookingTime: '2024-12-12 18:00:00', seatNumber: 'C02' // 填入 seat.C02 (已預訂)
                },
                { 
                  orderID: 'O00004', memberID: 'D456789012', showingID: 'H00004', 
                  ticketID: 'O00004', orderStateID: 'S00005', mealsID: 'M00004', 
                  ticketTypeID: 'T00001', bookingTime: '2024-12-13 20:45:00', seatNumber: 'D02' // 填入 seat.D02 (已預訂)
                },
                { 
                  orderID: 'O00005', memberID: 'E567890123', showingID: 'H00005', 
                  ticketID: 'O00005', orderStateID: 'S00001', mealsID: 'M00005', 
                  ticketTypeID: 'T00004', bookingTime: '2024-12-14 16:15:00', seatNumber: 'E01' // 填入 seat.E01 (可用，假設剛預訂成功)
                }
            ]
        };

        // 依序插入資料 (注意外鍵依賴關係)
        const insertOrder = [
            'rated', 'version', 'supervisor', 'orderstatus', 'ticketclass', 'meals', 'cinema', 'movie', 'member', 
            // 級別 2
            'theater', 'seat', 
            // 級別 3
            'showing', 
            // 級別 4
            'ticket', 'bookingrecord' 
        ];

        for (const tableName of insertOrder) {
            const tableData = sampleData[tableName];
            if (tableData && tableData.length > 0) {
                console.log(`正在插入 ${tableName} 表資料...`);
                
                for (const record of tableData) {
                    try {
                        await db.insert(tableName, record);
                    } catch (error) {
                        // 如果是重複插入，忽略錯誤
                        if (!error.message.includes('UNIQUE constraint failed')) {
                            console.error(`插入 ${tableName} 失敗:`, error.message);
                        }
                    }
                }
                
                console.log(`${tableName} 表插入完成 (${tableData.length} 筆記錄)`);
            }
        }

        res.json({
            message: '範例資料初始化成功',
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

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '找不到請求的資源',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 錯誤處理中間件
app.use((error, req, res, next) => {
  console.error('伺服器錯誤:', error);
  res.status(500).json({
    error: '內部伺服器錯誤',
    details: process.env.NODE_ENV === 'development' ? error.message : '請聯繫系統管理員',
    timestamp: new Date().toISOString()
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 威秀影城後端系統啟動成功`);
  console.log(`📍 伺服器地址: http://localhost:${PORT}`);
  console.log(`📚 API 文件: http://localhost:${PORT}`);
  console.log(`🗃️  資料庫檔案: ./moviesql.db`);
  console.log(`⏰ 啟動時間: ${new Date().toISOString()}`);
  
  // 測試資料庫連接
  db.query('SELECT 1 as test')
    .then(result => {
      console.log('✅ 資料庫連接正常');
    })
    .catch(error => {
      console.error('❌ 資料庫連接失敗:', error.message);
    });
});

module.exports = app;