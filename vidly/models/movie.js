const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	genre: {
		type: genreSchema, // -Using all props of genre
		required: true
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	}
}));

function validate(movie){

	const schema = {
		title: Joi.string().min(5).max(50).required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required()
	};

	return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validate;