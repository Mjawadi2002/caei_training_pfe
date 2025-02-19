INSERT INTO users (name, email, password, role)
VALUES ('Agent Name', 'agent@example.com', 'hashed_password', 'agent');



use caei_training
Describe users

select * from users where role='formateur'

select * from formations

select * from users where role="apprenant"rolerole

select * from enrollments


SELECT 
    u.id AS apprenant_id,
    u.name AS apprenant_name, 
    f.title AS formation_title
FROM enrollments e
JOIN users u ON e.apprenant_id = u.id
JOIN formations f ON e.formation_id = f.id
ORDER BY u.name;



    

