# 🎯 Postiz SSO + 媒体存储集成完成指南

## ✅ 已完成的功能

### 1. SSO 登录系统
- **JWT 令牌验证**: 完整的 JWT 令牌解析和验证
- **用户认证**: 支持用户基本信息、角色、组织等
- **媒体存储配置**: SSO 令牌包含用户专属的存储路径配置

### 2. GCS 存储集成
- **用户特定存储**: 每个用户有独立的 GCS 存储路径
- **配置管理**: 支持用户级别的存储配置
- **服务账号密钥**: 自动加载用户专属的服务账号密钥

### 3. 目录结构
```
postiz-app-sso/
├── keys/                                    # GCS 服务账号密钥目录
│   ├── README.md                           # 密钥使用说明
│   ├── 62152016094-service-account.json    # Alice 的 GCS 密钥 
│   └── K7mN9pQx2R-service-account.json    # Bob 的 GCS 密钥
├── apps/backend/src/
│   ├── api/routes/sso-login.controller.ts  # SSO 登录控制器
│   └── services/media/user-media.service.ts # 用户媒体服务
└── libraries/nestjs-libraries/src/upload/
    └── user-storage.factory.ts            # 用户存储工厂
```

## 🔧 配置说明

### 环境变量 (.env)
```bash
# 存储提供商设置为 GCS
STORAGE_PROVIDER="gcs"

# SSO 密钥
SSO_SECRET="your-shared-sso-secret-key"

# GCS 基础配置
GCS_PROJECT_ID="hyperhusk-project"
GCS_BUCKET_NAME="hyperhusk01-result-bucket"
GCS_REGION="us-central1"
GCS_MAX_FILE_SIZE="524288000"  # 500MB
GCS_ENABLE_CACHING="true"
```

### 用户存储路径
- **用户 Alice (62152016094)**: `hyperhusk01-result-bucket/62152016094`
- **用户 Bob (K7mN9pQx2R)**: `hyperhusk01-result-bucket/K7mN9pQx2R-DEV/2`

## 🚀 如何使用

### 1. 将真实的 GCS 密钥文件放入 keys/ 目录
```bash
# 替换示例文件为真实的服务账号密钥
keys/62152016094-service-account.json    # Alice 的真实密钥
keys/K7mN9pQx2R-service-account.json    # Bob 的真实密钥
```

### 2. 更新 .env 中的 SSO_SECRET
```bash
# 确保与外部应用使用相同的密钥
SSO_SECRET="your-actual-shared-sso-secret-key"
```

### 3. 测试 SSO 登录
使用生成的测试 URL:
```
# Alice (管理员权限)
http://localhost:4200/seamless-login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsInNyYyI6Imh5cGVyaHVzay1zc28iLCJ2ZXIiOiIxLjAifQ.eyJ1c2VySWQiOiI2MjE1MjAxNjA5NCIsImVtYWlsIjoiYWxpY2VAaHlwZXJodXNrLmNvbSIsIm5hbWUiOiJBbGljZSBKb2huc29uIiwiYXZhdGFyIjoiaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0OTQ3OTAxMDg3NTUtMjYxNmI2MTJiNzg2P3c9MTUwIiwib3JnYW5pemF0aW9uSWQiOiJvcmctaHlwZXJodXNrIiwicm9sZSI6ImFkbWluIiwicHJvZHVjdEtleSI6Imh5cGVyaHVzay12aWRlby1lZGl0b3IiLCJtZWRpYVN0b3JhZ2UiOnsicHJvdmlkZXIiOiJnY3MiLCJidWNrZXQiOiJoeXBlcmh1c2swMS1yZXN1bHQtYnVja2V0IiwicGF0aCI6IjYyMTUyMDE2MDk0IiwicmVnaW9uIjoidXMtY2VudHJhbDEiLCJjb25maWciOnsicHJvamVjdElkIjoiaHlwZXJodXNrLXByb2plY3QiLCJrZXlGaWxlIjoiL2tleXMvNjIxNTIwMTYwOTQtc2VydmljZS1hY2NvdW50Lmpzb24ifX0sInBlcm1pc3Npb25zIjp7ImNhblVwbG9hZE1lZGlhIjp0cnVlLCJjYW5EZWxldGVNZWRpYSI6dHJ1ZSwiY2FuU2hhcmVNZWRpYSI6dHJ1ZSwibWF4RmlsZVNpemUiOiI1MDBNQiIsImFsbG93ZWRUeXBlcyI6WyJpbWFnZS8qIiwidmlkZW8vKiIsImF1ZGlvLyoiLCJhcHBsaWNhdGlvbi9wZGYiXX0sImNvbnRleHQiOnsic291cmNlIjoiaHlwZXJodXNrLXZpZGVvLWVkaXRvciIsInNlc3Npb25JZCI6InNlc3NfMTc1NjM2MzI5NTA3Ml8yZ3I1N3hnZCIsInRpbWVzdGFtcCI6IjIwMjUtMDgtMjhUMDY6NDE6MzUuMDcyWiJ9LCJpc3MiOiJoeXBlcmh1c2stdmlkZW8tZWRpdG9yIiwiYXVkIjoicG9zdGl6Iiwic3ViIjoiNjIxNTIwMTYwOTQiLCJleHAiOjE3NTYzNjQxOTUsImlhdCI6MTc1NjM2MzI5NSwibmJmIjoxNzU2MzYzMjk1LCJqdGkiOiJzc29fMTc1NjM2MzI5NTA3M18xMXJxZDZ1dDUifQ.CBh4DZOiYTz3aE4rWGGcoVbSzqRd_rles3tm73uOnbo&redirect_url=%2Flaunches&state=state_1756363295074&challenge=challenge_l8zmpihscc
```

