import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import './Hero.css';
import Card from '../Card/Card';
import pic1 from '../../assets/pic1.jpeg';
import pic2 from '../../assets/pic2.jpeg';
import pic3 from '../../assets/pic3.jpeg';
import pic4 from '../../assets/pic4.jpeg';


const services = [
    { image: pic1, title: "AI Training", text: "Learn the latest AI techniques and tools.", link: "/ai-training" },
    { image: pic2, title: "Web Development", text: "Master full-stack web development skills.", link: "/web-development" },
    { image: pic3, title: "Data Science", text: "Get hands-on experience with data analysis.", link: "/data-science" },
    { image: pic4, title: "Cybersecurity", text: "Enhance your knowledge in cybersecurity.", link: "/cybersecurity" }
];

export default function Hero() {
    return (
        <div className="container-fluid section">
            <div className="row">
                <div className="col-md-2 sectionlogo">
                    <img src={logo} alt="Logo" className="img-fluid" />
                </div>
                <div className="col-md-10 section description">
                    <p>
                        The CAEI (Comité Africain d'Expertise Internationale) training platform is designed to provide students and professionals with the skills and expertise required to excel in the fields of computer engineering and artificial intelligence (AI). This platform offers a comprehensive learning experience that blends theoretical knowledge with practical applications. The training platform includes a variety of learning resources, such as video tutorials, interactive coding sessions, and collaborative projects, designed to engage learners and provide them with a robust understanding of the material.
                    </p>
                    <Link className="btn btn-success" to="/contact">Contact</Link>
                </div>
            </div>
            <h2 className="display-6 text-center py-3">Our Services</h2>
            <div className="row">
                {services.map((service, index) => (
                    <div className="col-md-3" key={index}>
                        <Card 
                            image={service.image} 
                            title={service.title} 
                            text={service.text} 
                            link={service.link}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
