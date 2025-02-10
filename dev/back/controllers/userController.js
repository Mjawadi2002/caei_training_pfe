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

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const updateQuery = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
    const params = [name, email, password, role, id];

    db.query(updateQuery, params, (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
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

        res.status(200).json({ token });
    });
};

