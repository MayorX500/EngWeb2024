var express = require('express');
var api = require('../api/data.js');
var forms = require('../dynamic/form.js'); // write_form_edit_composer, write_form_add_composer, write_form_delete_composers, write_form_edit_period, write_form_add_period, write_form_delete_period
var router = express.Router();

router.post('/compositores/add', async (req, res) => {
    let composer = req.body;

    let composerId = await api.create_composer(composer);
    let action = composerId ? 'create' : 'fail_create';

    let redirectUrl = "/compositores/edit";
    if (composerId) {
        redirectUrl += `/${composerId}`;
    }
    res.redirect(`${redirectUrl}?post=${action}`);
});

router.post('/compositores/edit/:composerId', async (req, res) => {
    let composer = req.body;
    let composerId = await api.set_composer(composer);
    let success = false;
    let redirectUrl = "/compositores/edit";

    if (composerId) {
        success = true;
        redirectUrl += `/${composerId}`;
    }

    let action = success ? 'update' : 'fail_update';

    res.redirect(`${redirectUrl}?post=${action}`);
});

router.post('/compositores/delete', async (req, res) => {
    
    let composers = req.body['composerToDelete[]'];
    if (typeof composers === 'string') {
        composers = [composers];
    }

    composers.forEach(async (composerId) => {
        await api.delete_composer(composerId);
    });

    let redirectUrl = "/compositores/delete";

    res.redirect(`${redirectUrl}`);
});

router.post('/periodos/add', async (req, res) => {
    let period = req.body;

    period.compositores = [];

    let periodId = await api.create_period(period);

    let action = periodId ? 'create' : 'fail_create';

    let redirectUrl = "/periodos/edit";
    if (periodId) {
        redirectUrl += `/${periodId}`;
    }

    res.redirect(`${redirectUrl}?post=${action}`);
});

router.post('/periodos/edit/:periodId', async (req, res) => {
    let period = req.body;
    period.compositores = [];

    let composers = period['composerInPeriod[]'];
    if (typeof composers === 'string') {
        composers = [composers];
    }

    composers.forEach(async composer => {
        let compositor = await api.get_composer_information(composer,false);
        period.compositores.push({id: composer, nome: compositor.nome});
    });

    delete period['composerInPeriod[]'];

    let periodId = await api.set_period(period);

    let action = periodId ? 'update' : 'fail_update';

    let redirectUrl = "/periodos/edit";
    if (periodId) {
        redirectUrl += `/${periodId}`;
    }

    res.redirect(`${redirectUrl}?post=${action}`);
});

router.post('/periodos/delete', async (req, res) => {
    let periods = req.body['periodToDelete[]'];
    if (typeof periods === 'string') {
        periods = [periods];
    }
    periods.forEach(async (period) => {
        await api.delete_period(period);
    });
    
    let redirectUrl = "/periodos/delete";


    res.redirect(`${redirectUrl}`);
});

module.exports = router;
