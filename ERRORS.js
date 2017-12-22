class HttpError extends Error{
    constructor(msg, status_code){
        super();
        this.message = msg;
        this.statusCode = status_code;

    }
}

class NotFoundError extends HttpError{
    constructor(msg){
        super(msg, 404);
    }
}

class InternalError extends HttpError{
    constructor(msg) {
        super(msg, 500);
    }
}

module.exports = {
    HttpError,
    NotFoundError,
    InternalError

};
