const express = require("express");
const router = express.Router();
const controller = require("../controllers/branchcontroller"); 

router.get("/add1", controller.addVote1);
router.get("/1", controller.getAllVotes1);
router.get("/1/:id", controller.getVoteById1);
router.put("/1/:id", controller.updateVote1);
router.delete("/1/:id", controller.deleteVote1);

router.get("/add2", controller.addVote2);
router.get("/2", controller.getAllVotes2);
router.get("/2/:id", controller.getVoteById2);
router.put("/2/:id", controller.updateVote2);
router.delete("/2/:id", controller.deleteVote2);

router.get("/add3", controller.addVote3);
router.get("/3", controller.getAllVotes3);
router.get("/3/:id", controller.getVoteById3);
router.put("/3/:id", controller.updateVote3);
router.delete("/3/:id", controller.deleteVote3);

module.exports = router;