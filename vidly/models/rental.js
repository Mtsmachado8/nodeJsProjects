const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

// -Not using all properties inside customer
const customer_minified_schema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15
	},
	isGold: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: true,
		minlength: 9,
		maxlength: 15
	}
});

// -Not using all properties inside movie
const movie_minified_schema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 50,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	}
});

const rentalSchema = new mongoose.Schema({
	customer: {
		type: customer_minified_schema,
		required: true
	},
	movie: {
		type: movie_minified_schema,
		required: true
	},
	dateOut: {
		type: Date,
		required: true,
		default: Date.now()
	},
	dateReturned: {
		type: Date
	},
	rentalFee: {
		type: Number,
		min:0
	}
});

rentalSchema.statics.lookup = function(customerId, movieId){
	return this.findOne({
		'customer._id': customerId,
		'movie._id': movieId
	});
};

rentalSchema.methods.return = function(){
	this.dateReturned = new Date();

	// Calculate RentalFee
	const rentalDays = moment().diff(this.dateOut,'days');
	this.rentalFee =  rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validate(rental){

	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	};

	return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.Movie = movie_minified_schema;
exports.Customer = customer_minified_schema;
exports.validate = validate;