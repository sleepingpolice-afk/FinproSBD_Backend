const pg = require("../utils/connect");
const bcrypt = require('bcrypt');

exports.registerVoter = async function (req, res) {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/;
    const saltRounds = 10;

    const { name, email, password, age, status } = req.query;

    if (!email || !password || !name || !age || !status) {
        return res.status(400).json({ message: 'Semua field harus diisi!' });
    }

    if (email.match(emailRegex) == null || password.match(passwordRegex) == null) {
        return res.status(400).json({ success: false, message: 'Format email atau password tidak valid' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pg.query(
            'INSERT INTO Voter(name, email, password, age, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, age, status]
        );

        return res.status(201).json({ success: true, message: "Voter registered successfully", payload: result.rows[0] });

    } catch (error) {
        console.error('Error inserting voter:', error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
        }
        res.status(500).json({ message: 'Gagal registrasi' });
    }
};

exports.loginVoter = async function (req, res) {
    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi!' });
    }

    try {
        const result = await pg.query("SELECT * FROM Voter WHERE email = $1", [email]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Akun tidak ditemukan' });
        }

        const voter = result.rows[0];
        const isValid = await bcrypt.compare(password, voter.password);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Password salah' });
        }

        return res.status(200).json({ success: true, message: 'Login sukses', payload: voter });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Gagal login' });
    }
};

exports.getAllVoters = async (req, res) => {
    try {
        const result = await pg.query('SELECT * FROM Voter');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getVoterById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pg.query('SELECT * FROM Voter WHERE VoterID = $1', [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Voter not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateVoter = async (req, res) => {
    const { id } = req.params;
    const { name, password, email, age, status } = req.body;
    try {
        const result = await pg.query(
        'UPDATE Voter SET Name = $1, Password = $2, Email = $3, Age = $4, Status = $5 WHERE VoterID = $6 RETURNING *',
        [name, password, email, age, status, id]
        );
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Voter not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.deleteVoter = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pg.query('DELETE FROM Voter WHERE VoterID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Voter not found' });
        }
        res.json({ message: 'Voter deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
