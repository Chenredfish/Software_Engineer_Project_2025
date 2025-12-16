const http = require('http');

// 簡單的 API 呼叫函數 (GET)
function callAPI(endpoint, adminToken = null) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000${endpoint}`;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'GET',
      headers: adminToken ? { 'Authorization': adminToken } : {}
    };

    const req = http.request(options, (res) => {
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
    });

    req.on('error', reject);
    req.end();
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

// 管理員登入
async function adminLogin() {
  console.log('🔐 管理員登入中...');
  try {
    const loginResult = await postAPI('/api/admin/login', {
      account: 'admin',
      password: 'admin123'
    });

    // 檢查登入結果 - 管理員 API 成功時有 success: true 和 adminToken
    if (loginResult.success && loginResult.adminToken) {
      console.log(`✅ 管理員登入成功: ${loginResult.admin.account}`);
      console.log(`🔑 Token: ${loginResult.adminToken.substring(0, 20)}...`);
      return loginResult.adminToken;
    } else if (loginResult.error) {
      console.log(`❌ 管理員登入失敗: ${loginResult.error}`);
      return null;
    } else {
      console.log(`❌ 管理員登入失敗: 未知錯誤`);
      console.log(`📋 回應內容:`, JSON.stringify(loginResult, null, 2));
      return null;
    }
  } catch (error) {
    console.log(`❌ 登入錯誤: ${error.message}`);
    return null;
  }
}

// 顯示所有可用的資料表
function showAvailableTables() {
  console.log('\n📋 可用的資料表查詢：');
  console.log('  dashboard      - 系統概覽 (所有表格統計)');
  console.log('  members        - 會員資料 (含密碼)');
  console.log('  movies         - 電影資料');
  console.log('  cinemas        - 影城資料');
  console.log('  showings       - 場次資料');
  console.log('  bookings       - 訂票記錄');
  console.log('  meals          - 餐點資料');
  console.log('  ticketclasses  - 票種資料');
  console.log('  supervisors    - 管理員資料 (含密碼)');
  console.log('  orderstatus    - 訂單狀態資料');
  console.log('  versions       - 電影版本資料');
  console.log('  rated          - 電影分級資料');
  console.log('  theaters       - 影廳資料');
  console.log('  seats          - 座位資料');
  console.log('  movielist      - 影城電影列表');
  console.log('  tokens         - 密碼重設權杖 (調試用)');
  console.log('\n使用方式：');
  console.log('  node admin_debug.js [table_name]');
  console.log('  例如：node admin_debug.js members');
  console.log('       node admin_debug.js dashboard');
}

// 格式化顯示資料
function displayData(tableName, data) {
  console.log(`\n📊 ${tableName.toUpperCase()} 資料：`);
  console.log(`📈 管理員: ${data.admin}`);
  console.log(`📅 查詢時間: ${data.timestamp}`);
  
  if (tableName === 'dashboard') {
    console.log(`📋 系統概覽:`);
    console.log(`   訊息: ${data.message}`);
    console.log('\n📊 各表格統計:');
    Object.entries(data.statistics).forEach(([table, stats]) => {
      if (stats.error) {
        console.log(`   ${table}: ❌ 錯誤 - ${stats.error}`);
      } else {
        console.log(`   ${table}: ${stats.count} 筆資料 (更新時間: ${stats.lastUpdated.substring(0, 19)})`);
      }
    });
  } else {
    console.log(`📋 資料筆數: ${data.count}`);
    console.log(`💬 訊息: ${data.message}`);
    
    // 顯示資料內容
    const dataKey = Object.keys(data).find(key => 
      Array.isArray(data[key]) && key !== 'statistics'
    );
    
    if (dataKey && data[dataKey].length > 0) {
      console.log(`\n📝 ${dataKey.toUpperCase()} 內容:`);
      data[dataKey].forEach((item, index) => {
        console.log(`\n  ${index + 1}. ${JSON.stringify(item, null, 4)}`);
      });
    } else {
      console.log('\n📝 沒有資料內容');
    }
  }
}

// 主要測試函數
async function adminDebug() {
  console.log('🎯 威秀影城管理員資料查詢工具\n');

  // 檢查命令行參數
  const args = process.argv.slice(2);
  if (args.length === 0) {
    showAvailableTables();
    return;
  }

  const requestedTable = args[0].toLowerCase();
  
  // 驗證請求的表格名稱
  const validTables = {
    'dashboard': '/api/admin/dashboard',
    'members': '/api/admin/members',
    'movies': '/api/admin/movies',
    'cinemas': '/api/admin/cinemas',
    'showings': '/api/admin/showings',
    'bookings': '/api/admin/bookings',
    'meals': '/api/admin/meals',
    'ticketclasses': '/api/admin/ticketclasses',
    'supervisors': '/api/admin/supervisors',
    'orderstatus': '/api/admin/orderstatus',
    'versions': '/api/admin/versions',
    'rated': '/api/admin/rated',
    'theaters': '/api/admin/theaters',
    'seats': '/api/admin/seats',
    'movielist': '/api/admin/movielist',
    'tokens': '/api/admin/password-reset-tokens'
  };

  if (!validTables[requestedTable]) {
    console.log(`❌ 無效的表格名稱: ${requestedTable}`);
    showAvailableTables();
    return;
  }

  // 管理員登入
  const adminToken = await adminLogin();
  if (!adminToken) {
    console.log('❌ 無法取得管理員權限，程序終止');
    return;
  }

  console.log(`\n🔍 查詢資料表: ${requestedTable}`);
  
  try {
    // 查詢指定的資料
    const result = await callAPI(validTables[requestedTable], adminToken);
    
    if (result.success) {
      displayData(requestedTable, result);
    } else {
      console.log(`❌ 查詢失敗: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ 查詢錯誤: ${error.message}`);
  }

  console.log('\n✅ 查詢完成');
}

// 特殊用法：查詢多個表格
async function queryMultipleTables(tables) {
  const adminToken = await adminLogin();
  if (!adminToken) {
    console.log('❌ 無法取得管理員權限');
    return;
  }

  const validTables = {
    'dashboard': '/api/admin/dashboard',
    'members': '/api/admin/members',
    'movies': '/api/admin/movies',
    'cinemas': '/api/admin/cinemas',
    'showings': '/api/admin/showings',
    'bookings': '/api/admin/bookings',
    'meals': '/api/admin/meals',
    'ticketclasses': '/api/admin/ticketclasses',
    'supervisors': '/api/admin/supervisors',
    'orderstatus': '/api/admin/orderstatus',
    'versions': '/api/admin/versions',
    'rated': '/api/admin/rated',
    'theaters': '/api/admin/theaters',
    'seats': '/api/admin/seats',
    'movielist': '/api/admin/movielist',
    'tokens': '/api/admin/password-reset-tokens'
  };

  for (const table of tables) {
    if (validTables[table]) {
      console.log(`\n${'='.repeat(50)}`);
      try {
        const result = await callAPI(validTables[table], adminToken);
        if (result.success) {
          displayData(table, result);
        } else {
          console.log(`❌ ${table} 查詢失敗: ${result.error}`);
        }
      } catch (error) {
        console.log(`❌ ${table} 查詢錯誤: ${error.message}`);
      }
      // 添加小延遲避免過快請求
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// 檢查是否為多表格查詢
const args = process.argv.slice(2);
if (args.length > 1) {
  console.log(`🎯 威秀影城管理員多表格查詢工具`);
  console.log(`📋 查詢表格: ${args.join(', ')}`);
  queryMultipleTables(args).catch(console.error);
} else if (args.length === 1 && args[0] === '--all') {
  console.log(`🎯 威秀影城管理員全表格查詢工具`);
  const allTables = [
    'dashboard', 'members', 'movies', 'cinemas', 'showings', 
    'bookings', 'meals', 'ticketclasses', 'supervisors', 
    'orderstatus', 'versions', 'rated', 'theaters', 
    'seats', 'movielist', 'tokens'
  ];
  queryMultipleTables(allTables).catch(console.error);
} else {
  // 單表格查詢或顯示使用說明
  adminDebug().catch(console.error);
}