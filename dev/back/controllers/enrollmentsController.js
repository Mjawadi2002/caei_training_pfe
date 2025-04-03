const db=require('../config/db');


exports.getAllEnrollments = (req, res) => {
    const query = `
        SELECT 
            e.id AS enrollment_id,
            u.id AS apprenant_id,
            u.name AS apprenant_name, 
            f.title AS formation_title,
            DATE_FORMAT(e.date_enrolled, '%Y-%m-%d') AS registration_date,
            e.rating AS enrollment_rating
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
    const {id}=req.params;
    const query=`Select count(*) as user_enrollment_count from enrollment where apprenant_id=?`
    db.query(query,[id],(err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({error:'DATABASE QUERY FAILED'});
        }
        const userEnrollmentCount=results[0].user_enrollment_count;
        res.status(200).json({user_enrollment_count:userEnrollmentCount});
    })
}

exports.registerFormation = (req, res) => {
    const { apprenant_id, formation_id } = req.body;
    const defaulRating=0;
    
    if (!apprenant_id || !formation_id) {
        return res.status(400).json({ error: 'apprenant_id and formation_id are required' });
    }

    const date_enrolled = new Date(); // Corrected date format

    const query = `
        INSERT INTO enrollments (apprenant_id, formation_id, date_enrolled,rating)
        VALUES (?, ?, ?,?)
    `;

    db.query(query, [apprenant_id, formation_id, date_enrolled,defaulRating], (err, results) => {
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



exports.updateEnrollment = (req, res) => {
    const { id } = req.params; 
    const { studentName, course } = req.body; 

    if (!studentName || !course) {
        return res.status(400).json({ message: "Student name and course are required." });
    }

    const query = `
        UPDATE enrollments 
        SET student_name = ?, course = ?
        WHERE enrollment_id = ?
    `;


    db.query(query, [studentName, course, id], (err, result) => {
        if (err) {
            console.error("Error updating enrollment:", err);
            return res.status(500).json({ message: "Failed to update enrollment." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Enrollment not found." });
        }

        res.status(200).json({ message: "Enrollment updated successfully." });
    });
};




exports.showEnrollmentByFormationId = (req, res) => {
    const { id } = req.params;  
    const role = 'apprenant';  

    console.log(`Fetching evaluations for formationId: ${id}`);  // Log the formation ID

    const query = `
        SELECT 
            enrollments.id AS enrollment_id,  
            users.id AS user_id,
            users.name,
            users.email,
            enrollments.date_enrolled,
            enrollments.rating,
            enrollments.apprenant_id  
        FROM 
            enrollments
        JOIN 
            users ON enrollments.apprenant_id = users.id
        WHERE 
            enrollments.formation_id = ?
            AND users.role = ?;
    `;

    db.query(query, [id, role], (err, results) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        console.log('Query Results:', results);  
        res.status(200).json(results);  // Send results with enrollment_id
    });
};



exports.updateRating = (req, res) => {
    const { rating } = req.body;
    const {id } = req.params;

    if (rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Rating must be a number between 0 and 5." });
    }

    const query = `UPDATE enrollments SET rating = ? WHERE id = ?`;

    db.query(query, [rating, id], (err, result) => {
        if (err) {
            console.error('Error updating rating:', err);
            return res.status(500).json({ error: 'Database query failed.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No enrollment found with the specified enrollment ID.' });
        }

        res.status(200).json({ message: 'Rating updated successfully.' });
    });
};


exports.getRecommendedCourses = async (req, res) => {
    try {
        const userId = req.params.id;

        // Step 1: Get the enrolled courses for the user
        const enrolledCoursesQuery = `
            SELECT f.* FROM formations f
            JOIN enrollments e ON f.id = e.formation_id
            WHERE e.apprenant_id = ?;
        `;
        const [enrolledCourses] = await db.promise().query(enrolledCoursesQuery, [userId]);

        if (enrolledCourses.length === 0) {
            return res.status(200).json({ message: "No enrolled courses found", recommendedCourses: [] });
        }

        // Step 2: Extract unique tags from enrolled courses
        let tagsSet = new Set();
        enrolledCourses.forEach(course => {
            if (course.tags && typeof course.tags === "string") {
                let tagsArray = course.tags.split(",").map(tag => tag.trim()); // Split & trim spaces
                tagsArray.forEach(tag => tagsSet.add(tag));
            }
        });

        // Convert Set to Array
        const tagsArray = [...tagsSet];

        if (tagsArray.length === 0) {
            return res.status(200).json({ message: "No relevant tags found", recommendedCourses: [] });
        }

        // Step 3: Find recommended courses based on extracted tags
        const placeholders = tagsArray.map(() => "tags LIKE ?").join(" OR ");
        const values = tagsArray.map(tag => `%${tag}%`);

        const recommendedCoursesQuery = `
            SELECT * FROM formations
            WHERE (${placeholders})
            AND id NOT IN (SELECT formation_id FROM enrollments WHERE apprenant_id = ?);
        `;

        const [recommendedCourses] = await db.promise().query(recommendedCoursesQuery, [...values, userId]);

        res.status(200).json({ recommendedCourses });

    } catch (error) {
        console.error("Error fetching recommended courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


