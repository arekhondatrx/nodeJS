const {InternalError, NotFoundError} = require('../app/ERRORS');
const proxyquire = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;

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

describe('FileRepository', function() {

    describe('fileList method', () => {

        it('should return expected numbers of files when directory is not empty', (done) => {
            const fileRepo = initFileRepository(null, ['a','b','c','d']);
            fileRepo.fileList().then(read => {
               assert.isAbove(read.length, 0);
               done();
            }).catch(err => {
                done(err);
            });
        });

        it('should return empty array  when directory is empty', (done) => {
            const fileRepo = initFileRepository(null, []);
            fileRepo.fileList().then(read => {
                assert.equal(read.length, 0);
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
                assert(err instanceof InternalError)
                done();
            });
        });

    });

    describe('read method', () => {

        it('should return string when file exist', (done) => {
            const fileRepo = initFileRepository(null, "jakaś przykładowa zawrtość pliku");
            fileRepo.read('t.txt').then(read => {
               assert.typeOf(read, 'string');
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
                assert(err instanceof NotFoundError)
                done();
            });
        });
    });

    describe('create method', () => {

        it('should return string when file was created', (done) => {
            const fileRepo = initFileRepository(null);
            fileRepo.create("jakaś zawrtość", "nazwapliku").then(read => {
                assert.typeOf(read, 'string');
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
                assert(err instanceof InternalError)
                done();
            });
        });

    });

    describe('deleteFile method', () => {

        it('should return string when file was deleted', (done) => {
            const fileRepo = initFileRepository(null);
            fileRepo.deleteFile("nazwapliku").then(read => {
                assert.typeOf(read, 'string');
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
                assert(err instanceof NotFoundError)
                done();
            });
        });

    });

    describe('exist method', () => {

        it('should retutn true when file exists', (done) => {
            //const existsSyncStub = sinon.stub().returns(false);
            const fsProxy = {fs: {
                existsSync: ()=> {
                    console.log("wlazłe,m do ");
                }
            }}
            const existsSyncSpy = sinon.spy(fsProxy.fs,"existsSync");
            const FileRepository = proxyquire('../app/FileRepository', {
                fs: fsProxy
            });

            const fileRepo = new FileRepository();
            let result = fileRepo.exist("nazwapliku");
            assert(result);
            done();
        });

        it('should retutn false when file exist', (done) =>{
            const fileRepo = initFileRepository();
            let result = fileRepo.exist("nazwapliku");
            assert.equal(result, false);
            done();
        });

    });
});