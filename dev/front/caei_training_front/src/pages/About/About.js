import '../Hero/Hero.css';
import './About.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import slide1 from '../../assets/slide1.jpeg';
import slide2 from '../../assets/slide2.jpeg';
import slide3 from '../../assets/slide3.jpeg';

export default function About() {
    return (
        <div className="about-container fade-in">
            <div className="about-section">
                <h1 className="about-title">Our Story !</h1>
                <div className="about-content">
                    <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {/* Slide 1 */}
                            <div className="carousel-item active">
                                <img src={slide1} className="d-block w-100" alt="Slide 1" />
                            </div>
                            {/* Slide 2 */}
                            <div className="carousel-item">
                                <img src={slide2} className="d-block w-100" alt="Slide 2" />
                            </div>
                            {/* Slide 3 */}
                            <div className="carousel-item">
                                <img src={slide3} className="d-block w-100" alt="Slide 3" />
                            </div>
                        </div>
                        {/* Controls */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="about-card-body">
                        <h5 className="about-card-title">CAEI TRAINING</h5>
                        <p className="about-card-text">
                            Our journey started with a vision to transform ideas into reality. 
                            We bring creativity, innovation, and dedication to every project we touch.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
