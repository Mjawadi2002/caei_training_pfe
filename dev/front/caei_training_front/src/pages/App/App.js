import backloop from "../../assets/backloop.mp4";
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import Header from "../Header/Header";
import About from "../About/About";
import Contact from "../Contact/Contact";
import Formations from "../Formations/Formations";
import Register from "../Register/Register";
import Home from "../Home/Home";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="video-container">
        <video autoPlay loop muted playsInline className="background-video">
          <source src={backloop} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="container-fluid">
          <Header />
          <Routes>
            {/* Define Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
