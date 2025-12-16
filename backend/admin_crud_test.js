/**
 * 管理員 CRUD 操作測試工具
 * 用於測試新增、修改、刪除功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const ADMIN_CREDENTIALS = {
  account: 'admin',
  password: 'admin123'
};

// HTTP 請求函數 (POST)
function postAPI(endpoint, postData, adminToken = null) {
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

    if (adminToken) {
      options.headers['Authorization'] = adminToken;
    }

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

// HTTP 請求函數 (PUT)
function putAPI(endpoint, postData, adminToken = null) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(postData);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    if (adminToken) {
      options.headers['Authorization'] = adminToken;
    }

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

// HTTP 請求函數 (GET)
function getAPI(endpoint, adminToken = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'GET',
      headers: {}
    };

    if (adminToken) {
      options.headers['Authorization'] = adminToken;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          // 如果狀態碼是 2xx 且有成功標記
          if (res.statusCode >= 200 && res.statusCode < 300 && parsedData.success) {
            // 對於管理員 API，返回具體的數據陣列
            if (parsedData.members) {
              resolve(parsedData.members);
            } else if (parsedData.data) {
              resolve(parsedData.data);
            } else if (Array.isArray(parsedData)) {
              resolve(parsedData);
            } else {
              resolve([]);
            }
          } else {
            resolve({ error: parsedData.error || `HTTP ${res.statusCode}` });
          }
        } catch (e) {
          resolve({ error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// HTTP 請求函數 (DELETE)
function deleteAPI(endpoint, deleteData, adminToken = null) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(deleteData);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    if (adminToken) {
      options.headers['Authorization'] = adminToken;
    }

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

// 獲取管理員 token
async function getAdminToken() {
  const data = await postAPI('/api/admin/login', ADMIN_CREDENTIALS);
  
  if (data.success && data.adminToken) {
    console.log(`登入成功: ${data.admin.account}`);
    return data.adminToken;
  } else {
    throw new Error(`登入失敗: ${data.error || '未知錯誤'}`);
  }
}

// 測試新增資料
async function testCreate(token, table, data) {
  console.log(`新增到 ${table}...`);
  
  try {
    const result = await postAPI(`/api/admin/create/${table}`, data, token);
    
    if (result.success) {
      console.log('新增成功');
      return true;
    } else {
      console.log('新增失敗:', result.error || result);
      return false;
    }
  } catch (error) {
    console.log('新增失敗:', error.message);
    return false;
  }
}

// 測試修改資料
async function testUpdate(token, table, conditions, updateData) {
  console.log(`修改 ${table}...`);
  
  try {
    const result = await putAPI(`/api/admin/update/${table}`, { conditions, data: updateData }, token);
    
    if (result.success) {
      console.log('修改成功');
      return true;
    } else {
      console.log('修改失敗:', result.error || result);
      return false;
    }
  } catch (error) {
    console.log('修改失敗:', error.message);
    return false;
  }
}

// 測試刪除資料
async function testDelete(token, table, conditions) {
  console.log(`刪除 ${table}...`);
  
  try {
    const result = await deleteAPI(`/api/admin/delete/${table}`, conditions, token);
    
    if (result.success) {
      console.log('刪除成功');
      return true;
    } else {
      console.log('刪除失敗:', result.error || result);
      return false;
    }
  } catch (error) {
    console.log('刪除失敗:', error.message);
    return false;
  }
}

// 查詢資料 (用來確認操作結果)
async function queryData(token, table, params = '') {
  console.log(`查詢 ${table} 資料...`);
  
  // 使用複數形式的 API 路徑
  const tableName = table + 's'; // member -> members
  const endpoint = `/api/admin/${tableName}${params ? '?' + params : ''}`;
  
  try {
    const data = await getAPI(endpoint, token);
    
    if (data && Array.isArray(data)) {
      console.log(`查詢成功，共 ${data.length} 筆資料`);
      return data;
    } else {
      console.log('查詢失敗:', data.error || data);
      return null;
    }
  } catch (error) {
    console.log('查詢失敗:', error.message);
    return null;
  }
}

// 測試批量操作
async function testBatch(token, operations) {
  console.log('\n📦 測試批量操作...');
  console.log('操作列表:', JSON.stringify(operations, null, 2));
  
  try {
    const result = await postAPI('/api/admin/batch', { operations }, token);
    
    if (result.success) {
      console.log('✅ 批量操作成功');
      console.log('結果:', JSON.stringify(result, null, 2));
      return true;
    } else {
      console.log('❌ 批量操作失敗:', result.error || result);
      return false;
    }
  } catch (error) {
    console.log('❌ 批量操作失敗:', error.message);
    return false;
  }
}

// 主要測試函數
async function runCRUDTest(testType = 'member') {
  try {
    console.log(`CRUD 測試 - ${testType}`);
    
    // 登入管理員
    const token = await getAdminToken();
    
    // 根據表格類型準備測試資料
    const timestamp = Date.now().toString().slice(-6);
    const testData = {
      member: {
        create: {
          memberID: 'CRUD' + timestamp,
          memberAccount: 'crud_test_' + timestamp,
          memberPwd: 'test123',
          memberName: 'CRUD測試用戶',
          memberBirth: '1990-01-01',
          memberPhone: '0912345678'
        },
        update: { memberName: 'CRUD測試用戶_已修改', memberPhone: '0987654321' },
        condition: { memberID: 'CRUD' + timestamp }
      },
      
      movie: {
        create: {
          movieID: 'CRUD_TEST',
          movieName: 'CRUD測試電影',
          movieRelease: '2024-01-01',
          movieCategory: '測試',
          movieDuration: 120
        },
        update: { movieName: 'CRUD測試電影_已修改', movieDuration: 150 },
        condition: { movieID: 'CRUD_TEST' }
      },
      
      cinema: {
        create: {
          cinemaID: 'TEST_CINEMA',
          cinemaName: 'CRUD測試影城',
          cinemaLocation: '測試地點'
        },
        update: { cinemaName: 'CRUD測試影城_已修改' },
        condition: { cinemaID: 'TEST_CINEMA' }
      }
    };
    
    if (!testData[testType]) {
      console.log('❌ 不支援的測試表格');
      console.log('可用選項: member, movie, cinema');
      return;
    }
    
    const data = testData[testType];
    
    
    // 1. 查詢初始狀態
    await queryData(token, testType);
    
    // 2. 測試新增
    const createSuccess = await testCreate(token, testType, data.create);
    
    // 3. 查詢確認新增
    if (createSuccess) {
      await queryData(token, testType);
    }
    
    // 4. 測試修改
    if (createSuccess) {
      await testUpdate(token, testType, data.condition, data.update);
    }
    
    // 5. 查詢確認修改
    if (createSuccess) {
      await queryData(token, testType);
    }
    
    // 6. 測試刪除
    if (createSuccess) {
      await testDelete(token, testType, data.condition);
    }
    
    // 7. 查詢確認刪除
    await queryData(token, testType);
    
    console.log('CRUD 測試完成');
    
  } catch (error) {
    console.error('測試錯誤:', error.message);
  }
}

// 批量操作測試
async function runBatchTest() {
  try {
    console.log('🎯 管理員批量操作測試');
    console.log('════════════════════════════════════════');
    
    const token = await getAdminToken();
    
    // 準備批量操作
    const operations = [
      {
        type: 'create',
        table: 'member',
        data: {
          memberID: 'BATCH001',
          memberAccount: 'batch_user1',
          memberPwd: 'batch123',
          memberName: '批量用戶1',
          memberBirth: '1990-01-01',
          memberPhone: '0912000001'
        }
      },
      {
        type: 'create',
        table: 'member',
        data: {
          memberID: 'BATCH002',
          memberAccount: 'batch_user2',
          memberPwd: 'batch123',
          memberName: '批量用戶2',
          memberBirth: '1990-01-02',
          memberPhone: '0912000002'
        }
      },
      {
        type: 'update',
        table: 'member',
        conditions: { memberID: 'BATCH001' },
        data: { memberName: '批量用戶1_已修改' }
      },
      {
        type: 'delete',
        table: 'member',
        conditions: { memberID: 'BATCH002' }
      }
    ];
    
    await testBatch(token, operations);
    
    // 查詢結果
    await queryData(token, 'member');
    
    // 清理測試資料
    await testDelete(token, 'member', { memberID: 'BATCH001' });
    
    console.log('\n🎉 批量操作測試完成！');
    
  } catch (error) {
    console.error('\n🚨 批量測試過程發生錯誤:', error.message);
  }
}

// 執行測試
const args = process.argv.slice(2);
const command = args[0] || 'member';

if (command === 'batch') {
  runBatchTest().catch(console.error);
} else if (command === 'help') {
  console.log('\n📋 管理員 CRUD 測試工具使用說明');
  console.log('════════════════════════════════════════');
  console.log('node admin_crud_test.js [選項]');
  console.log('\n📊 單表格 CRUD 測試:');
  console.log('  member    - 測試會員資料 CRUD');
  console.log('  movie     - 測試電影資料 CRUD');
  console.log('  cinema    - 測試影城資料 CRUD');
  console.log('\n📦 批量操作測試:');
  console.log('  batch     - 測試批量操作功能');
  console.log('\n💡 使用範例:');
  console.log('  node admin_crud_test.js member');
  console.log('  node admin_crud_test.js movie');
  console.log('  node admin_crud_test.js batch');
} else {
  runCRUDTest(command).catch(console.error);
}