## 📋 功能特性

### SSO 令牌内容
- ✅ 用户基本信息 (ID, 邮箱, 姓名, 头像)
- ✅ 组织和角色信息
- ✅ 媒体存储配置 (提供商, 存储桶, 路径)
- ✅ 权限设置 (上传、删除、文件大小限制)
- ✅ 业务上下文 (来源, 会话ID, 时间戳)
- ✅ JWT 标准字段 (签发者, 接收者, 过期时间等)

### 权限管理
- **管理员** (Alice): 可以上传、删除媒体文件，文件限制 500MB
- **普通用户** (Bob): 可以上传、分享媒体文件，不能删除，文件限制 200MB

### 存储配置
- **自动配置**: SSO 登录时自动配置用户存储
- **路径隔离**: 每个用户有独立的存储路径
- **密钥管理**: 自动加载用户专属的服务账号密钥

## 🔍 调试信息

### 检查后端日志
登录时会看到以下日志:
```
🎫 SSO Token Login attempt: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' }
✅ JWT token verified successfully
✅ Configured GCS storage for user 62152016094: { bucket: 'hyperhusk01-result-bucket', path: '62152016094', keyFile: '/path/to/key.json' }
📦 Media storage configured: hyperhusk01-result-bucket/62152016094
🚀 SSO login successful for user: Alice Johnson (alice@hyperhusk.com)
```

### API 端点测试
```bash
# 验证令牌
curl -X POST http://localhost:3000/sso/validate-token \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE"}'

# SSO 登录
curl -X POST http://localhost:3000/sso/token-login \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN_HERE"}'
```

## 🐛 故障排除

### 1. 媒体不显示
- 检查 GCS 密钥文件是否存在于 `keys/` 目录
- 确认密钥文件格式正确
- 检查 GCS 项目ID 和存储桶名称

### 2. SSO 登录失败
- 检查 `SSO_SECRET` 是否与外部应用一致
- 验证令牌是否未过期 (15分钟有效期)
- 检查令牌是否包含必需字段

### 3. 存储权限错误
- 确认 GCS 服务账号有适当权限
- 检查存储桶是否存在
- 验证项目ID是否正确

## 📁 相关文件

### 核心文件
- `apps/backend/src/api/routes/sso-login.controller.ts` - SSO 登录控制器
- `libraries/nestjs-libraries/src/upload/user-storage.factory.ts` - 用户存储工厂
- `apps/backend/src/services/media/user-media.service.ts` - 用户媒体服务

### 配置文件
- `.env` - 环境变量配置
- `keys/README.md` - 密钥使用说明

### 测试文件
- `generate-test-sso-token.js` - 生成测试令牌
- `example-external-app.js` - 外部应用示例
- `EXTERNAL-INTEGRATION-GUIDE.md` - 集成指南
- `MEDIA-STORAGE-INTEGRATION.md` - 媒体存储指南

现在你的 Postiz SSO + 媒体存储集成已经完全配置好了! 🎉