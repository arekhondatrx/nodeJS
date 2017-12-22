success = (res, data, status_code) => {
    res.statusCode = status_code;
    res.json({data : data});
}

module.exports.success = success;
