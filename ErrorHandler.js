const errors = require('./ERRORS');

module.exports = (err, res) =>{

    let responseContent = { }

    if(err instanceof errors.HttpError){
      res.statusCode = err.statusCode;
      responseContent.message = err.message;
  }
  else
    {
        responseContent.message = "unkown error";
        res.statusCode = 500;
    }

    res.json(responseContent);
  };