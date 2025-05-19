const pg = require("../utils/connect");
const dotenv = require("dotenv");
dotenv.config();

exports.addEndTime = async (req, res) => {
    const { end_time } = req.body;

    if (!end_time) {
        return res.status(400).json({ message: "Butuh waktu end_time!" });
    }

    try {
        if (isNaN(Date.parse(end_time))) {
            return res.status(400).json({ message: "Format end_time tidak valid" });
        }

        const result = await pg.query(
            "INSERT INTO Countdown(end_time) VALUES($1) RETURNING *",
            [end_time]
        );

        //simpan 4 entry terakhir saja supaya table ini tdk terlalu penuh bang
        await pg.query(`DELETE FROM countdown WHERE countdownid NOT IN (SELECT countdownid FROM countdown ORDER BY created_at DESC LIMIT 4)`);

        return res.status(201).json({
            success: true,
            message: "End time added successfully",
            payload: result.rows[0],
        });
    } catch (error) {
        console.error("Error inserting end time:", error);
        res.status(500).json({ message: "Failed to add end time" });
    }
};


exports.readEndTime = async (req, res) => {
    try {
        const result = await pg.query("SELECT * FROM Countdown ORDER BY created_at DESC LIMIT 1");
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "No end time found" });
        }
        return res.status(200).json({
            success: true,
            message: "Latest end time retrieved successfully",
            payload: result.rows[0],
        });
    } catch (error) {
        console.error("Error retrieving end time:", error);
        res.status(500).json({ message: "Failed to retrieve end time" });
    }
}