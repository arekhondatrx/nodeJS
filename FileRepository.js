const fs = require('fs');
const {InternalError, NotFoundError} = require('../app/ERRORS');

class FileRepository {

    constructor(root_path = './files/'){
        this.root_path = root_path;

    }

    exist(file_id){

        if(fs.existsSync(this.root_path + file_id)){
            return true
        }
        else{
            return false;
        }
    }

    fileList(){
        return new Promise( (resolve, reject) => {
            fs.readdir(this.root_path, (err, files) => {
                if (err) reject(new InternalError("Katalog: " + this.root_path + " nie istnieje"));
                else resolve(files);
            });
        });
    }

    read(file_id){
        return new Promise( (resolve, reject) => {
            fs.readFile(this.root_path + file_id, 'utf8', (err, data) => {
                if (err) reject(new NotFoundError('Nie można odczytać pliku:' + file_id + ' ponieważ nie istnieje'))
                else resolve(data);
            });
        });
    }

    create(content, file_id){
        return new Promise( (resolve, reject) => {
            fs.writeFile(this.root_path + file_id, content, 'utf8', (err) => {
                if(err) reject(new InternalError("Błąd"));
                resolve("Utworzono plik: " + file_id);
            });
        });
    }

    deleteFile(file_id){
        return new Promise((resolve, reject) => {
            fs.unlink(this.root_path + file_id, (err) => {
                if(err) reject(new NotFoundError('Nie można usunąć pliku: ' + file_id + ' ponieważ nie istnieje'));
                resolve("usunięto plik: " + file_id);
            });
        });
    }
}

module.exports = FileRepository;