const { app, fs } = require('../lib/basic_includes.js');
const { verifToken, writeDataVerif } = require('../lib/verification.js');

//On wipe les data du fichier submit
app.delete('/api/remove/tickets', (req,res) => {
    verifToken(req,res);

    fs.readFile('./storage/submit.json', function (err, data) {
        let json = JSON.parse(data);
        let obj_arr = json;

        delete obj_arr.vulnerability_type;

        writeDataVerif("./storage/submit.json", json, res);
    });
});