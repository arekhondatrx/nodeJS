const {InternalError, NotFoundError} = require('../app/ERRORS');
const proxyquire = require('proxyquire');
var chaiaspromise = require('chai-as-promised');
var chai = require('chai');
chai.use(chaiaspromise);

chai.should();

function initFileRepository(err, files){
    const FileRepository = proxyquire('../app/FileRepository', {
        fs: {
            readdir: (dir, calback) => {
                calback(err, files);
            },
            readFile: (dir, format, calback) => {
                calback(err, files);
            },
            writeFile: (dir, content, format, calback) => {
                calback(err);
            },
            unlink: (dir, calback) => {
                calback(err);
            },
            existsSync: (dir) => {
            }
        }
    });

    return new FileRepository();
}

describe('FileRepository class', () => {

    describe('fileList method', () => {

        it('should return expected numbers of file when directory is not empty', (done) => {
            const fileRepo = initFileRepository(null, ['a','b','c','d']);
            fileRepo.fileList().should.eventually.be.lengthOf(4).notify(done);
        });

        it('should return expected numbers of file when directory is not empty', (done) => {
            const fileRepo = initFileRepository(null, []);
            fileRepo.fileList().should.eventually.be.lengthOf(0).notify(done);
        });

        it('should reject with expected error type when error occur', (done) => {
            const fileRepo = initFileRepository(1, ['a','b','c','d']);
            fileRepo.fileList().should.be.rejectedWith(InternalError).notify(done);
        });

    });

    describe('read method', () => {

        it('should return string when file exist', (done) => {
            const fileRepo = initFileRepository(null, "jakaś przykładowa zawrtość pliku");
            fileRepo.read("t111.txt").should.eventually.be.a('string').notify(done);
        });

        it('should reject with expected error type when file not exist', (done) => {
            const fileRepo = initFileRepository(1, ['a','b','c','d']);
            fileRepo.read().should.eventually.be.rejectedWith(NotFoundError).notify(done);
        });
    });

    describe('create method', () => {

        it('should return string when file was created', (done) => {
            const fileRepo = initFileRepository(null, "jakaś przykładowa zawrtość pliku");
            fileRepo.create("jakas zawrtosc", "t.txt").should.eventually.be.a('string').notify(done);
        });

        it('should reject with expected error type when error occur', (done) => {
            const fileRepo = initFileRepository(1, ['a','b','c','d']);
            fileRepo.create().should.eventually.be.rejectedWith(InternalError).notify(done);
        });

    });

    describe('deleteFile method', () => {

        it('should return string when file was deleted', (done) => {
            const fileRepo = initFileRepository(null, "jakaś przykładowa zawrtość pliku");
            fileRepo.deleteFile("t.txt").should.eventually.be.a('string').notify(done);
        });

        it('should reject with expected error type when file not exist', (done) => {
            const fileRepo = initFileRepository(1, ['a','b','c','d']);
            fileRepo.deleteFile().should.eventually.be.rejectedWith(NotFoundError).notify(done);
        });

    });
    
});