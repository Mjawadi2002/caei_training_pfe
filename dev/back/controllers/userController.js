const db=require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.uploadProfileImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const { id } = req.params;
    const imagePath = req.file.path;

    db.query('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, id], (err, results) => {
        if (err) {
            // Delete the uploaded file if database update fails
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
            });
            console.error('Error updating profile image:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.affectedRows === 0) {
            // Delete the uploaded file if user not found
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
            });
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            message: 'Profile image updated successfully',
            imagePath: imagePath 
        });
    });
};

exports.getProfileImage = (req, res) => {
    const { id } = req.params;

    // Query the database to get the profile image path
    db.query('SELECT profile_image FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching profile image:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0 || !results[0].profile_image) {
            return res.status(404).json({ message: 'Profile image not found' });
        }

        // Get the relative path of the image (stored in the database)
        const imagePath = results[0].profile_image;

        // Build the URL that the frontend can use to access the image
        const imageUrl = `/${imagePath.replace(/\\/g, '/')}`;

        // Send the image URL in the response
        res.json({ profile_image_url: imageUrl });
    });
};

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
    db.query('SELECT id, name, email, role, profile_image FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = results[0];
        // If there's a profile image, convert it to a URL
        if (user.profile_image) {
            user.profile_image_url = `/api/users/${user.id}/profile-image`;
        }
        
        res.status(200).json(user);
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
    
    // Check if an image was uploaded
    const profileImage = req.file ? req.file.path : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.query(
            'INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, profileImage],
            (err, results) => {
                if (err) {
                    // If there was an error, delete the uploaded file if it exists
                    if (req.file) {
                        fs.unlink(req.file.path, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                        });
                    }
                    console.error('Error creating user:', err);
                    
                    // Handle duplicate email error specifically
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database query failed' });
                }
                
                // Get the newly created user to return in response
                db.query('SELECT id, name, email, role, profile_image FROM users WHERE id = ?', 
                    [results.insertId], 
                    (err, userResults) => {
                        if (err) {
                            console.error('Error fetching created user:', err);
                            return res.status(500).json({ error: 'Failed to fetch created user' });
                        }
                        
                        const user = userResults[0];
                        if (user.profile_image) {
                            user.profile_image_url = `/api/users/${user.id}/profile-image`;
                        }
                        
                        res.status(201).json({ 
                            message: 'User created successfully',
                            user: user
                        });
                    });
            });
    } catch (error) {
        
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
            });
        }
        console.error('Error in createUser function:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    console.log("Update request received:", req.body);
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

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body; 
    const client = "apprenant";
    
    // Check if an image was uploaded
    const profileImage = req.file ? req.file.path : null;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.query(
            'INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, client, profileImage],
            (err, results) => {
                if (err) {
                    // If there was an error, delete the uploaded file if it exists
                    if (req.file) {
                        fs.unlink(req.file.path, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
                        });
                    }
                    console.error('Error creating user:', err);
                    
                    // Handle duplicate email error specifically
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ error: 'Email already exists' });
                    }
                    return res.status(500).json({ error: 'Database query failed' });
                }
                
                // Get the newly created user to return in response
                db.query('SELECT id, name, email, role, profile_image FROM users WHERE id = ?', 
                    [results.insertId], 
                    (err, userResults) => {
                        if (err) {
                            console.error('Error fetching created user:', err);
                            return res.status(500).json({ error: 'Failed to fetch created user' });
                        }
                        
                        const user = userResults[0];
                        if (user.profile_image) {
                            user.profile_image_url = `/api/users/${user.id}/profile-image`;
                        }
                        
                        // Generate token for immediate login
                        const token = jwt.sign(
                            { id: user.id, role: user.role },
                            process.env.JWT_SECRET,
                            { expiresIn: '1h' }
                        );
                        
                        res.status(201).json({ 
                            message: 'User registered successfully',
                            token,
                            user: user
                        });
                    });
            });
    } catch (error) {
        // Delete uploaded file if error occurs during hashing
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting uploaded file:', unlinkErr);
            });
        }
        console.error('Error in registerUser function:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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

// Generate a random 6-digit code
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send reset code email
const sendResetCodeEmail = async (email, resetCode) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetCode}\nThis code will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending reset code email:', error);
        return false;
    }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if user exists
        const [user] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = user[0].id;
        const resetCode = generateResetCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Delete any existing reset tokens for this user
        await db.promise().query('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId]);

        // Insert new reset token
        await db.promise().query(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, resetCode, expiresAt]
        );

        // Send email with reset code
        const emailSent = await sendResetCodeEmail(email, resetCode);
        
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send reset code email' });
        }

        res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Verify reset code and update password
exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Get user and their reset token
        const [user] = await db.promise().query(
            'SELECT u.id, prt.token, prt.expires_at FROM users u ' +
            'JOIN password_reset_tokens prt ON u.id = prt.user_id ' +
            'WHERE u.email = ? AND prt.token = ?',
            [email, code]
        );

        if (user.length === 0) {
            return res.status(400).json({ error: 'Invalid reset code' });
        }

        const resetToken = user[0];
        
        // Check if token has expired
        if (new Date() > new Date(resetToken.expires_at)) {
            return res.status(400).json({ error: 'Reset code has expired' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.promise().query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, resetToken.id]
        );

        // Delete used reset token
        await db.promise().query(
            'DELETE FROM password_reset_tokens WHERE user_id = ?',
            [resetToken.id]
        );

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.verifyResetCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Email and code are required' });
    }

    try {
        // Get user and their reset token
        const [user] = await db.promise().query(
            'SELECT u.id, prt.token, prt.expires_at FROM users u ' +
            'JOIN password_reset_tokens prt ON u.id = prt.user_id ' +
            'WHERE u.email = ? AND prt.token = ?',
            [email, code]
        );

        if (user.length === 0) {
            return res.status(400).json({ error: 'Invalid reset code' });
        }

        const resetToken = user[0];
        
        // Check if token has expired
        if (new Date() > new Date(resetToken.expires_at)) {
            return res.status(400).json({ error: 'Reset code has expired' });
        }

        // Code is valid and not expired
        res.status(200).json({ 
            message: 'Reset code verified successfully',
            userId: resetToken.id
        });

    } catch (error) {
        console.error('Error in verifyResetCode:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
