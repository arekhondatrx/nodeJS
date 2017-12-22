const {InternalError, NotFoundError} = require('../app/ERRORS');
const proxyquire = require('proxyquire');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;



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
            fileRepo.fileList().then((read) => {
                expect(read.length).to.equal(4);
                done();
            }).catch((err) => {
                done(err);
            })
        });

        it('should return empty array  when directory is empty', (done) => {
            const fileRepo = initFileRepository(null, []);
            fileRepo.fileList().then(read => {
                expect(read.length).to.equal(0);
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should reject with expected error type when error occur', (done) => {
            const fileRepo = initFileRepository(1, []);
            fileRepo.fileList().then(read => {
                done(new Error("unexpected resolve"));
            }).catch(err => {
                expect(err instanceof InternalError)
                done();
            });
        });
    });

    describe('read method', () => {

        it('should return string when file exist', (done) => {
            const fileRepo = initFileRepository(null, "jakaś przykładowa zawrtość pliku");
            fileRepo.read('t.txt').then(read => {
                expect(read).to.be.a('string');
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should reject with expected error type when file not exist', (done) => {
            const fileRepo = initFileRepository(1, "");
            fileRepo.read('t.txt').then(read => {
                done(new Error("unexpected resolve"));
            }).catch(err => {
                expect(err instanceof NotFoundError)
                done();
            });
        });
    });

    describe('create method', () => {

        it('should return string when file was created', (done) => {
            const fileRepo = initFileRepository(null);
            fileRepo.create("jakaś zawrtość", "nazwapliku").then(read => {
                expect(read).to.be.a('string');
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should reject with expected error type when error occur', (done) => {
            const fileRepo = initFileRepository(1, "");
            fileRepo.create("jakaś zawrtość", "nazwapliku").then(read => {
                done(new Error("unexpected resolve"));
            }).catch(err => {
                expect(err instanceof InternalError)
                done();
            });
        });

    });

    describe('deleteFile method', () => {

        it('should return string when file was deleted', (done) => {
            const fileRepo = initFileRepository(null);
            fileRepo.deleteFile("nazwapliku").then(read => {
                expect(read).to.be.a('string');
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should reject with expected error type when file not exist', (done) => {
            const fileRepo = initFileRepository(1, "");
            fileRepo.deleteFile("nazwapliku").then(read => {
                done(new Error("unexpected resolve"));
            }).catch(err => {
                expect(err instanceof NotFoundError)
                done();
            });
        });

    });

});