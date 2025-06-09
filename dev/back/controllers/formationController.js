const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAllFormations = (req, res) => {
  const sql = "SELECT * FROM formations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching formations:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
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
  
  // Handle image upload
  let image_path = '/uploads/formations/default-formation.png';
  if (req.file) {
    image_path = `/uploads/formations/${req.file.filename}`;
  }

  // Format dates to YYYY-MM-DD
  const formattedSessionDeb = new Date(session_deb).toISOString().split('T')[0];
  const formattedSessionEnd = new Date(session_end).toISOString().split('T')[0];

  // Ensure tags is an array, and convert it to a comma-separated string
  const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';

  const sql = `
      INSERT INTO formations (title, description, price, session_deb, session_end, formateur_id, category, tags, image_path)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE EXISTS (
          SELECT 1 FROM users WHERE id = ? AND role = 'formateur'
      )
  `;

  db.query(sql, [title, description, price, formattedSessionDeb, formattedSessionEnd, formateur_id, category, tagsString, image_path, formateur_id], (err, results) => {
    if (err) {
      console.error('Error creating formation:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ error: 'Invalid formateur_id: User is not a formateur!' });
    }

    res.status(201).json({ 
      message: 'Formation created successfully',
      image_path: image_path
    });
  });
};

exports.updateFormation = (req, res) => {
  const { id } = req.params;
  const { title, description, price, session_deb, session_end, formateur_id } = req.body;
  
  // Handle image upload
  let image_path = req.body.image_path;
  if (req.file) {
    // Delete old image if it exists and is not the default
    if (image_path && image_path !== '/uploads/formations/default-formation.png') {
      const oldImagePath = path.join(__dirname, '..', image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    image_path = `/uploads/formations/${req.file.filename}`;
  }

  // Format dates to YYYY-MM-DD
  const formattedSessionDeb = new Date(session_deb).toISOString().split('T')[0];
  const formattedSessionEnd = new Date(session_end).toISOString().split('T')[0];

  const sql = `
      UPDATE formations 
      SET title = ?, description = ?, price = ?, session_deb = ?, session_end = ?, formateur_id = ?, image_path = ?
      WHERE id = ?`;

  db.query(sql, [title, description, price, formattedSessionDeb, formattedSessionEnd, formateur_id, image_path, id], (err, results) => {
    if (err) {
      console.error('Error updating formation:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Formation not found!' });
    }

    res.status(200).json({ 
      message: 'Formation updated successfully',
      image_path: image_path
    });
  });
};

exports.updateFormationByName = (req, res) => {
  const { name } = req.params;
  const { title, description, price, session_deb, session_end, formateur_id, category, tags } = req.body;
  
  // Handle image upload
  let image_path = req.body.image_path;
  if (req.file) {
    // Delete old image if it exists and is not the default
    if (image_path && image_path !== '/uploads/formations/default-formation.png') {
      const oldImagePath = path.join(__dirname, '..', image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    image_path = `/uploads/formations/${req.file.filename}`;
  }

  // Format dates to YYYY-MM-DD
  const formattedSessionDeb = new Date(session_deb).toISOString().split('T')[0];
  const formattedSessionEnd = new Date(session_end).toISOString().split('T')[0];

  // Ensure tags is an array and convert it to a comma-separated string
  const tagsString = Array.isArray(tags) ? tags.join(',') : tags || '';

  const sql = `
      UPDATE formations 
      SET title = ?, description = ?, price = ?, session_deb = ?, session_end = ?, formateur_id = ?, category = ?, tags = ?, image_path = ?
      WHERE title = ?`;

  db.query(sql, [title, description, price, formattedSessionDeb, formattedSessionEnd, formateur_id, category, tagsString, image_path, name], (err, results) => {
    if (err) {
      console.error('Error updating formation by name:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Formation not found!' });
    }

    res.status(200).json({ 
      message: 'Formation updated successfully by name',
      image_path: image_path
    });
  });
};

exports.deleteFormation = (req, res) => {
  const { id } = req.params;

  // First, get the formation to check if it has an image
  const getSql = "SELECT image_path FROM formations WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching formation:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Formation not found!' });
    }

    const formation = results[0];

    // Delete the formation
    const deleteSql = "DELETE FROM formations WHERE id = ?";
    db.query(deleteSql, [id], (err, results) => {
      if (err) {
        console.error('Error deleting formation:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      // If the formation had an image and it's not the default one, delete the image file
      if (formation.image_path && formation.image_path !== '/uploads/formations/default-formation.png') {
        const imagePath = path.join(__dirname, '..', formation.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.status(200).json({ message: 'Formation deleted successfully' });
    });
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

exports.getFormationsByTitle = (req, res) => {
  const { title } = req.params;
  const sql = 'SELECT * FROM formations WHERE title LIKE ?';
  const searchPattern = `%${title}%`;
  
  db.query(sql, [searchPattern], (err, results) => {
    if (err) {
      console.error('Error searching formations:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.status(200).json(results);
  });
};

exports.getFormationsByCategoryAndTitle = (req, res) => {
  const { category, title } = req.query;
  const sql = 'SELECT * FROM formations WHERE category = ? AND title LIKE ?';
  const searchPattern = `%${title}%`;
  
  db.query(sql, [category, searchPattern], (err, results) => {
    if (err) {
      console.error('Error searching formations:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    return res.status(200).json(results);
  });
};
