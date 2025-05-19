const express = require("express");
const router = express.Router();
const controller = require("../controllers/countdowncontroller"); 

router.post("/add", controller.addEndTime);
router.get("/read", controller.readEndTime);

module.exports = router;