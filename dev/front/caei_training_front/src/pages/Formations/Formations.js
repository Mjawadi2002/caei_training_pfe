import React, { useEffect, useState } from 'react';

export default function Formations() {
  const [formations, setFormations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/formations')
      .then((response) => response.json())
      .then((data) => setFormations(data))
      .catch((error) => console.error('Error fetching formations:', error));
  }, []);

  return (
    <div className="container-fluid fade-in">
      <div className="row">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <div key={formation.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{formation.title}</h5>
                  <p className="card-text">{formation.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong>  {formation.price} TND
                  </p>
                  <p className="card-text">
                    <strong>Session begins:</strong> {formation.session_deb}
                  </p>
                  <p className="card-text">
                    <strong>Session ends:</strong> {formation.session_end}
                  </p>
                  <div className='d-flex align-items-center'>
                    <button className='btn btn-success me-2'>Register Now</button>

                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No formations available</p>
        )}
      </div>
    </div>
  );
}
