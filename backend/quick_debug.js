import http from 'http';

// 通用 API 呼叫函數
function callAPI(endpoint, method = 'GET', postData = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:3000${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (postData && method !== 'GET') {
      const data = JSON.stringify(postData);
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          parsedData._statusCode = res.statusCode;
          resolve(parsedData);
        } catch (e) {
          resolve({ 
            _raw: responseData, 
            _statusCode: res.statusCode,
            success: res.statusCode < 400 
          });
        }
      });
    });

    req.on('error', reject);
    
    if (postData && method !== 'GET') {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

// 便捷函數
const GET = (endpoint, headers = {}) => callAPI(endpoint, 'GET', null, headers);
const POST = (endpoint, data, headers = {}) => callAPI(endpoint, 'POST', data, headers);
const PUT = (endpoint, data, headers = {}) => callAPI(endpoint, 'PUT', data, headers);
const DELETE = (endpoint, headers = {}) => callAPI(endpoint, 'DELETE', null, headers);

// 測試結果輸出函數
function logResult(testName, result, expected = 'success') {
  const status = result._statusCode;
  const success = expected === 'success' ? (result.success !== false && status < 400) : (result.success === false || status >= 400);
  const icon = success ? '✅' : '❌';
  console.log(`  ${icon} ${testName}: ${success ? 'PASS' : 'FAIL'}`);
  if (!success) {
    console.log(`     Expected: ${expected}, Got: ${status}, Error: ${result.error || result.message || 'Unknown'}`);
  }
  return success;
}

// 全域測試變數
let passedTests = 0;
let totalTests = 0;

// 測試用的會員資料
const testMember = {
  id: null,
  email: 'testuser' + Date.now() + '@example.com',
  password: 'TestPass123!',
  name: '測試用戶',
  phone: '0912345678',
  birthDate: '1990-01-01',
  idNumber: 'A1' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0')
};

// 測試用的認證資料
const testAuth = {
  memberToken: null,
  memberId: null,
  adminToken: null,
  adminId: null
};

// 測試用的電影資料
const testMovie = {
  id: null
};

// 測試用的影城資料
const testCinema = {
  id: null
};

// 測試用的場次資料
const testShowing = {
  id: null,
  theaterID: null
};

// 測試用的訂票資料
const testBooking = {
  id: null,
  seats: []
};

// 主要測試函數
async function quickTest() {
  console.log('威秀影城後端系統 - 分層權限API測試\n');
  console.log('測試分為三個權限層級：無登入、會員登入、管理員登入\n');

  // === 第一階段：無登入測試 ===
  console.log('第一階段：無登入權限測試');
  console.log('測試所有公開API和基礎功能\n');
  
  await testPublicAPIs();
  
  // === 第二階段：會員登入測試 ===
  console.log('\n第二階段：會員登入權限測試');  
  console.log('測試需要會員身份的功能\n');
  
  await testMemberAPIs();
  
  // === 第三階段：管理員登入測試 ===
  console.log('\n第三階段：管理員權限測試');
  console.log('測試需要管理員權限的功能\n');
  
  await testAdminAPIs();
  
  // === 安全性測試 ===
  console.log('\n安全性與錯誤處理測試\n');
  
  await testSecurityAndErrors();
  
  // 測試結果統計
  console.log('\n' + '='.repeat(80));
  console.log('完整測試結果統計');
  console.log('='.repeat(80));
  console.log(`總測試數: ${totalTests}`);
  console.log(`通過測試: ${passedTests}`);
  console.log(`失敗測試: ${totalTests - passedTests}`);
  console.log(`整體通過率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('所有測試通過！系統運作正常');
  } else {
    console.log('部分測試失敗，請檢查上述錯誤訊息');
  }
}

// === 第一階段：無登入權限測試 ===
async function testPublicAPIs() {
  console.log('='.repeat(80));
  console.log('系統基礎功能測試（無需登入）');
  console.log('='.repeat(80));

  // 測試根路徑
  totalTests++;
  const rootResult = await GET('/');
  if (logResult('根路徑回應', rootResult)) {
    passedTests++;
    console.log(`     系統版本: ${rootResult.version}`);
    console.log(`     環境: ${rootResult.environment}`);
  }

  // 測試資料庫連接
  totalTests++;
  const dbResult = await GET('/api/test');
  if (logResult('資料庫連接測試', dbResult)) {
    passedTests++;
    if (dbResult.data_statistics) {
      console.log('     資料表狀態:');
      Object.entries(dbResult.data_statistics).forEach(([table, count]) => {
        console.log(`       ${table}: ${count} 筆資料`);
      });
    }
  }

  // 測試初始化範例資料
  totalTests++;
  const initResult = await POST('/api/init-sample-data');
  if (logResult('初始化範例資料', initResult)) {
    passedTests++;
    if (initResult.summary) {
      console.log('     初始化資料統計:');
      Object.entries(initResult.summary).forEach(([type, count]) => {
        console.log(`       ${type}: ${count} 筆`);
      });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('公開查詢API測試（無需登入）');
  console.log('='.repeat(80));

  // 測試影城列表查詢（公開）
  totalTests++;
  const cinemasList = await GET('/api/cinemas');
  if (logResult('影城列表查詢', cinemasList)) {
    passedTests++;
    console.log(`     影城總數: ${cinemasList.length}`);
    if (cinemasList.length > 0) {
      testCinema.id = cinemasList[0].cinemaID;
      console.log(`     測試影城: ${cinemasList[0].cinemaName}`);
    }
  }

  // 測試電影列表查詢（公開）
  totalTests++;
  const moviesList = await GET('/api/movies');
  if (logResult('電影列表查詢', moviesList)) {
    passedTests++;
    console.log(`     電影總數: ${moviesList.length}`);
    if (moviesList.length > 0) {
      testMovie.id = moviesList[0].movieID;
      console.log(`     測試電影: ${moviesList[0].movieName}`);
    }
  }

  // 測試場次列表查詢（公開）
  totalTests++;
  const showingsList = await GET('/api/showings');
  if (logResult('場次列表查詢', showingsList)) {
    passedTests++;
    console.log(`     場次總數: ${showingsList.length}`);
    if (showingsList.length > 0) {
      testShowing.id = showingsList[0].showingID;
      testShowing.theaterID = showingsList[0].theaterID;
      console.log(`     測試場次ID: ${testShowing.id}`);
    }
  }

  // 測試參考資料查詢（公開）
  console.log('\n參考資料查詢測試（公開）');
  
  totalTests++;
  const ratedData = await GET('/api/rated');
  if (logResult('電影分級資料', ratedData)) {
    passedTests++;
    console.log(`     分級類別數: ${ratedData.length}`);
  }

  totalTests++;
  const versionsData = await GET('/api/versions');
  if (logResult('電影版本資料', versionsData)) {
    passedTests++;
    console.log(`     版本類別數: ${versionsData.length}`);
  }

  totalTests++;
  const mealsData = await GET('/api/meals');
  if (logResult('餐點資料', mealsData)) {
    passedTests++;
    console.log(`     餐點種類數: ${mealsData.length}`);
  }

  totalTests++;
  const ticketClassesData = await GET('/api/ticketclasses');
  if (logResult('票種資料', ticketClassesData)) {
    passedTests++;
    console.log(`     票種類別數: ${ticketClassesData.length}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('會員註冊與登入測試（無需預先登入）');
  console.log('='.repeat(80));

  // 測試帳號檢查
  totalTests++;
  const checkNonExist = await POST('/api/auth/check-account', {
    account: 'nonexistent@test.com'
  });
  if (logResult('檢查不存在帳號', checkNonExist)) {
    passedTests++;
    console.log(`     帳號是否存在: ${checkNonExist.exists}`);
  }

  // 測試會員註冊
  totalTests++;
  const registerData = {
    memberID: testMember.idNumber,
    memberAccount: testMember.email,
    memberPwd: testMember.password,
    memberName: testMember.name,
    memberPhone: testMember.phone,
    memberBirth: testMember.birthDate
  };
  
  const registerResult = await POST('/api/auth/register', registerData);
  if (logResult('會員註冊', registerResult)) {
    passedTests++;
    testMember.id = registerResult.member.memberID;
    console.log(`     註冊會員ID: ${testMember.id}`);
  }

  // 測試會員登入
  totalTests++;
  const loginResult = await POST('/api/auth/login', {
    account: testMember.email,
    password: testMember.password
  });
  if (logResult('會員登入', loginResult)) {
    passedTests++;
    testAuth.memberToken = loginResult.sessionToken;
    testAuth.memberId = loginResult.member.memberID;
    console.log(`     登入Token: ${testAuth.memberToken ? '已取得' : '未取得'}`);
  }

  // 測試忘記密碼功能
  totalTests++;
  const forgotPasswordResult = await POST('/api/auth/forgot-password', {
    account: testMember.email
  });
  if (logResult('忘記密碼申請', forgotPasswordResult)) {
    passedTests++;
  }
}

// === 第二階段：會員登入權限測試 ===
async function testMemberAPIs() {
  if (!testAuth.memberToken) {
    console.log('跳過會員功能測試 - 無有效會員Token');
    return;
  }

  console.log('='.repeat(80));
  console.log('會員個人功能測試（需要會員登入）');
  console.log('='.repeat(80));

  // 測試個人資料查詢
  totalTests++;
  const profileResult = await callAPI('/api/auth/profile', 'GET', null, {
    'Authorization': testAuth.memberToken
  });
  if (logResult('會員資料查詢', profileResult)) {
    passedTests++;
    console.log(`     會員姓名: ${profileResult.memberName}`);
    console.log(`     會員等級: ${profileResult.levelName || '一般會員'}`);
    console.log(`     帳戶餘額: $${profileResult.memberBalance || 0}`);
  }

  // 測試單一會員查詢
  totalTests++;
  const memberDetail = await callAPI(`/api/members/${testMember.id}`, 'GET', null, {
    'Authorization': testAuth.memberToken
  });
  if (logResult('單一會員查詢', memberDetail)) {
    passedTests++;
    console.log(`     會員姓名: ${memberDetail.memberName}`);
    console.log(`     帳戶餘額: $${memberDetail.memberBalance}`);
  }

  // 測試會員資料更新
  totalTests++;
  const updateData = {
    memberName: testMember.name + ' (已更新)',
    memberPhone: '0912345679'
  };
  const updateResult = await callAPI(`/api/members/${testMember.id}`, 'PUT', updateData, {
    'Authorization': testAuth.memberToken
  });
  if (logResult('會員資料更新', updateResult)) {
    passedTests++;
  }

  // 測試會員加值
  totalTests++;
  const topupResult = await callAPI(`/api/members/${testMember.id}/topup`, 'POST', {
    amount: 500,
    paymentMethod: 'credit_card'
  }, {
    'Authorization': testAuth.memberToken
  });
  if (logResult('會員加值', topupResult)) {
    passedTests++;
    console.log(`     加值金額: $500`);
    console.log(`     新餘額: $${topupResult.newBalance || 'N/A'}`);
  }

  console.log('\n座位與訂票功能測試（需要會員登入）');

  // 測試查詢場次座位狀態
  if (testShowing.id) {
    totalTests++;
    const seatsStatus = await GET(`/api/showings/${testShowing.id}/seats`);
    if (logResult('查詢座位狀態', seatsStatus)) {
      passedTests++;
      const availableSeats = seatsStatus.filter(seat => seat.seatStatus === 'available');
      const bookedSeats = seatsStatus.filter(seat => seat.seatStatus === 'booked');
      console.log(`     可用座位: ${availableSeats.length}`);
      console.log(`     已訂座位: ${bookedSeats.length}`);
      
      if (availableSeats.length > 0) {
        testBooking.seats = [availableSeats[0].seatNumber];
        console.log(`     測試座位: ${availableSeats[0].seatNumber}`);
      }
    }
  }

  // 測試會員訂票記錄查詢
  totalTests++;
  const memberBookings = await callAPI(`/api/bookings/member/${testMember.id}`, 'GET', null, {
    'Authorization': testAuth.memberToken
  });
  if (logResult('會員訂票記錄', memberBookings)) {
    passedTests++;
    console.log(`     該會員訂票數: ${memberBookings.length}`);
  }

  // 測試新增訂票
  if (testShowing.id && testMember.id) {
    totalTests++;
    const newBookingData = {
      memberID: testMember.id,
      showingID: testShowing.id,
      seatNumbers: ['A1', 'A2'],
      ticketClassID: 1,
      totalPrice: 700,
      paymentMethod: 'credit_card'
    };

    const addBookingResult = await callAPI('/api/bookings', 'POST', newBookingData, {
      'Authorization': testAuth.memberToken
    });
    if (logResult('新增訂票', addBookingResult)) {
      passedTests++;
      testBooking.id = addBookingResult.bookingID;
      console.log(`     新訂票ID: ${testBooking.id}`);
    }
  }
}

// === 第三階段：管理員權限測試 ===
async function testAdminAPIs() {
  console.log('='.repeat(80));
  console.log('管理員登入認證');
  console.log('='.repeat(80));

  // 測試管理員登入
  totalTests++;
  const adminLoginResult = await POST('/api/admin/login', {
    account: 'admin',
    password: 'admin123'
  });
  if (logResult('管理員登入', adminLoginResult)) {
    passedTests++;
    testAuth.adminToken = adminLoginResult.sessionToken;
    console.log(`     管理員Token: ${testAuth.adminToken ? '已取得' : '未取得'}`);
  }

  if (!testAuth.adminToken) {
    console.log('跳過管理員功能測試 - 無有效管理員Token');
    return;
  }

  console.log('\n電影管理功能測試（需要管理員權限）');

  // 測試新增電影
  totalTests++;
  const newMovieData = {
    movieID: 'TEST01',
    movieName: '測試電影-復仇者聯盟：終局之戰',
    movieTime: '181分鐘',
    ratedID: 'R00001',
    movieStartDate: '2019-04-24',
    movieInfo: '漫威超級英雄史詩級電影',
    moviePhoto: '/Photo/movie/avengers_endgame.jpg',
    director: 'Russo Brothers',
    actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo'
  };

  const addMovieResult = await callAPI('/api/movies', 'POST', newMovieData, {
    'Authorization': testAuth.adminToken
  });
  if (logResult('新增電影', addMovieResult)) {
    passedTests++;
    testMovie.id = addMovieResult.movie?.movieID || 'TEST01';
    console.log(`     新電影ID: ${testMovie.id}`);
  }

  console.log('\n影城管理功能測試');

  // 測試新增影城
  totalTests++;
  const newCinemaData = {
    cinemaID: 'TEST01',
    cinemaName: '威秀影城-測試館',
    cinemaAddress: '台北市信義區測試路123號',
    cinemaPhoneNumber: '0212345678',
    cinemaBusinessTime: 'Mon-Sun 10:00-02:00',
    cinemaPhoto: '/Photo/cinema/test.jpg'
  };

  const addCinemaResult = await callAPI('/api/cinemas', 'POST', newCinemaData, {
    'Authorization': testAuth.adminToken
  });
  if (logResult('新增影城', addCinemaResult)) {
    passedTests++;
    testCinema.id = addCinemaResult.cinema?.cinemaID || 'TEST01';
    console.log(`     新影城ID: ${testCinema.id}`);
  }

  console.log('\n系統管理功能測試');

  // 測試管理員列表查詢
  totalTests++;
  const adminsList = await callAPI('/api/admin', 'GET', null, {
    'Authorization': testAuth.adminToken
  });
  if (logResult('管理員列表', adminsList)) {
    passedTests++;
    console.log(`     管理員總數: ${adminsList.length}`);
  }
}

// === 安全性與錯誤處理測試 ===
async function testSecurityAndErrors() {
  console.log('='.repeat(80));
  console.log('權限控制測試');
  console.log('='.repeat(80));

  // 測試重複註冊防護
  totalTests++;
  const registerData = {
    memberID: testMember.idNumber,
    memberAccount: testMember.email,
    memberPwd: testMember.password,
    memberName: testMember.name,
    memberPhone: testMember.phone,
    memberBirth: testMember.birthDate
  };
  const duplicateRegister = await POST('/api/auth/register', registerData);
  if (!duplicateRegister || duplicateRegister.error) {
    logResult('重複註冊防護', { success: true, message: '正確拒絕重複註冊' });
    passedTests++;
  } else {
    logResult('重複註冊防護', { error: '系統允許重複註冊，存在安全問題' });
  }

  // 測試錯誤密碼防護
  totalTests++;
  const wrongPasswordLogin = await POST('/api/auth/login', {
    account: testMember.email,
    password: 'wrongpassword'
  });
  if (!wrongPasswordLogin || wrongPasswordLogin.error) {
    logResult('錯誤密碼防護', { success: true, message: '正確拒絕錯誤密碼' });
    passedTests++;
  } else {
    logResult('錯誤密碼防護', { error: '系統允許錯誤密碼登入，存在安全問題' });
  }

  // 測試無授權存取會員功能
  totalTests++;
  const unauthorizedMemberAccess = await callAPI('/api/auth/profile', 'GET', null, {
    'Authorization': 'invalid_token'
  });
  if (unauthorizedMemberAccess && (!unauthorizedMemberAccess.success || unauthorizedMemberAccess.error)) {
    logResult('無效Token存取防護', { success: true, message: '正確拒絕無效Token' });
    passedTests++;
  } else {
    logResult('無效Token存取防護', { error: '未正確驗證Token' });
  }

  console.log('\n輸入驗證與錯誤處理測試');

  // 測試無效的API端點
  totalTests++;
  const invalidEndpoint = await GET('/api/nonexistent');
  if (!invalidEndpoint) {
    logResult('無效API端點處理', { success: true, message: '正確返回404錯誤' });
    passedTests++;
  } else {
    logResult('無效API端點處理', { error: '未正確處理無效端點' });
  }
}

// 測試清理函數 - 清理測試產生的資料
async function cleanupTestData() {
  console.log('\n清理測試資料...');
  
  try {
    // 清理測試會員
    if (testMember.id) {
      await DELETE(`/api/members/${testMember.id}`);
      console.log('已清理測試會員');
    }
    
    // 清理測試電影
    if (testMovie.id) {
      await DELETE(`/api/movies/${testMovie.id}`);
      console.log('已清理測試電影');
    }
    
    // 清理測試影城
    if (testCinema.id) {
      await DELETE(`/api/cinemas/${testCinema.id}`);
      console.log('已清理測試影城');
    }
    
    // 清理測試場次
    if (testShowing.id) {
      await DELETE(`/api/showings/${testShowing.id}`);
      console.log('已清理測試場次');
    }
    
    // 清理測試訂票
    if (testBooking.id) {
      await DELETE(`/api/bookings/${testBooking.id}`);
      console.log('已清理測試訂票');
    }
    
  } catch (error) {
    console.log(`清理過程發生錯誤: ${error.message}`);
  }
  
  console.log('測試資料清理完成\n');
}

// 主執行函數
async function main() {
  console.log('威秀影城後端API測試系統');
  console.log('開始時間:', new Date().toLocaleString('zh-TW'));
  console.log('='.repeat(80));
  
  try {
    // 執行完整測試
    await quickTest();
    
    // 清理測試資料
    await cleanupTestData();
    
  } catch (error) {
    console.error('測試過程發生嚴重錯誤:', error);
  }
  
  console.log('='.repeat(80));
  console.log('測試結束時間:', new Date().toLocaleString('zh-TW'));
}

// 如果直接執行此檔案，則運行測試
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  main().catch(console.error);
}

// 導出測試函數供其他模組使用
export {
  quickTest,
  testPublicAPIs,
  testMemberAPIs,
  testAdminAPIs,
  testSecurityAndErrors,
  callAPI,
  GET,
  POST,
  PUT,
  DELETE
};