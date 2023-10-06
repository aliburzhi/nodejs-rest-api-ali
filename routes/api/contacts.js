const express = require('express')

const router = express.Router()
const contactsApi = require("../../../nodejs-rest-api-ali/models/contacts")
const {HttpError} = require("../../helpers")
const Joi = require("joi")

const addSchema = Joi.object({
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
	name: Joi.string().required()
})

router.get('/', async (req, res, next) => {
	try {
		const result = await contactsApi.listContacts()
		res.json(result)
	} catch (error) {
		next(error)
	}
})

router.get('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params
		const result = await contactsApi.getContactById(contactId)
		if (!result) {
			throw HttpError(404, "Not found!")
		}
		res.json(result)
	} catch (error) {
		next(error)
	}

})

router.post('/', async (req, res, next) => {
	try {
		const {error} = addSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message)
		}
		const result = await contactsApi.addContact(req.body)
		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
})

router.delete('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params
		console.log("contactId", contactId)
		const result = await contactsApi.removeContact(contactId)
		if (!result) {
			throw HttpError(404, "Not found")
		}
		res.json({
			message: "Delete success!"
		});
	} catch (error) {
		next(error)
	}
})

router.put('/:contactId', async (req, res, next) => {
	try {
		const { error } = addSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message)
		}
		const { contactId } = req.params
		const result = await contactsApi.updateContact(contactId, req.body)
		console.log(result)
		if (!result) {
			throw HttpError(404, "Not found")
		}
		res.json(result);
	} catch (error) {
		next(error)
	}
})

module.exports = router
