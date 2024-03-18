var express = require('express');
var api = require('./../api/data.js');
var forms = require('./../dynamic/form.js'); // write_form_edit_composer, write_form_add_composer, write_form_delete_composers, write_form_edit_period, write_form_add_period, write_form_delete_period
var router = express.Router();

router.get('/edit/:composerId?', async (req, res) => {
    let { composerId } = req.params;
    let composers = await api.get_composers("");
    let composerFormHtml = null;
    let composer = null;

    if (composerId && composerId !== 'edit') {
        composer = await api.get_composer_information(composerId);
        if (composer) {
            composerFormHtml = await forms.write_form_edit_composer(composer);
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
            responseString = `Composer with ID: ${composerId} was created successfully.`;
            postAction = true;
        },
        'fail_create': () => {
            responseString = `Composer failed to create.`;
            postAction = true;
        },
        'update': () => {
            responseString = `Composer with ID: ${composerId} was edited successfully.`;
            postAction = true;
        },
        'fail_update': () => {
            responseString = `Composer with ID: ${composerId} failed to edit.`;
            postAction = true;
        }
    };
    const action = req.query.post || "default";
    (actions[action] || defaultAction)();

    // The 'post' and 'string' variables seem to be related to query parameters or specific conditions. Adjust as necessary.
    // Now, even if no composerId is provided, the route will still render the PUG template, but without a specific composer form.
    res.render('composer_edit', { 
        title: 'Edit Classical Music Composers',
        composer,
        composers,
        composerFormHtml,
        post: postAction, // You might need to adjust how these are determined based on your application's logic
        string:responseString 
    });
});

router.get('/add', async (req, res) => {
    let composerFormHtml = await forms.write_form_add_composer();

    res.render('composer_add_delete', { 
        title: 'Create Classical Music Composer',
        message: 'Add a Composer',
        composerFormHtml
    });
});

router.get('/delete', async (req, res) => {
    const composerFormHtml = await forms.write_form_delete_composers();
    res.render('composer_add_delete', { 
        title: 'Delete Classical Music Composers',
        message: 'Delete a Composer',
        composerFormHtml
    });
});

router.get('/:id', async function(req, res, next) {
    let composer = await api.get_composer_information(req.params.id);
    res.render('composer_view', { title: composer.nome, composer: composer });
});

router.get('/', async function(req, res, next) {
    let filter = req.query.filter || "";
    let composers = await api.get_composers(`?periodo=${filter}`);
    let period = await api.get_periods();
    period.push({periodo: 'All', rule: null});
    res.render('composer_list', { title: 'Compositores', composers: composers, periods: period });

});

module.exports = router;
