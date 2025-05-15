//wkwkwk ty technoskill 1.0

const pg = require("../utils/connect");
const dotenv = require("dotenv");
dotenv.config();

exports.createTransaction = async function createTransaction(req, res) {
    try{
        const {user_id, quantity, item_id} = req.body;
        const cariuser = await pg.query("SELECT * FROM users WHERE id = $1", [user_id]);
        const cariitem = await pg.query("SELECT * FROM items WHERE id = $1", [item_id]);

        if(cariuser.rowCount == 0){
            return res.status(404).json({ message: 'User not found' });
        }

        if(cariitem.rowCount == 0){
            return res.status(404).json({ message: 'Item not found' });
        }

        if(parseInt(quantity, 10) <= 0){
            return res.status(500).json({success:false, message:"Quantity must be larger than 0", payload: null});
        }

        const user = cariuser.rows[0];
        const item = cariitem.rows[0];

        if(parseInt(user.balance, 10) < parseInt(item.price, 10) * parseInt(quantity, 10)){
            return res.status(500).json({success:false, message:"Saldo tidak cukup", payload: null});
        }

        if(parseInt(item.stock, 10) < parseInt(quantity, 10)){
            return res.status(500).json({success:false, message:"Stock tidak cukup", payload: null});
        } 
        const status = "pending";
        const total = parseInt(item.price, 10) * parseInt(quantity, 10);

        const result = await pg.query("INSERT INTO transactions(user_id, item_id, quantity, total, status) VALUES($1, $2, $3, $4, $5) RETURNING *", [user_id, item_id, quantity, total, status]);
        return res.status(200).json({success:true, message:"Transaction successful", payload: result.rows[0] });
    } catch(error){
        await pg.query("ROLLBACK");
        console.log("Error creating transaction:", error);
        return res.status(500).json({success:false, message:"Transaction gagal kids", payload: null});
    }    
}

exports.payTransaction = async function payTransaction(req, res) {
    try{
        const { id } = req.params;

        const caritransaction = await pg.query("SELECT * FROM transactions WHERE id = $1", [id]);
        if(caritransaction.rowCount == 0){
            return res.status(404).json({ success:false, message: 'Transaction not found', payload:null });
        }
        
        const transaction = caritransaction.rows[0];
        const user_id = transaction.user_id;
        const item_id = transaction.item_id;
        const quantity = transaction.quantity;

        const cariuser = await pg.query("SELECT * FROM users WHERE id = $1", [user_id]);
        const cariitem = await pg.query("SELECT * FROM items WHERE id = $1", [item_id]);

        if(cariuser.rowCount == 0){
            return res.status(404).json({ success:false, message: 'User not found', payload:null });
        }

        if(cariitem.rowCount == 0){
            return res.status(404).json({ success:false, message: 'Item not found', payload:null });
        }

        if(parseInt(quantity, 10) <= 0){
            return res.status(500).json({success:false, message:"Quantity must be larger than 0", payload: null});
        }

        const user = cariuser.rows[0];
        const item = cariitem.rows[0];

        if(parseInt(user.balance, 10) < parseInt(item.price, 10) * parseInt(quantity, 10)){
            return res.status(500).json({success:false, message:"Saldo tidak cukup", payload: null});
        }

        if(parseInt(item.stock, 10) < parseInt(quantity, 10)){
            return res.status(500).json({success:false, message:"Stock tidak cukup", payload: null});
        } 

        const newbalance = parseInt(user.balance, 10) - parseInt(item.price, 10) * parseInt(quantity, 10);
        const newquantity = parseInt(item.stock, 10) - parseInt(quantity, 10);

        await pg.query("UPDATE users SET balance = $1 WHERE id = $2", [newbalance, transaction.user_id]);
        await pg.query("UPDATE items SET stock = $1 WHERE id = $2", [newquantity, transaction.item_id]);

        const status = "paid";

        const result = await pg.query("UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *", [status, id.trim()]);
        return res.status(200).json({success:true, message:"Transaction successful", payload: result.rows[0] });
    } catch(error){
        console.log("Error creating transaction:", error);
        return res.status(500).json({success:false, message:"Transaction gagal kids", payload: null});
    }    
};

exports.deleteTransaction = async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        //cek apakah item ada sebelum delete
        const print = await pg.query("SELECT * FROM transactions WHERE id = $1", [id]);
        
        if (print.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Transaction not found", payload: null });
        }
        const itemToDelete = print.rows[0];
        
        const response = await pg.query("DELETE FROM transactions WHERE id = $1", [id]);
        if (response.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }
        res.status(200).json({success: true, message: "Transaction deleted successfully", payload: itemToDelete});

    } catch (error) {
        return res.status(404).json({ success: false, message: "Transaction not found", payload: null });
    }
}

exports.getAllTransaction = async function getAllTransaction(req, res) {
    try {
        const result = await pg.query('SELECT * FROM transactions');
        res.status(200).json({success: true, message: 'Transactions found', payload: result.rows});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', payload: null });
    }
}