const api = require('./data.js');

async function write_form_edit_composer(res, composer) {
    let periods = await api.get_periods();
    res.write(`
    
    <form id="composerForm" action="/CRUD/compositores/edit/${composer.id}" method="POST">
        <div class="form-group">
            <label for="id">ID:</label>
            <input type="text" id="id" name="id" value="${composer.id}" readonly>
        </div>
        <div class="form-group">
            <label for="nome">Name:</label>
            <input type="text" id="nome" name="nome" value="${composer.nome}">
        </div>
        <div class="form-group">
            <label for="bio">Biography:</label>
            <textarea id="bio" name="bio" rows="4">${composer.bio}</textarea>
        </div>
        <div class="form-group">
            <label for="dataNasc">Birth Date:</label>
            <input type="date" id="dataNasc" name="dataNasc" value="${composer.dataNasc}">
        </div>
        <div class="form-group">
            <label for="dataObito">Death Date:</label>
            <input type="date" id="dataObito" name="dataObito" value="${composer.dataObito}">
        </div>
        <div class="form-group">
        <label for="periodo">Period:</label>
        <select id="periodo" name="periodo" onchange="updatePeriodId()">
            <!-- The 'selected' attribute should be dynamically added to the option that matches the composer's period -->`);
    periods.forEach(period => {
        let selected = "";
        if (composer.periodoId === period.id) {
            selected = "selected";
        }
        res.write(`<option value="${period.periodo}" data-periodo-id="${period.id}" ${selected}>${period.periodo}</option>`);
    });
    res.write(`
            <!-- Add more periods as options here -->
            </select>
        </div>
        <div class="form-group">
            <label for="periodoId">Period ID:</label>
            <input type="text" id="periodoId" name="periodoId" readonly>
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Update Composer</button>
        </div>
    </form>
    <script> document.addEventListener('DOMContentLoaded', updatePeriodId); </script>`);
}

async function write_form_add_composer(res) {
    let periods = await api.get_periods();
    res.write(`
    <script> document.addEventListener('DOMContentLoaded', updatePeriodId); </script>
    <form id="composerForm" action="/CRUD/compositores/add" method="POST">
        <div class="form-group">
            <label for="nome">Name:</label>
            <input type="text" id="nome" name="nome" value="Name">
        </div>
        <div class="form-group">
            <label for="bio">Biography:</label>
            <textarea id="bio" name="bio" rows="4">Bio</textarea>
        </div>
        <div class="form-group">
            <label for="dataNasc">Birth Date:</label>
            <input type="date" id="dataNasc" name="dataNasc" value="01/01/1900">
        </div>
        <div class="form-group">
            <label for="dataObito">Death Date:</label>
            <input type="date" id="dataObito" name="dataObito" value="01/01/1900">
        </div>
        <div class="form-group">
        <label for="periodo">Period:</label>
        <select id="periodo" name="periodo" onchange="updatePeriodId()">
            <!-- The 'selected' attribute should be dynamically added to the option that matches the composer's period -->`);
    periods.forEach(period => {
        let selected = "";
        if (period.id === "P0") {
            selected = "selected";
        }
        res.write(`<option value="${period.periodo}" data-periodo-id="${period.id}" ${selected}>${period.periodo}</option>`);
    });
    res.write(`
            <!-- Add more periods as options here -->
            </select>
        </div>
        <div class="form-group">
            <label for="periodoId">Period ID:</label>
            <input type="text" id="periodoId" name="periodoId" readonly>
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Create Composer</button>
        </div>
    </form>`);
}

async function write_form_delete_composers(res) {
    let composers = await api.get_composers("");
    res.write(`
    <form id="composerForm" action="/CRUD/compositores/delete" method="POST">
        <div class="form-group">
            <label>Select Composers to Delete:</label>
            <div class="checkbox-group">
            <!-- Repeat this block for each composer, ensure the value attribute is set to the composer's ID -->`);
    composers.forEach(composer => {
        res.write(`
                <div class="checkbox-item">
                    <input type="checkbox" id="composer${composer.id}" name="composerToDelete[]" value="${composer.id}">
                    <label for="composer${composer.id}">${composer.nome} - ${composer.periodo} </label>
                </div>`);
    });
    res.write(`
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Delete Selected</button>
        </div>
    </form>`);
}
  

async function write_form_edit_period(res, period) {
    let composers = await api.get_composers("");
    res.write(`    
    <form id="composerForm" action="/CRUD/periodos/edit/${period.id}" method="POST">
        <div class="form-group">
            <label for="id">ID:</label>
            <input type="text" id="id" name="id" value="${period.id}" readonly>
        </div>
        <div class="form-group">
            <label for="periodo">Name:</label>
            <input type="text" id="periodo" name="periodo" value="${period.periodo}">
        </div>
        <div class="form-group">
            <label>Select Composers to Add to Period:</label>
            <div class="checkbox-group">
                <!-- Repeat this block for each composer, ensure the value attribute is set to the composer's ID -->`);
    composers.forEach(composer => {
        let checked = "";
        if (composer.periodoId === period.id) {
            checked = "checked";
        }
        res.write(`
                <div class="checkbox-item">
                    <input type="checkbox" id="composer${composer.id}" name="composerInPeriod[]" value="${composer.id}" ${checked}>
                    <label for="composer${composer.id}">${composer.nome} - ${composer.periodo} </label>
                </div>`);
        });
res.write(`
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Update Period</button>
        </div>
    </form>`);
}

async function write_form_add_period(res) {
    res.write(`
    <form id="composerForm" action="/CRUD/periodos/add" method="POST">
        <div class="form-group">
            <label for="periodo">Name:</label>
            <input type="text" id="periodo" name="periodo" value="Name">
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Create Period</button>
        </div>
    </form>`);
}

async function write_form_delete_period(res) {
    let periods = await api.get_periods();
    periods = periods.filter(period => period.id !== "P0");
    res.write(`
    <form id="composerForm" action="/CRUD/periodos/delete" method="POST">
        <div class="form-group">
            <label>Select Periods to Delete:</label>
            <div class="checkbox-group">
            <!-- Repeat this block for each composer, ensure the value attribute is set to the composer's ID -->`);
    periods.forEach(period => {
        res.write(`
                <div class="checkbox-item">
                    <input type="checkbox" id="period${period.id}" name="periodToDelete[]" value="${period.id}">
                    <label for="period${period.id}">${period.periodo}</label>
                </div>`);
    });
    res.write(`
            </div>
        </div>
        <div class="form-group">
            <button type="submit" class="btn">Delete Selected</button>
        </div>
    </form>`);
}

module.exports = {write_form_edit_composer, write_form_add_composer, write_form_delete_composers, write_form_edit_period, write_form_add_period, write_form_delete_period};