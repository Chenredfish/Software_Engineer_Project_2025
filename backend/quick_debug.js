const http = require('http');

// 簡單的 API 呼叫函數 (GET)
function callAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000${endpoint}`;
    
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          // 如果狀態碼不是 2xx，標記為失敗
          if (res.statusCode >= 400) {
            parsedData.success = false;
            if (!parsedData.error) {
              parsedData.error = `HTTP ${res.statusCode}`;
            }
          }
          resolve(parsedData);
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

// POST 請求函數
function postAPI(endpoint, postData) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(postData);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve(responseData);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
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
    const cinema = await callAPI('/api/cinemas/C00001');
    console.log('台北旗艦影城詳細資訊:');
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
    const movie = await callAPI('/api/movies/D00001');
    console.log('阿凡達 詳細資訊:');
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
  console.log();

  // 8. 會員認證 API 測試
  console.log('=== 8. 會員認證系統測試 ===');
  
  // 8a. 測試會員註冊
  console.log('8a. 測試會員註冊:');
  try {
    const registerData = {
      memberID: 'A123456789',      // 台灣身分證字號格式
      memberAccount: 'test_user_' + Date.now(), // 使用時間戳避免重複
      memberPwd: 'password123',
      memberName: '測試用戶',
      memberBirth: '1990-01-01',
      memberPhone: '0912345678'
    };
    
    const registerResult = await postAPI('/api/auth/register', registerData);
    if (registerResult.success) {
      console.log(`  ✅ 註冊成功: ${registerResult.member.memberName} (${registerResult.member.memberAccount})`);
      console.log(`  會員ID: ${registerResult.member.memberID}, 餘額: $${registerResult.member.memberBalance}`);
      
      // 8b. 測試會員登入
      console.log('8b. 測試會員登入:');
      const loginResult = await postAPI('/api/auth/login', {
        account: registerData.memberAccount,
        password: registerData.memberPwd
      });
      
      if (loginResult.success) {
        console.log(`  ✅ 登入成功: ${loginResult.member.memberName}`);
        console.log(`  會員資料: ID=${loginResult.member.memberID}, 電話=${loginResult.member.memberPhone}`);
        console.log(`  Session Token: ${loginResult.sessionToken}`);
        
        // 8c. 測試獲取個人資料 (需要 token)
        console.log('8c. 測試獲取個人資料 (需登入):');
        const profileResult = await postAPI('/api/auth/profile', {
          sessionToken: loginResult.sessionToken
        });
        if (profileResult.success) {
          console.log(`  ✅ 個人資料獲取成功: ${profileResult.member.memberName}`);
        } else {
          console.log(`  ❌ 個人資料獲取失敗: ${profileResult.error}`);
        }
        
        // 8d. 測試會員登出 (需要 token)
        console.log('8d. 測試會員登出:');
        const logoutResult = await postAPI('/api/auth/logout', {
          sessionToken: loginResult.sessionToken
        });
        if (logoutResult.success) {
          console.log(`  ✅ 登出成功 (會員ID: ${logoutResult.memberID})`);
        } else {
          console.log(`  ❌ 登出失敗: ${logoutResult.error}`);
        }
      } else {
        console.log(`  ❌ 登入失敗: ${loginResult.error}`);
      }
    } else {
      console.log(`  ❌ 註冊失敗: ${registerResult.error}`);
    }
  } catch (error) {
    console.log(`  ❌ 錯誤情況測試失敗: ${error.message}`);
  }
  console.log();
  
  // 10. 測試其他資料表 API (餐點、票種等)
  console.log('=== 10. 資料表管理 API 測試 ===');
  try {
    console.log('10a. 測試新增餐點:');
    const mealResult = await postAPI('/api/meals', {
      mealsID: 'M99999',
      mealName: '測試餐點',
      mealsPrice: 150,
      mealsDisp: '這是一個測試用餐點',
      mealsPhoto: 'Photo/test/meal.jpg'
    });
    
    if (mealResult.success) {
      console.log(`  ✅ 餐點新增成功: ${mealResult.message}`);
    } else {
      console.log(`  ❌ 餐點新增失敗: ${mealResult.error}`);
    }
    
    console.log('10b. 測試新增票種:');
    const ticketResult = await postAPI('/api/ticketclasses', {
      ticketClassID: 'T99999',
      ticketClassName: '測試票種',
      ticketClassPrice: 280,
      ticketInfo: '這是一個測試用票種'
    });
    
    if (ticketResult.success) {
      console.log(`  ✅ 票種新增成功: ${ticketResult.message}`);
    } else {
      console.log(`  ❌ 票種新增失敗: ${ticketResult.error}`);
    }
    
    console.log('10c. 測試超長 ID 驗證 (應該失敗):');
    const invalidMealResult = await postAPI('/api/meals', {
      mealsID: 'M999999',  // 超過 6 字元
      mealName: '錯誤餐點',
      mealsPrice: 100,
      mealsDisp: '測試'
    });
    
    if (!invalidMealResult.success) {
      console.log(`  ✅ 正確阻擋無效 ID: ${invalidMealResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證 ID 長度`);
    }
    
  } catch (error) {
    console.log(`  ❌ 資料表 API 測試失敗: ${error.message}`);
  }
  console.log();
  
  // 9. 測試重複帳號註冊 (應該失敗)
  console.log('=== 9. 錯誤情況測試 ===');
  try {
    console.log('9a. 測試重複帳號註冊 (應該失敗):');
    const duplicateResult = await postAPI('/api/auth/register', {
      memberID: 'A123456789',     // 已存在的身分證字號
      memberAccount: 'user_john', // 已存在的帳號
      memberPwd: 'newpassword',
      memberName: '重複用戶',
      memberBirth: '1995-01-01',
      memberPhone: '0987654321'
    });
    
    if (!duplicateResult.success) {
      console.log(`  ✅ 正確阻擋重複帳號: ${duplicateResult.error}`);
    } else {
      console.log(`  ❌ 未正確阻擋重複帳號註冊`);
    }
    
    console.log('9b. 測試錯誤密碼登入 (應該失敗):');
    const wrongPasswordResult = await postAPI('/api/auth/login', {
      account: 'user_john',
      password: 'wrongpassword'
    });
    
    if (!wrongPasswordResult.success) {
      console.log(`  ✅ 正確阻擋錯誤密碼: ${wrongPasswordResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證密碼`);
    }
    
    console.log('9c. 測試帳號可用性檢查:');
    const checkResult = await postAPI('/api/auth/check-account', {
      account: 'user_john'
    });
    
    if (checkResult.success) {
      console.log(`  ✅ 帳號檢查: 存在=${checkResult.exists}, 可用=${checkResult.available}`);
    }
    
    console.log('9d. 測試未登入狀態存取受保護資源 (應該失敗):');
    const unauthorizedResult = await callAPI('/api/auth/profile'); // 使用 GET 請求
    
    if (!unauthorizedResult.success) {
      console.log(`  ✅ 正確阻擋未登入存取: ${unauthorizedResult.error}`);
    } else {
      console.log(`  ❌ 未正確保護受限資源`);
    }
    
    console.log('9e. 測試無效 token 登出 (應該失敗):');
    const invalidTokenResult = await postAPI('/api/auth/logout', {
      sessionToken: 'invalid_token_123'
    });
    
    if (!invalidTokenResult.success) {
      console.log(`  ✅ 正確驗證無效 token: ${invalidTokenResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證 token`);
    }
    
    console.log('9f. 測試資料格式驗證 (應該失敗):');
    
    // 測試無效身分證字號
    const invalidIdResult = await postAPI('/api/auth/register', {
      memberID: '123456789',      // 無效身分證格式
      memberAccount: 'test_invalid',
      memberPwd: 'password123',
      memberName: '測試',
      memberBirth: '1990-01-01',
      memberPhone: '0912345678'
    });
    
    if (!invalidIdResult.success) {
      console.log(`  ✅ 正確阻擋無效身分證: ${invalidIdResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證身分證格式`);
    }
    
    // 測試無效電話號碼
    const invalidPhoneResult = await postAPI('/api/auth/register', {
      memberID: 'B223456789',
      memberAccount: 'test_invalid_phone',
      memberPwd: 'password123',
      memberName: '測試',
      memberBirth: '1990-01-01',
      memberPhone: '123456789'    // 無效電話格式
    });
    
    if (!invalidPhoneResult.success) {
      console.log(`  ✅ 正確阻擋無效電話: ${invalidPhoneResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證電話格式`);
    }
    
    // 測試超長帳號
    const longAccountResult = await postAPI('/api/auth/register', {
      memberID: 'C234567890',
      memberAccount: 'a'.repeat(51),  // 超過 50 字元的帳號
      memberPwd: 'password123',
      memberName: '測試',
      memberBirth: '1990-01-01',
      memberPhone: '0912345678'
    });
    
    if (!longAccountResult.success) {
      console.log(`  ✅ 正確阻擋超長帳號: ${longAccountResult.error}`);
    } else {
      console.log(`  ❌ 未正確驗證帳號長度`);
    }
    
  } catch (error) {
    console.log(`  ❌ 錯誤測試失敗: ${error.message}`);
  }
  
  console.log('\n測試完成 - 包含資料庫查詢和會員認證功能測試');
}

// 執行測試
quickTest().catch(console.error);