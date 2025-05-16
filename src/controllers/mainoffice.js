const pg = require("../utils/connect");

exports.syncVotesToMain = async (req, res) => {
  try {
    //delete dulu baru insert
    const action = await pg.query("DELETE FROM main");
    if (action.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Error fetching main" });
    }

    const result = await pg.query(`
      INSERT INTO main (VoteID, Voter, CandidateID, Branch)
      SELECT VoteID, Voter, CandidateID, 'branch1'::branches FROM branch1
      UNION
      SELECT VoteID, Voter, CandidateID, 'branch2'::branches FROM branch2
      UNION
      SELECT VoteID, Voter, CandidateID, 'branch3'::branches FROM branch3
      RETURNING *
    `);

    res.status(200).json({ success: true, message: "Inserted data from branch to main", payload: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to insert data to main table" });
  }
};

exports.getAllVotes = async (req, res) => {
  try {
    const result = await pg.query("SELECT * FROM main");
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Error fetching main" });
    }
    res.status(200).json({ success: true, message: "Votes found", payload: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching votes", payload: null });
  }
};

exports.getVoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pg.query("SELECT * FROM main WHERE VoteID = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vote not found" });
    }
    return res.status(200).json({ success: true, payload: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.updateVote = async (req, res) => {
  const { voter, candidateid } = req.body;
  const { voteid } = req.params;

  try {
    const result = await pg.query(
      "UPDATE main SET Voter = $1, CandidateID = $2 WHERE VoteID = $3 RETURNING *",
      [voter, candidateid, voteid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vote not found" });
    }

    return res.status(200).json({ success: true, payload: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

exports.deleteVote = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pg.query("DELETE FROM main WHERE VoteID = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Vote not found" });
    }

    return res.status(200).json({ success: true, message: "Vote deleted successfully", payload: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
