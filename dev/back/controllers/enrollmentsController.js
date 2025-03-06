const db=require('../config/db');


exports.getAllEnrollments = (req, res) => {
    const query = `
        SELECT 
            e.id AS enrollment_id,
            u.id AS apprenant_id,
            u.name AS apprenant_name, 
            f.title AS formation_title,
            DATE_FORMAT(e.date_enrolled, '%Y-%m-%d') AS registration_date
        FROM enrollments e
        JOIN users u ON e.apprenant_id = u.id
        JOIN formations f ON e.formation_id = f.id
        ORDER BY u.name;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
};

exports.getEnrollmentByUserId = (req, res) => {
    const { id } = req.params; 

    const query = `
        SELECT 
            e.id AS enrollment_id,
            f.title AS formation_title,
            f.description AS formation_description,
            DATE_FORMAT(e.date_enrolled, '%Y-%m-%d') AS registration_date
        FROM enrollments e
        JOIN formations f ON e.formation_id = f.id
        WHERE e.apprenant_id = ?;
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No enrollments found for this user' });
        }

        res.status(200).json(results);
    });
};

exports.getCountEnrollments = (req, res) => {
    const query = 'SELECT COUNT(*) AS enrollment_count FROM enrollments';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching enrollment count:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // Extract the count from the query results
        const enrollmentCount = results[0].enrollment_count;

        // Send the count as a response
        res.status(200).json({ enrollment_count: enrollmentCount });
    });
};

exports.getCountEnrollmentsById=(req,res)=>{
    res.send('counts enrollments by id of apprenant is working !')
}

exports.registerFormation = (req, res) => {
    const { apprenant_id, formation_id } = req.body;
    
    if (!apprenant_id || !formation_id) {
        return res.status(400).json({ error: 'apprenant_id and formation_id are required' });
    }

    const date_enrolled = new Date(); // Corrected date format

    const query = `
        INSERT INTO enrollments (apprenant_id, formation_id, date_enrolled)
        VALUES (?, ?, ?)
    `;

    db.query(query, [apprenant_id, formation_id, date_enrolled], (err, results) => {
        if (err) {
            console.error('Error inserting enrollment:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        
        return res.status(201).json({
            message: 'Enrollment created successfully!',
            enrollmentId: results.insertId
        });
    });
};



exports.deleteEnrollment = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM enrollments WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting enrollment:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        res.status(200).json({ message: 'Enrollment deleted successfully' });
    });
};


exports.updateEnrollment=(req,res)=>{
   const {id}=req.params;
   const query=``;
   db
};