const { app, fs } = require('./../lib/basic_includes.js');
const { verifToken } = require('./../lib/verification.js');

//On lit le fichier submit.json
app.get('/api/get/tickets', (req,res) => {
    verifToken(req, res);
    
    let vuln_type;
    let challenge_id;
    let username;
    let payload;
    let base_url = [];
    let challenge_points = [];

    let data_submit = fs.readFileSync('./storage/submit.json');
    let json_submit = JSON.parse(data_submit);

    let data_trust = fs.readFileSync('./storage/trust.json');
    let json_trust = JSON.parse(data_trust);

    let obj_submit = json_submit.vulnerability_type;

    let obj_trust = json_trust.vulnerability_type;

    let array = [];

    let object = {};

    let arr_vuln = [];

    let state = false;

    let index = 0;

    let index2 = 0;

    if(obj_submit === undefined)
    {
        let obj = [{
            "vulnerability_type": "NOK"
        }];
        return res.json(obj);
    }

    //Boucle pour récup les data du fichier submit et trust
    Object.keys(obj_submit).forEach(element => {
        vuln_type = element;
        arr_vuln.push(vuln_type);
        obj_submit[vuln_type].forEach(element2 => {
            challenge_id = Object.keys(element2)[0];
            element2[challenge_id].forEach(element3 => {
                username = element3.username;
                payload = element3.data;
                if(state === false || arr_vuln[index] !== arr_vuln[0])
                {
                    obj_trust[vuln_type].forEach(element4 => {
                        challenge_points.push(element4.challenge_points);
                        base_url.push(element4.base_url);
                    });
                    state = true;
                }
                object = {
                    'vulnerability_type': vuln_type,
                    'challenge_id': parseInt(challenge_id),
                    'username': username,
                    'data': payload,
                    'base_url': base_url[index2],
                    'challenge_points': challenge_points[index2]
                };
                array.push(object);
                index2 = index2 + 1;
            });
        });
        index = index + 1;
    });

    return res.json(array);
});