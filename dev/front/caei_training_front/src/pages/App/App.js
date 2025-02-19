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
import User from "../User/User";
import Error from "../Error/Error";
import Admin from "../Admin/Admin";
import Agent from "../Agent/Agent";
import Formateur from "../Formateur/Formateur";
import ProtectedRoutes from "../../utils/protectedRoutes";

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
            <Route path="*" element={<Error />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/formations" element={<Formations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoutes />}>
                <Route path="/apprenant" element={<User />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="/formateur" element={<Formateur />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
