const axios = require('axios');

async function get_composer_information(composer_id, embed = true) {
    let composer_info = {};
    let query = `http://localhost:3000/compositores/${composer_id}`;

    try {
        if (embed) {
            query += "?_embed=periodo";
        }
        const response = await axios.get(query);
        composer_info = {
            id: response.data['id'],
            nome: response.data['nome'],
            bio: response.data['bio'],
            dataNasc: response.data['dataNasc'],
            dataObito: response.data['dataObito'],
            periodoId: response.data['periodoId'],
            periodo: response.data['periodo']
        };
        return composer_info;
    } catch (error) {
        console.error("Failed to fetch composer information(API GET):", error.message);
        return null;
    }
}

async function get_composers(queryObject){
    let composers = [];
    try {
        const response = await axios.get('http://localhost:3000/compositores' + queryObject);
        if (response.status === 200) {
            for (const composer of response.data) {
                composers.push({
                    id: composer['id'],
                    nome: composer['nome'],
                    bio: composer['bio'],
                    dataNasc: composer['dataNasc'],
                    dataObito: composer['dataObito'],
                    periodoId: composer['periodoId'],
                    periodo: composer['periodo']
                });
            }
            return composers;
        }
    } catch (error) {
        console.error("Failed to fetch composers:", error);
        return null;
    }
}

async function get_period_information(period_id) {
    let period_info = {};

    try {
        const response = await axios.get(`http://localhost:3000/periodos/${period_id}`);
        period_info = {
            id: response.data['id'],
            periodo: response.data['periodo'],
            compositores: []
        };
        try{
            for (const composer of response.data['compositores']) {
                period_info.compositores.push({ nome: composer['nome'], id: composer['id'] });
            }
        }catch (error) {
            console.error("Failed to fetch period composers:", error);
        }

        return period_info;
    } catch (error) {
        console.error("Failed to fetch period information:", error);
        return null;
    }
}

async function get_periods() {
    let periods = [];

    try {
        const response = await axios.get('http://localhost:3000/periodos');
        for (const period of response.data) {
            let composers = [];
            try{
                for (const composer of period['compositores']) {
                    composers.push({ nome: composer['nome'], id: composer['id'] });
                }
            }
            catch (error) {
                console.error("Failed to fetch period composers:", error);
            }
            periods.push({ id: period['id'], periodo: period['periodo'], compositores: composers , rule:period['periodo']});
        }
        return periods;
    } catch (error) {
        console.error("Failed to fetch periods:", error);
        return null;
    }
}

async function set_composer(composer){
    // Update Composer
    try {
        const old_composer = await get_composer_information(composer.id);

        const response = await axios.put(`http://localhost:3000/compositores/${composer.id}`, composer);

        if (response.status === 200) {
            // Next, fetch the related periods
            let old_period = await get_period_information(old_composer.periodoId);
            let new_period = await get_period_information(composer.periodoId);
            if (!old_period || !new_period) {
                console.error("Failed to update period information");
                return composer.id;
            }
            else if (new_period.id !== old_period.id) {
                // Remove the composer from the old period's composers list
                old_period.compositores = old_period.compositores.filter(c => c.id !== composer.id);
                // Update the old period without the composer's information
                let sucess = await set_period(old_period);
                if (!sucess) {
                    console.error("Failed to update old period information");
                }

                // Add the composer to the period's composers list
                new_period.compositores.push({nome: composer.nome, id: composer.id});
                // Update the period with the composer's information
                sucess = await set_period(new_period);
                if (!sucess) {
                    console.error("Failed to update new period information");
                }
            }
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
            for (const composer_id of period.compositores) {
                let composer = await get_composer_information(composer_id.id, false);
                console.log(composer);
                if (!composer) {
                    console.error("Failed to update composer information");
                }else
                if (composer.periodoId !== period.id) {
                    composer.periodoId = period.id;
                    composer.periodo = period.periodo;
                    let sucess = await set_composer(composer);
                    if (!sucess) {
                        console.error("Failed to update composer information");
                    }
                }
            }
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
        const composers = await get_composers("");
        composer.id = "C" + (composers.length + 1);
        
        const response = await axios.post(`http://localhost:3000/compositores`, composer);

        if (response.status === 201) {
            // Next, fetch the related period
            let new_period = await get_period_information(composer.periodoId);
            if (!new_period) {
                console.error("Failed to update period information");
                return composer.id;
            }
            else {
                // Add the composer to the period's composers list
                period.compositores.push({nome: composer.nome, id: composer.id});
                // Update the period with the composer's information
                const sucess = await set_period(new_period);
                if (!sucess) {
                    console.error("Failed to update period information");
                }
            }
            return composer.id;
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
        const periods = await get_periods();
        period.id = "P" + (periods.length + 1);

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
        const composer = await get_composer_information(composer_id);
        const response = await axios.delete(`http://localhost:3000/compositores/${composer_id}`);

        if (response.status === 200) {
            // Next, fetch the related period
            let period = await get_period_information(composer.periodoId);
            if (!period) {
                console.error("Failed to update period information");
                return composer_id;
            }
            else {
                // Remove the composer from the period's composers list
                period.compositores = period.compositores.filter(c => c.id !== composer_id);
                // Update the period without the composer's information
                const sucess = await set_period(period);
                if (!sucess) {
                    console.error("Failed to update period information");
                }
            }
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
        const period = await get_period_information(period_id);
        const response = await axios.delete(`http://localhost:3000/periodos/${period_id}`);

        if (response.status === 200) {
            for (const composer of period.compositores) {
                let sucess = await delete_composer(composer.id);
                if (!sucess) {
                    console.error("Failed to delete composer:", composer.id);
                }
            }
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