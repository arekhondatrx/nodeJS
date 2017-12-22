const {InternalError, NotFoundError, HttpError} = require('../app/ERRORS');
var chaiaspromise = require('chai-as-promised');
var chai = require('chai');
chai.use(chaiaspromise);

chai.should();

describe('ERROR classes', () => {

    describe('HttpError', () => {

        it('should return string when error is call', () => {
           const err = new HttpError("jakaś wiadomość", 400);
           err.message.should.to.be.a('string');
        });

        it('should return statusCode = 400', () => {
            const err = new HttpError("jakaś wiadomość", 400);
            err.statusCode.should.equal(400);
        });
    });

    describe('NotFoundError', () => {

        it('should return string when error is call', () => {
            const err = new NotFoundError("jakaś wiadomość");
            err.message.should.to.be.a('string');
        });

        it('should return statusCode = 404', () => {
            const err = new NotFoundError("jakaś wiadomość");
            err.statusCode.should.equal(404);
        });
    });

    describe('InternalError', () => {

        it('should return string when error is call', () => {
            const err = new InternalError("jakaś wiadomość");
            err.message.should.to.be.a('string');
        });

        it('should return statusCode = 500', () => {
            const err = new InternalError("jakaś wiadomość");
            err.statusCode.should.equal(500);
        });
    });
});