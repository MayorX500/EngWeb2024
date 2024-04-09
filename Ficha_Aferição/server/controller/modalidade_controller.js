const Modalidade = require('../model/modalidade');

async function getAll(params = {}, fields = {}){
	let pessoas = await Modalidade.find(params, fields);
	return pessoas;
}

async function getById(id,params = {}, fields = {}){
	let pessoa = await Modalidade.findById(id, fields);
	return pessoa;
}

async function getByName(name){
	let pessoa = await Modalidade.findOne({modalidade: name});
	return pessoa;
}

async function create(data){
	if (!data.hasOwnProperty('_id')) {
		let p = await Modalidade.find().sort({_id:-1}).limit(1);
		data._id = p[0]._id + 1;
	}
	let pessoa = new Modalidade(data);
	await pessoa.save();
	return pessoa;
}

async function update(id, data){
	if (!data.hasOwnProperty('_id')) {
		data._id = id;
	}
	let pessoa = await Modalidade.findByIdAndUpdate(id, data, {new: true});
	return pessoa;
}

async function remove(id){
	let p = await Modalidade.findByIdAndDelete(id);
	if (!p) {
		return false;
	}
	return true;
}

module.exports = { getAll, getById, getByName, create, update, remove };
