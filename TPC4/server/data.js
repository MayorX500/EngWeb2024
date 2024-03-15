const axios = require('axios');
const querystring = require('querystring');

/*
{
    "id": "ID",
    "nome": "NAME",
    "bio": "BIO",
    "dataNasc": "BIRTH",
    "dataObito": "DEATH",
    "periodoId": "PERIOD_ID"
    "periodo": "PERIOD"
}
*/
async function get_composer_information(composer_id) {
    let composer_info = {};

    try {
        const response = await axios.get(`http://localhost:3000/compositores/${composer_id}?_embed=periodo`);
        composer_info = {
            id: response.data['id'],
            name: response.data['nome'],
            bio: response.data['bio'],
            birth: response.data['dataNasc'],
            death: response.data['dataObito'],
            periodId: response.data['periodoId'],
            period: response.data['periodo']
        };
        return composer_info;
    } catch (error) {
        console.error("Failed to fetch composer information:", error.message);
        return null;
    }
}

/*
[
    {
        "id": "ID",
        "nome": "NAME",
        "bio": "BIO",
        "dataNasc": "BIRTH",
        "dataObito": "DEATH",
        "periodoId": "PERIOD_ID"
        "periodo": "PERIOD"
    }
]
*/
async function get_composers(queryObject){
    let composers = [];

    try {
        const response = await axios.get('http://localhost:3000/compositores' + queryObject);
        if (response.status === 200) {
            for (const composer of response.data) {
                composers.push({
                    id: composer['id'],
                    name: composer['nome'],
                    bio: composer['bio'],
                    birth: composer['dataNasc'],
                    death: composer['dataObito'],
                    periodId: composer['periodoId'],
                    period: composer['periodo']
                });
            }
            return composers;
        }
    } catch (error) {
        console.error("Failed to fetch composers:", error);
        return null;
    }
}

/*
{
   "id":"PERIOD_ID",
   "periodo":"NAME",
   "composer":[
      {
         "nome":"NOME",
         "id":"ID"
      }
   ]
}
*/

async function get_period_information(period_id) {
    let period_info = {};

    try {
        const response = await axios.get(`http://localhost:3000/periodos/${period_id}`);
        period_info = {
            id: response.data['id'],
            name: response.data['nome'],
            composers: []
        };

        for (const composer of response.data['composer']) {
            period_info.composers.push({ name: composer['nome'], id: composer['id'] });
        }

        return period_info;
    } catch (error) {
        console.error("Failed to fetch period information:", error);
        return null;
    }
}

/*
{
   "id":"PERIOD_ID",
   "nome":"NAME",
   "composer":[
      {
         "nome":"NOME",
         "id":"ID"
      }
   ]
}
*/

async function get_periods() {
    let periods = [];

    try {
        const response = await axios.get('http://localhost:3000/periodos');
        for (const period of response.data) {
            let composers = [];
            for (const composer of period['composer']) {
                composers.push({ name: composer['nome'], id: composer['id'] });
            }
            periods.push({ id: period['id'], name: period['nome'], composers: composers , rule:'?periodo=' + period['nome']});
        }
        return periods;
    } catch (error) {
        console.error("Failed to fetch periods:", error);
        return null;
    }
}

async function set_composer(composer){
    try {
        const response = await axios.put(`http://localhost:3000/compositores/${composer.id}`, composer);

        if (response.status === 200) {
            return composer.id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to set composer:", error);
        return null;
    }
}

async function set_period(period){
    try {
        const response = await axios.put(`http://localhost:3000/periodos/${period.id}`, period);

        if (response.status === 200) {
            return period.id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to set period:", error);
        return null;
    }
}

async function create_composer(composer){
    try {
        const response = await axios.post(`http://localhost:3000/compositores`, composer);

        if (response.status === 201) {
            return response.data.id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to create composer:", error);
        return null;
    }
}

async function create_period(period){
    try {
        const response = await axios.post(`http://localhost:3000/periodos`, period);

        if (response.status === 201) {
            return response.data.id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to create period:", error);
        return null;
    }
}

async function delete_composer(composer_id){
    try {
        const response = await axios.delete(`http://localhost:3000/compositores/${composer_id}`);

        if (response.status === 200) {
            return composer_id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to delete composer:", error);
        return null;
    }
}

async function delete_period(period_id){
    try {
        const response = await axios.delete(`http://localhost:3000/periodos/${period_id}`);

        if (response.status === 200) {
            return period_id;
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Failed to delete period:", error);
        return null;
    }
}

module.exports = { get_composer_information, get_period_information, get_composers, get_periods, set_composer, set_period, create_composer, create_period, delete_composer, delete_period};