const jwt = require('jsonwebtoken');
const db = require('../db');

class TokenService {
    generateTokens (payload) {
        console.log('token generate')
        const accessToken = jwt.sign(payload, process.env['JWT_ACCESS_SECRET_KEY'], {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env['JWT_REFRESH_SECRET_KEY'], {expiresIn: '20d'});
        return {
            accessToken,
            refreshToken
        }
    };

    async seveTokens (userId, refreshToken) {
        console.log('token save')
        const tokenData = await db.query(`SELECT * FROM user_token WHERE fk_user_id = ${userId}`);
        if (tokenData.rowCount == 1) {
            const updata = await db.query(`UPDATE user_token SET refresh_token = ${refreshToken} WHERE fk_user_id = ${userId}`);
            return updata;
        }
        const token = await db.query(`INSERT INTO user_token (fk_user_id, refresh_token) VALUES (${userId}, '${refreshToken}') RETURNING *`);
        return token;
    };

    async removeToken (refreshToken) {
        console.log('remove token');
        const tokenData = await db.query(`DELETE FROM user_token WHERE refresh_token = '${refreshToken}' RETURNING *`);
        return tokenData
    };

    async findToken (refreshToken) {
        const tokenData = await db.query(`SELECT * FROM user_token WHERE refresh_token = '${refreshToken}'`);
        console.log(tokenData);
        return tokenData
    };

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env['JWT_ACCESS_SECRET_KEY'])
            return userData;
        } catch (e) {
            return null;
        }
    };

    validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env['JWT_REFRESH_SECRET_KEY'])
            return userData;
        } catch (e) {
            return null;
        }
    };
};

module.exports = new TokenService();