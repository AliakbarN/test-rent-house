const ApiError = require("../exceptions/api.error");
const tokenService = require("../services/tokenService");

module.exports = function (req, res, next) {
   try {
        const authHeader = req.headers['autorization'];
        if (!authHeader) {
            res.status(203);
            return next();
 //next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            res.status(203);
            return next();
 //next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            res.status(203);
            return next();
 //next(ApiError.UnauthorizedError());
        }
        
        req.user = userData;
        res.status(200);
        next();
    } catch (e) {
        //return next(ApiError.UnauthorizedError());
    }
}