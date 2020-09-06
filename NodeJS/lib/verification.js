const fs = require('fs');

function verifToken(req, res){
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Veuillez utiliser le header \'x-access-token\' !' });
    if (token != 'qhGipVM?rb;akCvdHd:VEsjV3KHxwG1q8jd8J3yn6Yz2F&BN1T') return res.status(401).send({ auth: false, message: 'Mauvais token fourni !' });
}

function verifChamps(vuln_type, username, challenge_id, payload, res)
{
    state = false;
    if(vuln_type !== "XSS" && vuln_type !== "SQL" && vuln_type !== "CSRF" && vuln_type !== "LFI")
    {
        res.json({
            message: 'Erreur de type de vulérabilité !'
        });
        state = true;
    }

    if(typeof username !== 'string')
    {
        res.json({
            message: 'L\'username doit être une chaîne de caractères !'
        });
        state = true;
    }

    if(username.length < 3)
    {
        res.json({
            message: 'Username trop petit (minimum 3 caractères sont attendus) !'
        });
        state = true;
    }
    else if(username.length > 26)
    {
        res.json({
            message: 'Username trop long (maximum 26 caractères sont autorisés) !'
        });
        state = true;
    }

    if(payload.length < 11)
    {
        res.json({
            message: 'Payload trop petit (minimum 11 caractères sont attendus) !'
        });
        state = true;
    }
    else if(payload.length > 255)
    {
        res.json({
            message: 'Payload trop long (maximum 255 caractères sont autorisés) !'
        });
        state = true;
    }
    else if(typeof payload !== 'string')
    {
        res.json({
            message: 'Le payload doit être une chaîne de caractères !'
        });
        state = true;
    }

    if(challenge_id !== parseInt(challenge_id, 10))
    {
        res.json({
            message: 'Le Challenge ID doit être un entier !'
        });
        state = true;
    }

    return state;
}

function writeDataVerif(path, object, res)
{
    fs.writeFile(path, JSON.stringify(object), 'utf8', function (err) {
        if (err) {
            return res.json({
                message: "Problème d'écriture dans le fichier JSON !"
            });
        }

        return res.json({
            message: 'Informations correctement envoyées !'
        });
    });
}

module.exports = {
    verifToken,
    verifChamps,
    writeDataVerif
};