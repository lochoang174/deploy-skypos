class InputError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = "InputError";
        this.statusCode = statusCode;
    }
}
module.exports = InputError;
