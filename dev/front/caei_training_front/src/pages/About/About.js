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
                {/* Notre Histoire Section */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-4 text-center">
                        <img src={logo} alt="Logo de l'entreprise" className="about-logo" style={{ width: '15rem' }}/>
                    </div>
                    <div className="col-md-8">
                        <h2 className="about-story-title">Notre Histoire</h2>
                        <p className="about-story-text">
                            Nous avons commencé avec une idée simple : donner aux individus les moyens de se développer grâce à une éducation de qualité. Notre parcours a débuté en 2015, et depuis lors, nous nous sommes consacrés à combler les lacunes en matière de connaissances et à offrir des opportunités d'apprentissage dans des domaines de pointe comme l'IA, l'apprentissage automatique et le développement web. Aujourd'hui, nous sommes fiers de façonner l'avenir de l'éducation technologique, un étudiant à la fois.
                        </p>
                    </div>
                </div>

                {/* Valeurs Fondamentales Section */}
                <div className="row">
                    <div className="col-12">
                        <h2 className="section-title mb-4">Nos Valeurs Fondamentales</h2>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card about-card">
                            <h3 className="about-card-title">Mission</h3>
                            <p className="about-card-text">
                                Nous fournissons une formation de haute qualité pour combler les lacunes en matière de connaissances et donner aux individus les compétences.
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
                                Devenir la plateforme d'enseignement leader en Afrique, favorisant l'innovation et l'avancement technologique.
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
                                Nous visons l'excellence dans tout ce que nous faisons, de la conception du programme à l'accompagnement des étudiants.
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
                                Nous innovons continuellement dans nos méthodes d'enseignement et le contenu de nos cours pour rester à la pointe des tendances du secteur.
                            </p>
                            <div className="about-icon-container">
                                <FaGlobe size={50} color="#28a745" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pourquoi Nous Choisir Section */}
                <div className="row">
                    <div className="col-12 text-center mb-4">
                        <h2 className="section-title">Pourquoi Nous Choisir</h2>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaGraduationCap size={40} className="feature-icon" />
                            <h4>Instructeurs Experts</h4>
                            <p>Apprenez auprès de professionnels du secteur ayant des années d'expérience pratique.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaBook size={40} className="feature-icon" />
                            <h4>Programme Complet</h4>
                            <p>Restez à jour avec les dernières technologies et pratiques du secteur.</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="feature-card">
                            <FaUsers size={40} className="feature-icon" />
                            <h4>Support Communautaire</h4>
                            <p>Rejoignez une communauté dynamique d'apprenants et de professionnels.</p>
                        </div>
                    </div>
                </div>

                {/* Appel à l'Action */}
                <div className="row">
                    <div className="col-12">
                        <div className="cta-section">
                            <h3>Prêt à Commencer Votre Parcours ?</h3>
                            <p className="lead">Rejoignez notre communauté d'apprenants et transformez votre carrière dès aujourd'hui.</p>
                            <Link to="/formations" className="btn btn-primary btn-lg mt-3">Commencer Maintenant</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
