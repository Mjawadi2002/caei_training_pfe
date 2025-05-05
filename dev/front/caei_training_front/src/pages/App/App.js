import { useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";

import backloop from "../../assets/backloop.mp4";
import Login from '../Login/Login';
import Footer from '../../components/Footer/Footer';
import Header from "../../components/Header/Header";
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
import ManageFormations from "../ManageFormations/ManageFormations";
import ProtectedRoutes from "../../utils/protectedRoutes";
import AccessDenied from '../AccessDenied/AccessDenied';
import ChatAgentClient from "../ChatAgentClient/ChatAgentClient";
import ManageReclamations from "../ManageReclamations/ManageReclamations";
import ManageEnrollments from "../ManageEnrollments/ManageEnrollments";
import Evaluations from "../Evaluaions/Evaluations";
import Chatbot from "../ChatBot/Chatbot";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route element={<ProtectedRoutes allowedRoles={["apprenant"]} />}>
                <Route path="/apprenant" element={<User />} />
                <Route path="/chatclientagent" element={<ChatAgentClient />} />
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={["agent"]} />}>
                <Route path="/agent" element={<Agent />} />
                <Route path="/chatagentclient" element={<ChatAgentClient />} />
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={["formateur"]} />}>
                <Route path="/formateur" element={<Formateur />} />
                <Route path="/formateur/evaluation" element={<Evaluations />} />
              </Route>
              <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/manage-clients" element={<ManageClients />} />
                <Route path="/admin/manage-formations" element={<ManageFormations />} />
                <Route path="/admin/manage-reclamations" element={<ManageReclamations />} />
                <Route path="/admin/manage-enrollment" element={<ManageEnrollments />} />
              </Route>
              <Route path="/accessdenied" element={<AccessDenied />} />
            </Routes>

            <Footer />

            {/* Floating chat icon */}
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="btn btn-success position-fixed bottom-0 end-0 m-4 p-3 rounded-circle shadow"
                style={{ zIndex: 1049 }}
              >
                <BsChatDotsFill size={24} />
              </button>
            )}

            {/* Chatbot window */}
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
