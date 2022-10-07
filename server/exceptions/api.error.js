module.exports = class ApiError extends Error {
    constructor (status, massage, errors =  []) {
        super(massage);
        this.status = status, 
        this.errors = errors
    }

    static UnauthorizedError () {
        return new ApiError(401, 'User do not auth')
    };

    static BadRequest (message, status, errors = []) {
        return new ApiError(400, message, errors);
    }
}