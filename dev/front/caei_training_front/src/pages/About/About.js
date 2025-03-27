import '../Hero/Hero.css';
import './About.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import { FaUsers, FaLaptopCode, FaTrophy, FaChalkboardTeacher, FaAward } from 'react-icons/fa';

export default function About() {
    return (
        <div className="about-container fade-in">
            {/* Sections for Mission, Vision, Services, and Achievements */}
            <div className="container mt-5">
                <div className="row text-center">
                    {/* Mission */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Our Mission</h3>
                            <p className="about-card-text">
                                We provide high-quality training to bridge knowledge.
                            </p>
                            <div className="about-icon-container">
                                <FaChalkboardTeacher size={50} color="#007bff" />
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Our Vision</h3>
                            <p className="about-card-text">
                                To become Africa's leading AI and computer engineering training platform.
                            </p>
                            <div className="about-icon-container">
                                <FaAward size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Our Services</h3>
                            <p className="about-card-text">
                                Offering courses in AI, machine learning, and web development.
                            </p>
                            <div className="about-icon-container">
                                <FaLaptopCode size={50} color="#e74c3c" />
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Our Achievements</h3>
                            <p className="about-card-text">
                                Over 1,000 students trained, now changing the world.
                            </p>
                            <div className="about-icon-container">
                                <FaTrophy size={50} color="#f1c40f" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
