var express = require('express');
var api = require('./../api/data.js');
var forms = require('./../dynamic/form.js'); // write_form_edit_composer, write_form_add_composer, write_form_delete_composers, write_form_edit_period, write_form_add_period, write_form_delete_period
var router = express.Router();

router.get('/edit/:periodId?', async (req, res) => {
    let { periodId } = req.params;
    let periods = await api.get_periods();
    let periodFormHtml = null;
    let period = null;

    if (periodId && periodId !== 'edit') {
        period = await api.get_period_information(periodId);
        if (period) {
            periodFormHtml = await forms.write_form_edit_period(period);
        }
    }

    let responseString = "";
    let postAction = false;

    // Default action if 'post' query parameter is not provided or does not match any case
    const defaultAction = () => {
        postAction = false;
    };

    // Actions based on the 'post' query parameter
    const actions = {
        'create': () => {
            responseString = `Period with ID: ${periodId} was created successfully.`;
            postAction = true;
        },
        'fail_create': () => {
            responseString = `Period failed to create.`;
            postAction = true;
        },
        'update': () => {
            responseString = `Period with ID: ${periodId} was edited successfully.`;
            postAction = true;
        },
        'fail_update': () => {
            responseString = `Period with ID: ${periodId} failed to edit.`;
            postAction = true;
        }
    };
    const action = req.query.post || "default";
    (actions[action] || defaultAction)();

    // The 'post' and 'string' variables seem to be related to query parameters or specific conditions. Adjust as necessary.
    // Now, even if no composerId is provided, the route will still render the PUG template, but without a specific composer form.
    res.render('period_edit', {
        title: 'Edit Eras of Classical Music',
        period,
        periods,
        periodFormHtml,
        post: postAction, // You might need to adjust how these are determined based on your application's logic
        string:responseString 
    });
});

router.get('/add', async (req, res) => {
    let periodFormHtml = await forms.write_form_add_period();

    res.render('period_add_delete', {
        title: 'Add Eras of Classical Music',
        message: 'Add a Period',
        periodFormHtml
    });
});

router.get('/delete', async (req, res) => {
    const periodFormHtml = await forms.write_form_delete_period();
    res.render('period_add_delete', { 
        title: 'Delete Classical Music Periods',
        message: 'Delete a Music Period',
        periodFormHtml
    });
});

router.get('/:id', async function(req, res, next) {
    let period = await api.get_period_information(req.params.id);
    res.render('period_view', { title: period.periodo, period: period});
});

router.get('/', async function(req, res, next) {
    let period = await api.get_periods();
    period = period.filter(p => p.id != 'P0');
    res.render('period_list', { title: 'Periodos', periods: period });
});

module.exports = router;
