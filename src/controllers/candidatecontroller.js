const pg = require("../utils/connect");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

exports.addCandidate = async function (req, res) {
    const { name, description } = req.body;
    const image = req.file;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }


    try {
        if (!image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const stream = cloudinary.uploader.upload_stream(async (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
            }

            const imageUrl = result.secure_url;

            try {
                const queryResult = await pg.query(
                    'INSERT INTO Candidate(name, description, image_url) VALUES($1, $2, $3) RETURNING *',
                    [name, description, imageUrl]
                );
                res.status(201).json({ success: true, message: 'Candidate created', payload: queryResult.rows[0] });
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Error saving to DB', error });
            }
        });

        stream.end(image.buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

exports.getAllCandidates = async function (req, res) {
    try {
        const result = await pg.query('SELECT * FROM Candidate');
        res.status(200).json({ success: true, message: 'Candidates found', payload: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

exports.getCandidateById = async function (req, res) {
    const { id } = req.params;
    try {
        const result = await pg.query("SELECT * FROM Candidate WHERE CandidateID = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        return res.status(200).json({ success: true, payload: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

exports.updateCandidate = async function (req, res) {
    const { candidateid, name, description } = req.body;
    const image = req.file;

    try {
        if (!image) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const stream = cloudinary.uploader.upload_stream(async (error, result) => {
            if (error) {
                return res.status(500).json({ message: 'Error uploading image to Cloudinary', error });
            }

            const imageUrl = result.secure_url;

            try {
                const queryResult = await pg.query(
                    'UPDATE Candidate SET name = $1, description = $2, image_url = $3 WHERE CandidateID = $4 RETURNING *',
                    [name, description, imageUrl, candidateid]
                );

                if (queryResult.rowCount === 0) {
                    return res.status(404).json({ message: "Candidate not found" });
                }

                res.status(200).json({ success: true, message: 'Candidate updated', payload: queryResult.rows[0] });
            } catch (error) {
                return res.status(500).json({ success: false, message: 'Database error', error });
            }
        });

        stream.end(image.buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

exports.deleteCandidate = async function (req, res) {
    const { id } = req.params;

    try {
        const check = await pg.query("SELECT * FROM Candidate WHERE CandidateID = $1", [id]);

        if (check.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        await pg.query("DELETE FROM Candidate WHERE CandidateID = $1", [id]);

        res.status(200).json({ success: true, message: "Candidate deleted successfully", payload: check.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};
