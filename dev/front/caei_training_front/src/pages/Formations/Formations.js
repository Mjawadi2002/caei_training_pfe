import React, { useEffect, useState } from 'react';

export default function Formations() {
  const [formations, setFormations] = useState([]);

  // Fetch formations from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/formations')
      .then((response) => response.json())
      .then((data) => setFormations(data))
      .catch((error) => console.error('Error fetching formations:', error));
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="text-center">Formations</h1>
      <div className="row">
        {formations.length > 0 ? (
          formations.map((formation) => (
            <div key={formation.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{formation.title}</h5>
                  <p className="card-text">{formation.description}</p>
                  <p className="card-text">
                    <strong>Price:</strong> ${formation.price}
                  </p>
                  <p className="card-text">
                    <strong>Session:</strong> {formation.session_deb} - {formation.session_end}
                  </p>
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
