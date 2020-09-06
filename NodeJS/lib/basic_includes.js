const express = require('express');
const app = express();
const fs = require('fs');

//On paramètre la requête body
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

module.exports = {
    express,
    app,
    fs
};