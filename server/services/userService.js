const db = require('../db');
const uuid = require('uuid');
const objectHash = require('object-hash');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDTO');
const ApiError = require('../exceptions/api.error');
const helper = require('../helper');

class UserService {
    async registration (data) {
        console.log(data)
        const condidate = await db.query(`SELECT * FROM users WHERE email='${data.email}'`);
        let isAdmin = false;

        if (condidate.rowCount == 1) throw new Error('User has alredy existed');
        if (data.password === process.env['ADMIN_LOGIN'] & data.email === process.env['ADMIN_PASSWORD']) isAdmin = true;

        const hashPassword = objectHash.sha1(data.password);
        const activationLink = uuid.v4();

        const user = await db.query(`INSERT INTO users (email, password, activationlink, isadmin, name, phone, isactivated) VALUES ('${data.email}', '${hashPassword}', '${activationLink}', '${isAdmin}', '${data.name}', '${data.phone}', 'false') RETURNING *;`);
        // await mailService.sendActivationLinnk(data.email, `${process.env['API_URL']}/api/activate/${activationLink}`);

        const result = await helper.saveToken(user);
        return result;
    };

    async activate (activationLink) {
        const user = await db.query(`SELECT * FROM users WHERE activationlink = ${activationLink}`);
        if (user.rowCount === 0) throw new Error('User has not sign in yet');
        await db.query(`UPDATE users SET isactivated = '${true}', activationlink = null WHERE user_id = ${user.rows[0]['user_id']}`);
    };

    async login (email, password) {
        try {
            const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
            console.log(user);
            if (user.rowCount === 0) throw ApiError.BadRequest('User has been found');
            if (objectHash.sha1(password) !== user.rows[0]['password']) throw ApiError.BadRequest('Wrong password');
        
            const data = await helper.saveToken(user);
            return data;
        } catch (e) {
            return null;
        }
    };

    async logout (refreshToken) {
        console.log('log out');
        const token = await tokenService.removeToken(refreshToken);
        return token;
    };

    async refresh (refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (tokenFromDb.rowCount === 0 || !userData) throw ApiError.UnauthorizedError();

        const user = await db.query(`SELECT * FROM users WHERE user_id = ${userData.id}`);
        
        const data = await helper.saveToken(user);
        return data;
    };

    async getuser (refreshToken) {
        console.log('get user');
        const tokenData = await tokenService.findToken(refreshToken);
        if (tokenData.rowCount === 0) return null;
        const userId = tokenData.rows[0]['fk_user_id'];
        console.log('token', userId, tokenData)
        const user = await db.query(`SELECT * FROM users WHERE user_id = ${userId}`);
        console.log('user')
        return user.rows[0];
    }
};

module.exports = new UserService();