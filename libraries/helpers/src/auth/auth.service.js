"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
class AuthService {
    static hashPassword(password) {
        return (0, bcrypt_1.hashSync)(password, 10);
    }
    static comparePassword(password, hash) {
        return (0, bcrypt_1.compareSync)(password, hash);
    }
    static signJWT(value) {
        return (0, jsonwebtoken_1.sign)(value, process.env.JWT_SECRET);
    }
    static verifyJWT(token) {
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
    }
    static fixedEncryption(value) {
        const algorithm = 'aes-256-cbc';
        const cipher = crypto_1.default.createCipher(algorithm, process.env.JWT_SECRET);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    static fixedDecryption(hash) {
        const algorithm = 'aes-256-cbc';
        const decipher = crypto_1.default.createDecipher(algorithm, process.env.JWT_SECRET);
        let decrypted = decipher.update(hash, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map