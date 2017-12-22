var fs = require('fs');


readFileAsync = (dir, file) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(dir + file, 'utf8', (err, data) => {
            resolve(data)
        });
    });
}

getListFileInDirectory = (directory) => {
    return new Promise( (resolve, reject) => {

        fs.readdir(directory, (err, files) => {

            if (err) return reject(err)
            else resolve(files);
        })
    });
}

addFile = (file_name, data) => {
    return new Promise( (resolve, reject) => {

        fs.writeFile('./files/' + file_name + '.txt', data, 'utf8', (err) => {
            if(err) return reject(err);
            resolve("utworzono plik: " + file_name);
        })
    })
}

deleteFile = (file_name) => {
    return new Promise((resolve, reject) => {

        if(fs.existsSync('./files/' + file_name))
        {
            fs.unlinkSync('./files/' + file_name)
            resolve("usunięto plik: " + file_name);
        }
        else
            reject("plik" + file_name + " nie istnieje!!");
    })
}



module.exports.readFileAsync = readFileAsync;
module.exports.getListFileInDirectory = getListFileInDirectory;
module.exports.addFile = addFile;
module.exports.deleteFile = deleteFile;
