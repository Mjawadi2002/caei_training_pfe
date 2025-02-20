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
import ManageClients from "../ManageClients/ManageClients";
import ManageFormateurs from "../ManageFormateurs/ManageFormateurs";
import ManageFormations from "../ManageFormations/ManageFormations";
import ProtectedRoutes from "../../utils/protectedRoutes";
import AccessDenied from '../AccessDenied/AccessDenied';

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
            <Route element={<ProtectedRoutes allowedRoles={["apprenant"]} />}>
              <Route path="/apprenant" element={<User />} />
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={["agent"]} />}>
              <Route path="/agent" element={<Agent />} />
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={["formateur"]} />}>
              <Route path="/formateur" element={<Formateur />} />
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/manage-clients" element={<ManageClients />} />
              <Route path="/admin/manage-formations" element={<ManageFormations />} />
              <Route path="/admin/manage-formateurs" element={<ManageFormateurs />} />
            </Route>
            <Route path="/accessdenied" element={<AccessDenied />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
