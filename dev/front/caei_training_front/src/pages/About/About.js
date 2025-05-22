import '../Hero/Hero.css';
import './About.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo.png';
import { FaUsers, FaTrophy, FaChalkboardTeacher, FaAward, FaGraduationCap, FaBook, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="about-container fade-in">

            <div className="container mt-5">
                {/* Our Story Section */}
                <div className="row align-items-center mb-5">
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

                {/* Core Values Section */}
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <h2 className="section-title mb-4">Our Core Values</h2>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Mission</h3>
                            <p className="about-card-text">
                                We provide high-quality training to bridge knowledge gaps and empower individuals with cutting-edge skills.
                            </p>
                            <div className="about-icon-container">
                                <FaChalkboardTeacher size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Vision</h3>
                            <p className="about-card-text">
                                To become Africa's leading teaching platform, fostering innovation and technological advancement.
                            </p>
                            <div className="about-icon-container">
                                <FaAward size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Excellence</h3>
                            <p className="about-card-text">
                                We strive for excellence in everything we do, from curriculum design to student support.
                            </p>
                            <div className="about-icon-container">
                                <FaTrophy size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Innovation</h3>
                            <p className="about-card-text">
                                We continuously innovate our teaching methods and course content to stay ahead of industry trends.
                            </p>
                            <div className="about-icon-container">
                                <FaGlobe size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="row mb-5">
                    <div className="col-12 text-center mb-4">
                        <h2 className="section-title">Why Choose Us</h2>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaGraduationCap size={40} className="feature-icon" />
                            <h4>Expert Instructors</h4>
                            <p>Learn from industry professionals with years of practical experience.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaBook size={40} className="feature-icon" />
                            <h4>Comprehensive Curriculum</h4>
                            <p>Stay up-to-date with the latest technologies and industry practices.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaUsers size={40} className="feature-icon" />
                            <h4>Community Support</h4>
                            <p>Join a vibrant community of learners and professionals.</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="row text-center mb-5">
                    <div className="col-12">
                        <div className="cta-section">
                            <h3>Ready to Start Your Journey?</h3>
                            <p className="lead">Join our community of learners and transform your career today.</p>
                            <Link to="/formations" className="btn btn-primary btn-lg mt-3">Get Started Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
