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
  console.log('快速 API 測試開始...\n');

  // 測試清單
  const tests = [
    '影城資料 (/api/cinemas)',
    '電影資料 (/api/movies)', 
    '會員資料 (/api/members)',
    '場次資料 (/api/showings)'
  ];

  const endpoints = ['/api/cinemas', '/api/movies', '/api/members', '/api/showings'];

  for (let i = 0; i < tests.length; i++) {
    try {
      console.log(`測試: ${tests[i]}`);
      const data = await callAPI(endpoints[i]);
      
      if (Array.isArray(data)) {
        console.log(`成功! 找到 ${data.length} 筆資料`);
        if (data.length > 0) {
          console.log('第一筆資料:');
          Object.entries(data[0]).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
          });
        }
      } else {
        console.log('成功!', data);
      }
    } catch (error) {
      console.log(`失敗: ${error.message}`);
    }
    console.log('-'.repeat(40));
  }
}

// 執行測試
quickTest().catch(console.error);