const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainoffice"); 

router.post("/sync", controller.syncVotesToMain);
router.get("/", controller.getAllVotes);
router.get("/byId/:id", controller.getVoteById);
router.put("/:voteid", controller.updateVote);

module.exports = router;