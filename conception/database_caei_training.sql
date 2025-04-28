use caei_training


ALTER TABLE enrollments
ADD COLUMN rating INT DEFAULT NULL;


DESCRIBE reclamations


DESCRIBE users


Describe enrollments
Describe formations


select * from reclamations


select * from users




select * from users where role='apprenant'

select * from formations

alter table formations
add column category varchar(255),
add column tags TEXT;


select * from users where role="agent"

select * from enrollments


SELECT 
    u.id AS apprenant_id,
    u.name AS apprenant_name, 
    f.title AS formation_title
FROM enrollments e
JOIN users u ON e.apprenant_id = u.id
JOIN formations f ON e.formation_id = f.id
ORDER BY u.name;



    

