
const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, "/contacts.json")
const {nanoid} = require("nanoid")
const listContacts = async () => {
	const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
}

const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const result = contacts.find(contact => contact.id === contactId);
	return result || null
}

const removeContact = async (contactId) => {
	const allContacts = await listContacts();
	const index = allContacts.findIndex(contact => contact.id === contactId);
	if (index === -1) return null
	const [result] = allContacts.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
	return result
}

const addContact = async (body) => {
	const allContacts = await listContacts()
	const id = nanoid();
	const newContact = {
		name: body.name, email: body.email, phone: body.phone, id
	}
	allContacts.push(newContact)
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
	return newContact
}

const updateContact = async (contactId, body) => {
	const allContacts = await listContacts()
	const index = allContacts.findIndex(item => item.id === contactId);
	console.log(index)
	if (index === -1) return null

	allContacts[index] = {id: contactId, ...body};
	await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2))
	return allContacts[index]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
