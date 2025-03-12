const db = require('../config/db');

exports.getAllFormations = (req, res) => {
    const sql = `SELECT id, title, description, price, session_deb, session_end, formateur_id, category, tags FROM formations;`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
};

exports.getFormationByName = (req, res) => {
    const { name } = req.params;
    const sql = `SELECT * FROM formations WHERE title = ?`;

    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Error fetching formation:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {  
            return res.status(404).json({ error: 'Formation not found!' });
        }

        res.status(200).json(results[0]);
    });
};

exports.createFormation = (req, res) => {
    const { title, description, price, session_deb, session_end, formateur_id, category, tags } = req.body;

    // Ensure tags is an array, and convert it to a comma-separated string
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || ''; 

    const sql = `
        INSERT INTO formations (title, description, price, session_deb, session_end, formateur_id, category, tags)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?
        WHERE EXISTS (
            SELECT 1 FROM users WHERE id = ? AND role = 'formateur'
        )
    `;

    db.query(sql, [title, description, price, session_deb, session_end, formateur_id, category, tagsString, formateur_id], (err, results) => {
        if (err) {
            console.error('Error creating formation:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(400).json({ error: 'Invalid formateur_id: User is not a formateur!' });
        }

        res.status(201).json({ message: 'Formation created successfully' });
    });
};




exports.updateFormation = (req, res) => {
    const { id } = req.params;
    const { title, description, price, session_deb, session_end, formateur_id } = req.body;
    
    const sql = `
        UPDATE formations 
        SET title = ?, description = ?, price = ?, session_deb = ?, session_end = ?, formateur_id = ?
        WHERE id = ?`;

    db.query(sql, [title, description, price, session_deb, session_end, formateur_id, id], (err, results) => {
        if (err) {
            console.error('Error updating formation:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Formation not found!' });
        }

        res.status(200).json({ message: 'Formation updated successfully' });
    });
};

exports.updateFormationByName = (req, res) => {
    const { name } = req.params;
    const { title, description, price, session_deb, session_end, formateur_id, category, tags } = req.body;

    // Ensure tags is an array and convert it to a comma-separated string
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags || ''; 

    const sql = `
        UPDATE formations 
        SET title = ?, description = ?, price = ?, session_deb = ?, session_end = ?, formateur_id = ?, category = ?, tags = ?
        WHERE title = ?`;

    db.query(sql, [title, description, price, session_deb, session_end, formateur_id, category, tagsString, name], (err, results) => {
        if (err) {
            console.error('Error updating formation by name:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Formation not found!' });
        }

        res.status(200).json({ message: 'Formation updated successfully by name' });
    });
};


exports.deleteFormation = (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM formations WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting formation:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Formation not found' });
        }

        res.status(200).json({ message: 'Formation deleted successfully' });
    });
};

exports.getFormationsOfFormateur = (req, res) => {
    const { idformateur } = req.params;
    const sql = 'SELECT * FROM formations WHERE formateur_id = ?';
    db.query(sql, [idformateur], (err, results) => {
        if (err) {
            console.error('Error fetching formations:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        return res.status(200).json(results);
    });
};

exports.getFormationsByCategory = (req, res) => {
    const { category } = req.params;
    const sql = 'SELECT * FROM formations WHERE category = ?';
    db.query(sql, [category], (err, results) => {
        if (err) {
            console.error('Error fetching formations:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        return res.status(200).json(results);
    });
};
