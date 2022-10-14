const contactModel = require("../model/contactModel")
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createContact = async function(req, res) {
    try {
        let data = req.body
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "No input provided" })

        const { fname, lname, phone, email,password,address } = data

        if (!fname) {
            return res.status(400).send({ status: false, msg: "fname is required" })
        }

        if (!lname) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "valid phone number is required" })
        }

        if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "valid email is required" })
        }

        
        if (!password) {
            return res.status(400).send({ status: false, msg: "Plz enter valid password" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, msg: "passowrd min length is 8 and max len is 15" })
        }
    
        if (!address) {
            return res.status(400).send({ status: false, msg: "Plz enter valid address" })
        }

        let dupliPhone = await contactModel.find({ phone: phone })
        if (dupliPhone.length > 0) {
            return res.status(400).send({ status: false, msg: "phone number already exits" })
        }

        let dupliEmail = await contactModel.find({ email: email })
        if (dupliEmail.length > 0) {
            return res.status(400).send({ status: false, msg: "email is already exists" })
        }


        let savedData = await contactModel.create(data)
        return res.status(201).send({
            status: true,
            msg: "contact created successfully",
            data: savedData
        })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


const loginContact = async function(req, res) {
    try {
        let contact = req.body

        const {contactName, password} = contact
        
        if (Object.keys(contact) == 0) {
            return res.status(400).send({ status: false, msg: "please provide data" })
        }

        if (!contactName) return res.status(400).send({ status: false, msg: "contactName is required" }) 

        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }

        let contactDetails = await contactModel.findOne({ email: contactName, password: password })
        if (!contactDetails) {
            return res.status(400).send({ status: false, msg: "contactName or password is not correct" })
        };

        let token = jwt.sign({
            contactId: contactDetails._id,
           
        }, "rushi-159");

        res.status(200).send({
            status: true,
            msg: "contact login successfully",
            data: token
        })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}



const getContact = async function(req, res) {
    try {
        let contactId = req.params.contactId.trim()

        if (!isValidObjectId(contactId)) {
            return res.status(400).send({
                status: false,
                msg: "path param is invalid"
            })
        }

        const findContact = await contactModel.findOne({ _id: contactId, isDeleted: false })
        if (!findContact) {
            return res.status(404).send({
                status: false,
                msg: "could not found"
            })
        }

        return res.status(200).send({
            status: true,
            msg: "contact found",
            data: findContact
        })


    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        })
    }
}

const updateContact = async function(req, res) {
    try {
        contactId = req.params.contactId

        if (Object.keys(contactId).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide input" })
        }

        if (!isValidObjectId(contactId)) {
            return res.status(400).send({ status: false, msg: "please provide a valid contactId" })
        }

        const contactAvailable = await contactModel.findOne({ _id: contactId, isDeleted: false })
        if (!contactAvailable) {
            return res.status(400).send({ status: false, msg: "no contact found" })
        }

        let obj = {}
        data = req.body
        const { fname,lname,phone, email, password} = data

        if (fname) {
            if (!(fname)) {
                return res.status.send({ status: false, msg: "enter valid Id" })
            }
          
            obj.fname = fname.trim()
        }


        if (lname) {
            if (!(lname)) {
                return res.status(400).send({ status: false, msg: "enter valid lname " })
            }
            obj.lname = lname.trim()
        }

        if (phone) {
            if (!(phone)) {
                return res.status(400).send({ status: false, msg: "enter valid phone" })
            }
            obj.phone = phone
        }

        if (email) {
            if (!(email)) {
                return res.status(400).send({ status: false, msg: "enter valid email" })
            }
            obj.email = email.trim()
            
        }if (password) {
            if (!(password)) {
                return res.status(400).send({ status: false, msg: "enter valid password" })
            }
            obj.password = password.trim()
        }

        const updatedContact = await contactModel.findByIdAndUpdate({ _id: contactId }, { $set: obj }, { new: true })

        return res.status(200).send({ status: true, msg: "Updated contact", data: updatedContact })


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const contactDeleted = async function(req, res) {
    try {
        let contactId = req.params.contactId.trim()

        if (!isValidObjectId(contactId)) {
            return res.status(400).send({ status: false, msg: "Invalid contactId" })
        }

        const contactFind = await contactModel.findOne({ _id: contactId, isDeleted: false })
        if (!contactFind) {
            return res.status(404).send({ status: false, msg: "contactId is already deleted" })
        }

        const contactDeleted = await contactModel.findOneAndUpdate({ _id: contactId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, msg: "contact is deleted", data: contactDeleted })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports.createContact = createContact
module.exports.loginContact = loginContact
module.exports.getContact=getContact
module.exports.updateContact=updateContact
module.exports.contactDeleted=contactDeleted