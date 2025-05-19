const pg = require("../utils/connect");
const dotenv = require("dotenv");
dotenv.config();

exports.addVote1 = async function(req, res) {
    const { Voter, CandidateID } = req.body;

    if (!Voter || !CandidateID) {
        return res.status(400).json({ success: false, message: 'Voter, and CandidateID are required', payload: null });
    }

    try {
        const queryResult = await pg.query(
            'INSERT INTO branch1 (Voter, CandidateID) VALUES ($1, $2, $3) RETURNING *',
            [Voter, CandidateID]
        );

        res.status(201).json({ success: true, message: 'Vote added successfully', payload: queryResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving to branch1', payload: null });
    }
}

exports.getAllVotes1 = async function(req, res) {
    try {
        const result = await pg.query('SELECT * FROM branch1');
        res.status(200).json({ success: true, message: 'Votes found', payload: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching votes', payload: null });
    }
}

exports.updateVote1 = async function(req, res) {
    try{ 
        const { VoteID, Voter, CandidateID } = req.body;
        const { id } = req.params;

        const result = await pg.query(
            'UPDATE branch1 SET VoteID = $1, Voter = $2, CandidateID = $3 WHERE VoteID = $4 RETURNING *',
            [VoteID, Voter, CandidateID, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote updated successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}


exports.deleteVote1 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('DELETE FROM branch1 WHERE VoteID = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote deleted successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

exports.getVoteById1 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('SELECT * FROM branch1 WHERE VoteID = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote found', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}





exports.addVote2 = async function(req, res) {
    const {Voter, CandidateID } = req.body;

    if (!Voter || !CandidateID) {
        return res.status(400).json({ success: false, message: 'Voter, and CandidateID are required', payload: null });
    }

    try {
        const queryResult = await pg.query(
            'INSERT INTO branch2 (Voter, CandidateID) VALUES ($1, $2, $3) RETURNING *',
            [Voter, CandidateID]
        );

        res.status(201).json({ success: true, message: 'Vote added successfully', payload: queryResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving to branch2', payload: null });
    }
}

exports.getAllVotes2 = async function(req, res) {
    try {
        const result = await pg.query('SELECT * FROM branch2');
        res.status(200).json({ success: true, message: 'Votes found', payload: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching votes', payload: null });
    }
}

exports.updateVote2 = async function(req, res) {
    try {
        const { VoteID, Voter, CandidateID } = req.body;
        const { id } = req.params;

        const result = await pg.query(
            'UPDATE branch2 SET VoteID = $1, Voter = $2, CandidateID = $3 WHERE VoteID = $4 RETURNING *',
            [VoteID, Voter, CandidateID, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote updated successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}


exports.deleteVote2 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('DELETE FROM branch2 WHERE VoteID = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote deleted successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

exports.getVoteById2 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('SELECT * FROM branch2 WHERE VoteID = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote found', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}






exports.addVote3 = async function(req, res) {
    const { Voter, CandidateID } = req.body;

    if (!Voter || !CandidateID) {
        return res.status(400).json({ success: false, message: 'Voter, and CandidateID are required', payload: null });
    }

    try {
        const queryResult = await pg.query(
            'INSERT INTO branch3 (Voter, CandidateID) VALUES ($1, $2, $3) RETURNING *',
            [Voter, CandidateID]
        );

        res.status(201).json({ success: true, message: 'Vote added successfully', payload: queryResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving to branch3', payload: null });
    }
}

exports.getAllVotes3 = async function(req, res) {
    try {
        const result = await pg.query('SELECT * FROM branch3');
        res.status(200).json({ success: true, message: 'Votes found', payload: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching votes', payload: null });
    }
}

exports.updateVote3 = async function(req, res) {
    try {
        const { VoteID, Voter, CandidateID } = req.body;
        const { id } = req.params;

        const result = await pg.query(
            'UPDATE branch3 SET VoteID = $1, Voter = $2, CandidateID = $3 WHERE VoteID = $4 RETURNING *',
            [VoteID, Voter, CandidateID, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote updated successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}


exports.deleteVote3 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('DELETE FROM branch3 WHERE VoteID = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote deleted successfully', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}

exports.getVoteById3 = async function(req, res) {
    const { id } = req.params;

    try {
        const result = await pg.query('SELECT * FROM branch3 WHERE VoteID = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Vote not found', payload: null });
        }

        res.status(200).json({ success: true, message: 'Vote found', payload: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}



//CEK USER UDH VOTE APA BLUM
exports.checkIfUserHasVoted = async function(req, res) {
    const voterId = req.params.voterId;

    try {
        const result = await pg.query(`
            SELECT voter FROM (
                SELECT voter FROM branch1
                UNION
                SELECT voter FROM branch2
                UNION
                SELECT voter FROM branch3
            ) AS all_votes
            WHERE voter = $1
        `, [voterId]);

        const hasVoted = result.rowCount > 0;

        res.status(200).json({
            success: true,
            message: hasVoted ? "User has voted" : "User has not voted",
            payload: { hasVoted }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

