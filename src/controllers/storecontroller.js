//wkwkwk ty technoskill 1.0

const pg = require("../utils/connect");

exports.getAll = async function getAll(req, res) {
    try {
        const result = await pg.query('SELECT * FROM stores');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.create = async function create(req, res) {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ message: 'Name and address are required' });
    }

    try {
        const result = await pg.query(
            'INSERT INTO stores(name, address) VALUES($1, $2) RETURNING *',
            [name, address]
        );
    res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting store:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.getID = async function getID(req, res) {
    try {
        const { id } = req.params;
      const response = await pg.query("SELECT * FROM stores WHERE id = $1", [id]);

      return res.status(200).json(response.rows[0]);
    } catch (error) {
        res.status(500).json({message: "Store not found"});
    }
};

exports.updateStore = async function updateStore(req, res) {
    try {
        const { id } = req.body;
        const { name, address } = req.body;
        const response = await pg.query("UPDATE stores SET name = $1, address = $2 WHERE id = $3", [name, address, id]);
        
        //res.json(name, address);

        res.status(200).json({ message: "Store updated successfully" });
    } catch (error) {
        res.status(500).json({message: "Update Store Failed"});
    }
}

exports.deleteStore = async function deleteStore(req, res){
    try{
        const {id} = req.params;
        const response = await pg.query("DELETE FROM stores WHERE id = $1", [id]);
    if (response.rowCount === 0) {
        return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json({message: "Store deleted successfully"});
} catch (error) {
    res.status(500).json({message: "Delete Store Unsuccesful"});
}
}


