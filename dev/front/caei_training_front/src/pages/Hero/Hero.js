import logo from '../../assets/logo.png';
import './Hero.css';
import Card from '../Card/Card';
import pic1 from '../../assets/pic1.jpeg';
import pic2 from '../../assets/pic2.jpeg';
import pic3 from '../../assets/pic3.jpeg';
import pic4 from '../../assets/pic4.jpeg';
import { FaBrain, FaCode, FaDatabase, FaShieldAlt } from "react-icons/fa";

const services = [
    { 
        image: pic1, 
        title: "AI Training", 
        text: "Learn the latest AI techniques and tools.", 
        description: "Join our AI Training program to master machine learning, deep learning, and AI-driven solutions with hands-on projects.",
        icon: <FaBrain size={40} className="text-primary" />
    },
    { 
        image: pic2, 
        title: "Web Dev", 
        text: "Master full-stack web development skills.", 
        description: "Learn front-end and back-end development with modern frameworks like React, Node.js, and more.",
        icon: <FaCode size={40} className="text-warning" />
    },
    { 
        image: pic3, 
        title: "Data", 
        text: "Get hands-on experience with data analysis.", 
        description: "Explore data visualization, statistical modeling, and predictive analytics using Python and R.",
        icon: <FaDatabase size={40} className="text-success" />
    },
    { 
        image: pic4, 
        title: "Security", 
        text: "Enhance your knowledge in cybersecurity.", 
        description: "Understand ethical hacking, network security, and digital forensics to protect digital assets.",
        icon: <FaShieldAlt size={40} className="text-danger" />
    }
];

export default function Hero() {
    return (
        <div className="container-fluid section">
            <div className="row align-items-center">
                <div className="col-md-2 sectionlogo text-center">
                    <img src={logo} alt="Logo" className="img-fluid logo" />
                </div>
                <div className="col-md-10 section description">
                    <p className="lead">
                        The CAEI (Comité Africain d'Expertise Internationale) training platform is designed to provide students and professionals with the skills and expertise required to excel in the fields of computer engineering and artificial intelligence (AI). This platform offers a comprehensive learning experience that blends theoretical knowledge with practical applications.
                    </p>
                </div>
            </div>

            <h2 className="display-6 text-center py-3 text-uppercase">Our Services</h2>
            <div className="row g-4">
                {services.map((service, index) => (
                    <div className="col-md-3" key={index}>
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
    );
}
