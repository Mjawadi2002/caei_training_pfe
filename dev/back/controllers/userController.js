const db=require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        console.log("Fetched User: ", results); // Add this to log the fetched user
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
};


exports.getUsersType = (req, res) => {
    const { role } = req.params;
    db.query('SELECT * FROM users WHERE role = ?', [role], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results);
    });
};




exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users where id=?',[id],(err,results)=>{
        if(err){
            console.log('error');
        }
        if(results.length===0){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results);
    })
};


exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name,email,password,role) VALUES(?,?,?,?)',[name,email,hashedPassword,role],(err,results)=>{
        if(err){
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ message: 'User created successfully' });
    })
};

exports.updateUser = async (req, res) => {
    console.log("Update request received:", req.body); // Debugging
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!name && !email && !password && !role) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        let updateQuery = 'UPDATE users SET ';
        const params = [];
        let updates = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }
        if (role) {
            updates.push('role = ?');
            params.push(role);
        }

        updateQuery += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        db.query(updateQuery, params, (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ error: 'Database query failed' });
            }
            console.log('Update Results:', results);
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User updated successfully' });
        });
    } catch (error) {
        console.error('Error in updateUser function:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            token,
            role: user.role 
        });
    });
};

exports.registerUser=async(req,res)=>{
    const { name, email, password} = req.body; 
    const client="apprenant"
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name,email,password,role) VALUES(?,?,?,?)',[name,email,hashedPassword,client],(err,results)=>{
        if(err){
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ message: 'User created successfully' });
    })
}

exports.countAllUsers = async (req, res) => {
    const sql = 'SELECT COUNT(*) AS userCount FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching count of users:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const count = results[0].userCount;
        return res.status(200).json({ count });
    });
};

exports.countAllClients=async(req,res)=>{


    
    const sql='SELECT COUNT(*) AS userCount FROM users where role=?';
    db.query(sql,['apprenant'],(err,results)=>{
        if (err) {
            console.error('Error fetching count of users:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const count = results[0].userCount;
        return res.status(200).json({ count });
    })
}

exports.countAllFormateurs=async(req,res)=>{
    const sql='SELECT COUNT(*) AS userCount FROM users where role=?';
    db.query(sql,['formateur'],(err,results)=>{
        if (err) {
            console.error('Error fetching count of users:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const count = results[0].userCount;
        return res.status(200).json({ count });
    })
}

exports.countAllFormations=async(req,res)=>{
    const sql='SELECT COUNT(*) AS formationCount FROM formations';
    db.query(sql,(err,results)=>{
        if (err) {
            console.error('Error fetching count of users:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const count = results[0].formationCount;
        return res.status(200).json({ count });
    })
}

exports.getUserName = (req, res) => {
    const { name } = req.params;
    const searchPattern = `%${name}%`; // Allow partial matching

    db.query('SELECT * FROM users WHERE name LIKE ?', [searchPattern], (err, results) => {
        if (err) {
            console.error('Error fetching user by name:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
}