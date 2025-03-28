import '../Hero/Hero.css';
import './About.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';

import { FaUsers, FaLaptopCode, FaTrophy, FaChalkboardTeacher, FaAward } from 'react-icons/fa';

export default function About() {
    return (
        <div className="about-container fade-in">
            <div className="container mt-5">
                {/* Row 1: Our Story and Logo */}
                <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                        <img src={logo} alt="Company Logo" className="about-logo" style={{ width: '15rem' }}/>
                    </div>
                    <div className="col-md-8">
                        <h2 className="about-story-title">Our Story</h2>
                        <p className="about-story-text">
                            We started with a simple idea: to empower individuals through high-quality education. Our journey began in 2015, and since then, we've been dedicated to bridging knowledge gaps and providing learning opportunities in cutting-edge fields like AI, machine learning, and web development. Today, we're proud to be shaping the future of technology education, one student at a time.
                        </p>
                    </div>
                </div>

                {/* Row 2: Mission, Vision, Services, Achievements */}
                <div className="row text-center mt-5">
                    {/* Mission */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Mission</h3>
                            <p className="about-card-text">
                                We provide high-quality training to bridge knowledge gaps.
                            </p>
                            <div className="about-icon-container">
                                <FaChalkboardTeacher size={50} color="#007bff" />
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title"> Vision</h3>
                            <p className="about-card-text">
                                To become Africa's leading teaching platform.
                            </p>
                            <div className="about-icon-container">
                                <FaAward size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Services</h3>
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
                            <h3 className="about-card-title">Achievements</h3>
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
