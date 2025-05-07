import logo from '../../assets/logo.png';
import './Hero.css';
import Card from '../Card/Card';
import pic1 from '../../assets/pic1.jpeg';
import pic2 from '../../assets/pic2.jpeg';
import pic3 from '../../assets/pic3.jpeg';
import pic4 from '../../assets/pic4.jpeg';
import { FaBrain, FaCode, FaDatabase, FaShieldAlt, FaGraduationCap, FaBook, FaUsers, FaLaptop } from "react-icons/fa";
import { Link } from 'react-router-dom';

const services = [
  { 
    image: pic1, 
    title: "AI Training", 
    text: "Learn the latest AI techniques and tools.", 
    description: "Join our AI Training program to master machine learning, deep learning, and AI-driven solutions with hands-on projects.",
    icon: <FaBrain size={40} className="text-success" />
  },
  { 
    image: pic2, 
    title: "Web Dev", 
    text: "Master full-stack web development skills.", 
    description: "Learn front-end and back-end development with modern frameworks like React, Node.js, and more.",
    icon: <FaCode size={40} className="text-success" />
  },
  { 
    image: pic3, 
    title: "Data Science", 
    text: "Get hands-on experience with data analysis.", 
    description: "Explore data visualization, statistical modeling, and predictive analytics using Python and R.",
    icon: <FaDatabase size={40} className="text-success" />
  },
  { 
    image: pic4, 
    title: "Cybersecurity", 
    text: "Enhance your knowledge in cybersecurity.", 
    description: "Understand ethical hacking, network security, and digital forensics to protect digital assets.",
    icon: <FaShieldAlt size={40} className="text-success" />
  }
];

const stats = [
  { icon: <FaGraduationCap size={30} />, number: "1000+", text: "Students Trained" },
  { icon: <FaBook size={30} />, number: "50+", text: "Courses Available" },
  { icon: <FaUsers size={30} />, number: "30+", text: "Expert Instructors" },
  { icon: <FaLaptop size={30} />, number: "24/7", text: "Online Support" }
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
        <h1 className="display-3 fw-bold">Empower Your Future with CAEI</h1>
        <p className="lead mt-3 mb-4">
          Unlock your potential in AI, Web Development, Cybersecurity, and more.
          Learn from industry experts with hands-on experience.
        </p>
        <Link to="/formations" className="btn btn-success btn-lg px-5 py-3">
          Explore Courses
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
          <h2 className="text-center mb-5 fw-bold">Our Educational Services</h2>
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