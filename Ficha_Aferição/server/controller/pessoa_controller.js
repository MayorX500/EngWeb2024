const Pessoa = require('../model/pessoa');

async function getAll(params = {}, fields = {}){
	let pessoas = await Pessoa.find(params, fields);
	return pessoas;
}

async function getById(id,params = {}, fields = {}){
	let pessoa = await Pessoa.findById(id, fields);
	return pessoa;
}

async function create(data){
	if (data.hasOwnProperty('CC')) {
		data._id = data.CC;
	}
	else if (data.hasOwnProperty('BI')) {
		data._id = data.BI;
	}
	else	if (data.hasOwnProperty('NIF')) {
		data._id = data.NIF;
	}
	else	if (data.hasOwnProperty('Passaporte')) {
		data._id = data.Passaporte;
	}
	else {
		return "Erro: não foi possível identificar a pessoa"
	}
	let pessoa = new Pessoa(data);
	await pessoa.save();
	return pessoa;
}

async function update(id, data){
	if (!data.hasOwnProperty('_id')) {
		data._id = id;
	}
	let pessoa = await Pessoa.findByIdAndUpdate(id, data, {new: true});
	return pessoa;
}

async function remove(id){
	let p = await Pessoa.findByIdAndDelete(id);
	if (!p) {
		return false;
	}
	return true;
}

module.exports = { getAll, getById, create, update, remove };
