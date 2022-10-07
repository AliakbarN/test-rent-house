const userService = require('../../services/userService');
const ApiError = require('../../exceptions/api.error');

module.exports = {
    async registration (req, res, next) {
        console.log('registration');
        try {
            const { email, password, name, phone } = req.body;
            const userData = await userService.registration({ email, password, name, phone });

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e, 'IT IS EEE')
        }
    },
    async login (req, res, next) {
        try {
            const { email, password } = req.body;
            console.log(email, password)
            const userData = await userService.login(email, password);
            
            if (!userData) return res.sendStatus(403);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {

        }
    },
    async logout (req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            console.log(refreshToken);
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            console.log('clear token');
            return res.sendStatus(200);
        } catch (e) {

        }
    },
    async refresh (req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {

        }
    },
    async activate (req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            res.redirect(process.env['CLIENT_URL']);
        } catch (e) {

        }
    },
    async getuser (req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            
            if (refreshToken != undefined) {
                console.log('send data');
                const user = await userService.getuser(refreshToken);
                if (!user) return res.status(403).json({});
                return res.status(200).json(user);
            };

            res.status(403).json({});
            
        } catch (e) {
            console.log(e)
        }
    }
} 