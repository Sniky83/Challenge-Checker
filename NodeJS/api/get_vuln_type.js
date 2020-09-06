const { app, fs } = require('./../lib/basic_includes.js');

app.get('/api/get/vuln_type', (req,res) => {
    let data = fs.readFileSync('./storage/trust.json');
    let json = JSON.parse(data);

    let obj_json = json.vulnerability_type;

    if(obj_json === undefined)
    {
        return res.json({
            message: 'Aucun challenge n\'existe dans la base de données !'
        });
    }

    let object = {};

    let stock = [];

    Object.keys(obj_json).forEach(element => {
        object = {
            "vulnerability_type": element
        }
        stock.push(object);
    });

    return res.json(stock);
});