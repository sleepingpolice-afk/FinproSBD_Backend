const express = require("express");
const router = express.Router();
const controller = require("../controllers/usercontroller"); 

router.post("/login", controller.loginVoter);
router.post("/register", controller.registerVoter);
router.get("/", controller.getAllVoters);
router.get("/:id", controller.getVoterById);
router.put("/:id", controller.updateVoter);
router.delete("/:id", controller.deleteVoter);

module.exports = router;
