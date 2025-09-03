'use client';

import { useState } from 'react';

// 正确的Cookie设置函数
function setCookie(cname: string, cvalue: string, exdays: number) {
  if (typeof document === 'undefined') {
    return;
  }
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export default function SsoTestPage() {
  const [ssoToken, setSsoToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateNewToken = () => {
    // 生成带时间戳的新令牌，避免用户冲突
    const timestamp = Date.now();
    const newPayload = {
      userId: `sso_user_${timestamp}`,
      email: `sso${timestamp}@test.com`,
      name: `SSO Test User ${timestamp}`,
      mediaStorage: {
        provider: 'gcs',
        bucket: 'hyperhusk01-result-bucket',
        path: '62152016094'
      },
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      iat: Math.floor(Date.now() / 1000)
    };
    
    // 简化的JWT生成（仅用于演示，实际应该在后端生成）
    const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
    const payload = btoa(JSON.stringify(newPayload));
    
    // 模拟签名（实际中需要正确的HMAC）
    setSsoToken(`${header}.${payload}.demo_signature_${timestamp}`);
  };

  const handleSsoLogin = async () => {
    if (!ssoToken.trim()) {
      alert('请输入SSO令牌');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 如果是演示令牌，直接模拟成功响应
      if (ssoToken.includes('demo_signature_')) {
        // 模拟成功登录
        const mockUser = {
          id: `demo_${Date.now()}`,
          email: `demo${Date.now()}@test.com`,
          name: `Demo User ${Date.now()}`,
          role: 'user',
          mediaStorage: {
            provider: 'gcs',
            bucket: 'hyperhusk01-result-bucket',
            path: '62152016094',
            fullPath: 'hyperhusk01-result-bucket/62152016094'
          }
        };
        
        // 演示模式：生成简单的base64令牌
        const mockToken = btoa(JSON.stringify(mockUser));
        
        setResult({
          success: true,
          accessToken: mockToken,
          user: mockUser,
          mediaStoragePath: 'hyperhusk01-result-bucket/62152016094'
        });

        // 设置认证cookie
        setCookie('auth', mockToken, 365);
        
        // 延迟跳转到主应用，使用URL参数确保认证状态
        setTimeout(() => {
          window.location.href = `/launches?loggedAuth=${encodeURIComponent(mockToken)}`;
        }, 2000);
        
        return;
      }

      // 调用真实的SSO登录端点
      const response = await fetch('http://localhost:3000/sso/token-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: ssoToken.trim() }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.accessToken) {
        // 设置认证cookie
        setCookie('auth', data.accessToken, 365);
        
        // 延迟跳转到主应用，使用URL参数确保认证状态
        setTimeout(() => {
          window.location.href = `/launches?loggedAuth=${encodeURIComponent(data.accessToken)}`;
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : '网络错误'
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzc29fdXNlcl8xNzU2NDI3MjU1MDI5IiwiZW1haWwiOiJzc28xNzU2NDI3MjU1MDI5QHRlc3QuY29tIiwibmFtZSI6IlNTTyBUZXN0IFVzZXIgMTc1NjQyNzI1NTAyOSIsIm1lZGlhU3RvcmFnZSI6eyJwcm92aWRlciI6ImdjcyIsImJ1Y2tldCI6Imh5cGVyaHVzazAxLXJlc3VsdC1idWNrZXQiLCJwYXRoIjoiNjIxNTIwMTYwOTQifSwiZXhwIjoxNzU2NTEzNjU1LCJpYXQiOjE3NTY0MjcyNTV9.qwm1-ZjL33EbNNjMwC2t2cjiEWXtsj8VCh6pcTESbKM';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🚀 SSO测试登录页面
        </h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SSO令牌:
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={4}
            value={ssoToken}
            onChange={(e) => setSsoToken(e.target.value)}
            placeholder="请粘贴你的SSO JWT令牌..."
          />
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <button
            onClick={() => setSsoToken(defaultToken)}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            📝 使用测试令牌
          </button>
          <button
            onClick={generateNewToken}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            🔄 生成新演示令牌（推荐）
          </button>
        </div>

        <button
          onClick={handleSsoLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading || !ssoToken.trim()}
        >
          {loading ? '🔄 SSO登录中...' : '🎯 SSO登录'}
        </button>

        {result && (
          <div className="mt-4 p-4 rounded-md">
            {result.success ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">
                <h3 className="font-semibold mb-2">✅ 登录成功!</h3>
                <p className="text-sm mb-2">👤 用户: {result.user?.name} ({result.user?.email})</p>
                <p className="text-sm mb-2">📦 存储路径: {result.mediaStoragePath}</p>
                <p className="text-sm">🚀 正在跳转到主应用...</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
                <h3 className="font-semibold mb-2">❌ 登录失败</h3>
                <p className="text-sm">{result.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          <p className="font-semibold mb-2">🔧 测试说明:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>点击"使用测试令牌"自动填充测试令牌</li>
            <li>或者手动粘贴你的SSO令牌</li>
            <li>成功后会自动跳转到应用主页面</li>
            <li>包含GCS媒体存储配置信息</li>
          </ul>
        </div>
      </div>
    </div>
  );
}