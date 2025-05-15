const express = require("express");
const router = express.Router();
const controller = require("../controllers/transactioncontroller"); 

// Define the routes
router.post("/create", controller.createTransaction);
router.post("/pay/:id", controller.payTransaction);
router.delete("/:id", controller.deleteTransaction);
router.get("/", controller.getAllTransaction);

module.exports = router;