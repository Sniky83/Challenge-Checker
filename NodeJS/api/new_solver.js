const { app, fs } = require('./../lib/basic_includes.js');
const { verifToken, writeDataVerif } = require('./../lib/verification.js');

//On écrit un user dans le fichier JSON qui a réussi le chall
app.post('/api/new/solver', (req,res) => {
    verifToken(req,res);
    let reqData = JSON.parse(req.body);
    let challenge_id = reqData.challenge_id;
    let vuln_type = reqData.vulnerability_type;
    let username = reqData.username;

    fs.readFile('./storage/user.json', function (err, data) {
        let json = JSON.parse(data);

        let obj_array = json.vulnerability_type;

        //On va remplir le fichier pour la première fois
        if(obj_array === undefined)
        {
            let obj = {};

            obj = {
                [vuln_type]: [
                    {
                        [username]: [
                            {
                                'challenge_id': challenge_id
                            }
                        ]
                    }
                ]
            };

            json.vulnerability_type = obj;
        }
        else
        {
            let obj_arr = json.vulnerability_type[vuln_type];

            let state = false;

            let index = 0;
            let temp = 0;

            //On ajoute un nouveau type de vulnérabilité
            if(obj_arr === undefined)
            {
                let obj_arr = json.vulnerability_type;
                let obj = {};

                obj = [{
                    [username]: [
                        {
                            'challenge_id': challenge_id
                        }
                    ]
                }];

                obj_arr[vuln_type] = obj;
            }
            else
            {
                //On vérifie si l'user existe deja
                obj_arr.forEach(element => {
                    //On récupère le nom de l'array
                    if(username === Object.keys(element)[0])
                    {
                        index = temp;
                        state = true;
                        return 0;
                    }
                    temp = temp + 1;
                });

                //On stock dans le fichier JSON des gagnants
                if(state === false)
                {
                    let obj = {
                        [username]: [
                            {
                                'challenge_id': challenge_id
                            }
                        ],
                    };

                    //On fait une insertion intégrale
                    obj_arr.push(obj);
                }
                else
                {
                    let obj_arr = json.vulnerability_type[vuln_type][index][username];

                    let obj = {
                        'challenge_id': challenge_id
                    };

                    obj_arr.push(obj);
                }
            }
        }
        writeDataVerif("./storage/user.json", json, res);
    });
});