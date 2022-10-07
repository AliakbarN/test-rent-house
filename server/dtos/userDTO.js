module.exports = class UserDto {
    constructor (model) {
        this.email = model['email'];
        this.id = model['user_id'];
        this.isActivated = model['isActivated'];
    }
}