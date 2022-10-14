const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const contactController = require("../controller/contactController")
const mid=require("../middleware/authentication")


router.post("/register", contactController.createContact)
router.post("/login",contactController.loginContact)
router.get("/contact/:contactId", mid.authenticate,contactController.getContact)
router.put("/contact/:contactId", mid.authenticate,contactController.updateContact)
router.delete("/contact/:contactId", mid.authenticate,contactController.contactDeleted)




module.exports = router;