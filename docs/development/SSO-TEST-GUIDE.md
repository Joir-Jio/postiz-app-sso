# SSO 无缝登录测试指南

## 测试环境已准备完成 ✅

### 服务运行状态
- **前端**: http://localhost:4200
- **后端API**: http://localhost:3000
- **SSO登录页面**: http://localhost:4200/seamless-login

## 测试方法

### 方法1: 使用测试脚本（推荐）
已创建测试脚本 `test-sso-login.js`，运行命令：
```bash
node test-sso-login.js
```

### 方法2: 浏览器直接访问
在浏览器中打开以下任一URL：

1. **基础测试URL**
   ```
   http://localhost:4200/seamless-login?token=test_sso_token_1234567890
   ```

2. **带完整参数的测试URL**
   ```
   http://localhost:4200/seamless-login?token=test_sso_token_1234567890&challenge=test_challenge&state=test_state
   ```

### 方法3: 使用cURL测试API端点

1. **测试令牌验证**
   ```bash
   curl -X POST http://localhost:3000/sso/validate-token \
     -H "Content-Type: application/json" \
     -d '{"token":"test_sso_token_1234567890"}'
   ```

2. **测试SSO登录**
   ```bash
   curl -X POST http://localhost:3000/sso/token-login \
     -H "Content-Type: application/json" \
     -d '{
       "token":"test_sso_token_1234567890",
       "productKey":"postiz",
       "redirectUrl":"/launches"
     }'
   ```

## 预期结果

### API响应
- **Token验证成功**：返回 `{valid: true, user: {...}}`
- **SSO登录成功**：返回 `{success: true, accessToken: "...", user: {...}}`

### 前端行为
1. 访问无缝登录URL后，页面会显示"Setting up your session..."
2. 自动验证token并完成登录
3. 登录成功后会重定向到主应用页面

## 当前实现状态

### ✅ 已实现
- SSO token验证端点 `/sso/validate-token`
- SSO token登录端点 `/sso/token-login`
- 前端无缝登录页面
- 基础的token验证逻辑

### ⚠️ 待完善
- 实际的JWT令牌验证（当前为模拟验证）
- 与外部产品的令牌交换机制
- 用户权限和产品访问控制
- 令牌过期和刷新机制

## 集成指南

外部产品集成时，需要：
1. 生成符合格式的SSO令牌
2. 将用户重定向到：`http://your-domain/seamless-login?token=<SSO_TOKEN>`
3. 可选参数：
   - `challenge`: 安全挑战码
   - `state`: 状态参数，用于防CSRF
   - `redirectUrl`: 登录成功后的重定向地址

## 安全注意事项
- 生产环境需要实现真实的令牌验证
- 添加令牌签名验证
- 实现令牌过期机制
- 添加IP白名单或其他安全措施