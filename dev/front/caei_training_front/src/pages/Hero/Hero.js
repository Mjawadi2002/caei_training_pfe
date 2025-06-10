import logo from '../../assets/logo.png';
import './Hero.css';
import Card from '../Card/Card';
import pic1 from '../../assets/formdiplom.jpg';
import pic2 from '../../assets/mini mba.jpg';
import pic3 from '../../assets/exmba2.jpg';
import pic4 from '../../assets/dba.jpg';
import { FaGraduationCap, FaBook, FaUsers, FaLaptop, FaAward, FaUniversity, FaUserTie, FaUserGraduate } from "react-icons/fa";
import { Link } from 'react-router-dom';

const services = [
  { 
    image: pic1, 
    title: "Formation diplomante", 
    text: "Prendre votre diplôme en ligne", 
    description: "Le Parcours Diplômant offert par CAEI est une formation de haut niveau qui permet aux professionnels d'acquérir les compétences et les connaissances nécessaires pour perfectionner dans leur carrière.",
    icon: <FaAward size={40} className="text-success" />
  },
  { 
    image: pic2, 
    title: "Mini MBA Cours", 
    text: "Master en gestion d'entreprise", 
    description: "Le Mini MBA offert par le CAEI est une formation de haut niveau conçue pour les cadres et les professionnels qui souhaitent développer leurs compétences en gestion d'entreprise.",
    icon: <FaUniversity size={40} className="text-success" />
  },
  { 
    image: pic3, 
    title: "EXECUTIVE MBA", 
    text: "Expert en management ", 
    description: "L'Executive MBA (Master of Business Administration) est un programme de formation continue proposé par le CAEI.",
    icon: <FaUserTie size={40} className="text-success" />
  },
  { 
    image: pic4, 
    title: "DOCTORAT (DBA)", 
    text: "Expert en management", 
    description: "Le Doctorate in Business Administration (DBA) est un programme de doctorat professionnel offert par le CAEI est un programme destiné aux professionnels qui souhaitent approfondir leurs connaissances en gestion d'entreprise et acquérir une expertise dans un domaine spécifique.",
    icon: <FaUserGraduate size={40} className="text-success" />
  }
];

const stats = [
  { icon: <FaGraduationCap size={30} />, number: "1000+", text: "Étudiants Formés" },
  { icon: <FaBook size={30} />, number: "50+", text: "Cours Disponibles" },
  { icon: <FaUsers size={30} />, number: "30+", text: "Instructeurs Experts" },
  { icon: <FaLaptop size={30} />, number: "24/7", text: "Support en Ligne" }
];

export default function Hero() {
  return (
    <div className="hero-section">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/videos/education-bg.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
      </div>

      {/* Main Hero Message */}
      <div className="container hero-content text-center fade-in">
        <img src={logo} alt="Logo" className="hero-logo mb-4" />
        <h1 className="display-3 fw-bold">Développez Votre Avenir avec CAEI</h1>
        <p className="lead mt-3 mb-4">
          Libérez votre potentiel en IA, Développement Web, Cybersécurité et plus encore.
          Apprenez auprès d'experts du secteur avec une expérience pratique.
        </p>
        <Link to="/formations" className="btn btn-success btn-lg px-5 py-3">
          Explorer les Cours
        </Link>
      </div>

      {/* Welcome Section */}
      <div className="container-fluid section">
        {/* Stats Section */}
        <div className="row stats-section text-center py-5">
          {stats.map((stat, index) => (
            <div className="col-md-3" key={index}>
              <div className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-text">{stat.text}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Services Section */}
        <div className="container py-5 services-section">
          <h2 className="text-center mb-5 fw-bold">Nos Formations Diplomantes</h2>
          <div className="row">
            {services.map((service, index) => (
              <div className="col-md-6 col-lg-3 mb-4" key={index}>
                <Card 
                  image={service.image}
                  title={service.title}
                  text={service.text}
                  description={service.description}
                  icon={service.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}