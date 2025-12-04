const http = require('http');

// 簡單的 API 呼叫函數
function callAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000${endpoint}`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

// 主要測試函數
async function quickTest() {
  console.log('快速 API 測試 - 常用資料庫查詢示範\n');

  // 1. 取得所有影城列表 (常用於選單)
  console.log('=== 1. 影城選單查詢 ===');
  try {
    const cinemas = await callAPI('/api/cinemas');
    console.log(`找到 ${cinemas.length} 間影城:`);
    cinemas.forEach(cinema => {
      console.log(`  ${cinema.cinemaID}: ${cinema.cinemaName}`);
    });
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 2. 查詢特定影城詳細資訊
  console.log('=== 2. 特定影城查詢 ===');
  try {
    const cinema = await callAPI('/api/cinemas/C001');
    console.log('威秀板橋店詳細資訊:');
    console.log(`  名稱: ${cinema.cinemaName}`);
    console.log(`  地址: ${cinema.cinemaAddress}`);
    console.log(`  電話: ${cinema.cinemaPhoneNumber}`);
    console.log(`  營業時間: ${cinema.cinemaBusinessTime}`);
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 3. 取得電影列表 (常用於首頁展示)
  console.log('=== 3. 電影列表查詢 ===');
  try {
    const movies = await callAPI('/api/movies');
    console.log(`目前上映 ${movies.length} 部電影:`);
    movies.forEach(movie => {
      console.log(`  ${movie.movieID}: ${movie.movieName} (${movie.movieTime})`);
      console.log(`    導演: ${movie.director}`);
      console.log(`    主演: ${movie.actors}`);
      console.log(`    上映日期: ${movie.movieStartDate}`);
    });
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 4. 查詢特定電影詳細資訊
  console.log('=== 4. 特定電影查詢 ===');
  try {
    const movie = await callAPI('/api/movies/M001');
    console.log('阿凡達：水之道 詳細資訊:');
    console.log(`  片名: ${movie.movieName}`);
    console.log(`  片長: ${movie.movieTime}`);
    console.log(`  分級: ${movie.ratedID}`);
    console.log(`  劇情: ${movie.movieInfo}`);
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 5. 查詢電影分級資料 (用於篩選)
  console.log('=== 5. 電影分級查詢 ===');
  try {
    const ratings = await callAPI('/api/rated');
    console.log('可用的電影分級:');
    ratings.forEach(rating => {
      console.log(`  ${rating.ratedID}: ${rating.rateName}`);
    });
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 6. 查詢電影版本資料 (用於場次選擇)
  console.log('=== 6. 電影版本查詢 ===');
  try {
    const versions = await callAPI('/api/versions');
    console.log('可用的播放版本:');
    versions.forEach(version => {
      console.log(`  ${version.versionID}: ${version.versionName}`);
    });
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  console.log();

  // 7. 檢查會員和場次資料狀態
  console.log('=== 7. 系統資料狀態檢查 ===');
  try {
    const members = await callAPI('/api/members');
    const showings = await callAPI('/api/showings');
    const bookings = await callAPI('/api/bookings');
    
    console.log(`會員數量: ${members.length}`);
    console.log(`場次數量: ${showings.length}`);
    console.log(`訂票記錄: ${bookings.length}`);
    
    if (showings.length === 0) {
      console.log('提示: 尚未建立電影場次，前端可能無法完整運作');
    }
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  }
  
  console.log('\n測試完成 - 以上展示了常見的API查詢用法');
}

// 執行測試
quickTest().catch(console.error);