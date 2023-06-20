const User = require("../models/user");
const uploadProfile = require("../multerConfig")
const fs = require("fs");

const UsersController = {
	New: (req, res) => {
		res.render("users/new", {});
	},

	Create: async (req, res) => {
		try {
			uploadProfile.single("profileImage")(req, res, async (err) => {
				if (err) {
					res.status(400).render("users/new", { errorMessages: [err.message] })
				} else{
			const user = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				profileImage: {
					data: req.file
						? fs.readFileSync("/tmp/my-uploads/" + req.file.filename, "base64")
						: null, // Read and encode the file as base64
					contentType: req.file ? req.file.mimetype : null, // Store the file mimetype in the database
				},
			});
			const errorMessages = validator(
				user.firstName,
				user.lastName,
				user.email,
				user.password
			);

			if (errorMessages.length > 0) {
				res.status(400);
				res.render("users/new", { errorMessages: errorMessages });
			} else {
				
				await user.save();
				res.status(201).redirect("/sessions/new");
			}
			}
		});
		} catch (err) {
			const errorMessages = [];

			console.log(err.errors, "<<<<<<< THIS IS THE ERROR");

			const errKeys = Object.keys(err.errors);
			errKeys.forEach((key) => {
				errorMessages.push(err.errors[key].message);
			});

			res.status(400);
			res.render("users/new", { errorMessages: errorMessages });
		}
	},

	getImage: (req, res) => {

		User.findById(req.params.postId, (err, post) => {
			if (err || !post || !post.image.data) {
				return res.status(404).send("Image not found");
			}
			res.set("Content-Type", post.image.contentType);
	
			let stringData = post.image.data.toString();
			let imageData = stringData.replace(/^data:image\/png;base64,/, "");
	
			res.send(Buffer.from(imageData, "base64"));
	
		});
	}
};

const validator = (firstName, lastName, email, password) => {
	const errorMessages = [];

	if (!(firstName.length >= 1 && firstName[0].match(/[A-Z]/))) {
		errorMessages.push(
			"First name is invalid: Must contain at least one letter, and the first letter must be capitalised."
		);
	}

	if (!(lastName.length >= 1 && lastName[0].match(/[A-Z]/))) {
		errorMessages.push(
			"Last name is invalid: Must contain at least one letter, and the first letter must be capitalised."
		);
	}

	if (!email.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}/)) {
		errorMessages.push("Email is invalid.");
	}

	if (
		!(password.length >= 8 && password.match(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/))
	) {
		errorMessages.push(
			"Password is invalid: Must contain at least 8 characters, a letter and a number."
		);
	}

	return errorMessages;
};



module.exports = UsersController;
