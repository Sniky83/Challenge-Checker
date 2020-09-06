const { app, fs } = require('./../lib/basic_includes.js');
const { verifChamps, writeDataVerif } = require('./../lib/verification.js');

//On ecrit dans le fichier submit.json
//On vérifie les données qui sont envoyés par le formulaire
app.post('/api/new/ticket', (req, res) => {
    let reqData = JSON.parse(req.body);

    let vuln_type = reqData.vulnerability_type;
    let challenge_id = reqData.challenge_id;
    let username = reqData.username;
    let payload = reqData.data;

    let state = verifChamps(vuln_type, username, challenge_id, payload, res);

    //Si y'a des anomalies lors des vérif on quitte l'app
    if(state === true)
        return 0;

    let data_raw = fs.readFileSync('./storage/trust.json');
    let json = JSON.parse(data_raw);
    let obj_arr = json.vulnerability_type[vuln_type];

    state = false;

    //On regarde que les données trust soient compatibles avec les données user
    obj_arr.forEach(element => { 
        if(element.challenge_id === challenge_id)
        {
            //let base_url = element.base_url;
            state = true;
        }
    });
    
    //Si le challenge ID existe bien dans la liste Trust
    if(state === true)
    {
        var state2 = false;

        //On vérifie d'abord que les data ne soient pas déjà dans le fichier user
        let data = fs.readFileSync('./storage/user.json')
        let json = JSON.parse(data);

        let obj = json.vulnerability_type;

        //Le fichier est vide
        if(obj !== undefined)
        {
            let obj_arr = json.vulnerability_type[vuln_type];

            if(obj_arr !== undefined)
            {
                //On récupère l'index de l'utilisateur actuel
                obj_arr.forEach(element => {
                    if(username === Object.keys(element)[0])
                    {
                        element[username].forEach(element2 => {
                            if(element2.challenge_id === challenge_id)
                            {
                                state2 = true;
                                return res.json({
                                    message: "Vous avez déjà validé ce challenge !"
                                });
                            }
                        });
                    }
                });

                //On return de la fonction callback du coup on doit return ici pour quitter l'app
                if(state2 === true)
                    return 0;
            }
        }
        
        //On écrit dans le fichier JSON les data que le python va lire
        fs.readFile('./storage/submit.json', function (err, data) {
            json = JSON.parse(data);

            let object = json.vulnerability_type;

            //On bloque l'insertion de code malveillant
            username = username.replace(/[^a-zA-Z0-9]/g,'');

            //Si le fichier est clear alors on fait la première insertion
            if(object === undefined)
            {
                let object = { 
                    'vulnerability_type':
                        {
                            [vuln_type]: [
                                {
                                    [challenge_id]: [
                                        {
                                            'username': username,
                                            'data': payload
                                        }
                                    ]
                                }
                            ]
                        }
                 };
                 writeDataVerif("./storage/submit.json", object, res);

                //On quitte car on veut pas que les data soient ré-écrites plus bas
                return 0;
            }
            else if(object[vuln_type] === undefined)
            {
                //Le fichier n'est pas vide par contre un nouveau type de challenge vient d'arriver
                let obj = {};

                obj = [{
                    [challenge_id]: [
                        {
                            'username': username,
                            'data': payload
                        }
                    ]
                }];

                object[vuln_type] = obj;
            }
            else
            {
                //Re-création du challenge_id et ce qui va avec
                let obj_arr = json.vulnerability_type[vuln_type];

                let state = false;
                let index = 0;
                let temp = 0;
    
                //Si on trouve le challenge ID dans la liste
                obj_arr.forEach(element => {
                    if(challenge_id == Object.keys(element)[0])
                    {
                        index = temp;
                        state = true;
                    }
                    temp = temp + 1;
                });

                //Ca veut dire qu'on a clear le fichier et qu'il faut le re-construire
                //Le challenge ID n'est pas dans la liste
                //Donc on fait une insertion complete avec le challenge ID
                if(state === false)
                {
                    let obj_arr = json.vulnerability_type[vuln_type];

                    let object = {
                        [challenge_id]: [
                            {
                                'username': username,
                                'data': payload
                            }
                        ]
                    };

                    obj_arr.push(object);
                }
                else
                {
                    //On insère un utilisateur associé a sa vulnérabilité et a son
                    //challenge_id déja présent dans la liste
                    let obj_arr = json.vulnerability_type[vuln_type][index][challenge_id];

                    let state = false;

                    //On check si l'user existe deja dans la liste
                    obj_arr.forEach(element => {
                        if(username === element.username)
                        {
                            state = true;
                        }
                    });

                    //Il n'y a pas de duplicat donc on insère au bon endroit
                    if(state === false)
                    {
                        let obj = {
                            'username': username,
                            'data': payload
                        };
                        
                        //On ajoute un nouvel USER dans la liste des tickets
                        obj_arr.push(obj);
                    }
                    else
                    {
                        return res.json({
                            message: 'Veuillez attendre la validation avant de pouvoir réessayer !'
                        });
                    }
                }
            }
            writeDataVerif("./storage/submit.json", json, res);
        });
    }
    else
    {
        return res.json({
            message: 'Challenge ID introuvable !'
        });
    }
});