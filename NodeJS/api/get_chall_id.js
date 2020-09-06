const { app, fs } = require('./../lib/basic_includes.js');

app.get('/api/get/challenge_id/:vuln_type', (req,res) => {
    let data = fs.readFileSync('./storage/trust.json');
    let json = JSON.parse(data);

    let vuln_type = req.params.vuln_type;

    let obj_json = json.vulnerability_type[vuln_type];

    if(vuln_type !== "XSS" && vuln_type !== "SQL" && vuln_type !== "CSRF" && vuln_type !== "LFI")
    {
        return res.json({
            message: 'Erreur de type de vulérabilité !'
        });
    }

    if(obj_json === undefined)
    {
        return res.json({
            message: 'Aucun challenge n\'existe pour ce type de faille !'
        });
    }

    let object = {};

    let stock = [];

    obj_json.forEach(element => {
        let challenge_id = element.challenge_id;
        object = {
            'challenge_id': challenge_id
        }

        stock.push(object);
    });

    return res.json(stock);
});