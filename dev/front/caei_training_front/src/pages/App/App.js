import { useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import { Menu, X } from 'lucide-react';

import backloop from "../../assets/backloop.mp4";
import Login from '../Login/Login';
import Footer from '../../components/Footer/Footer';
import Sidebar from "../../components/Sidebar/Sidebar";
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
import AdminStatistics from "../Admin/AdminStatistics";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Router>
        <div className="video-container">
          <video autoPlay loop muted playsInline className="background-video">
            <source src={backloop} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn-outside"
            style={{
              position: 'fixed',
              top: '20px',
              left: isSidebarOpen ? '270px' : '20px',
              zIndex: 1050,
              background: isSidebarOpen ? 'rgba(0, 0, 0, 0.5)' : 'none',
              border: 'none',
              borderRadius: '5px',
              padding: '10px',
              color: isSidebarOpen ? '#ecf0f1' : '#2c3e50',
              cursor: 'pointer',
              transition: 'left 0.3s ease, color 0.3s ease, background 0.3s ease, padding 0.3s ease',
            }}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`container-fluid ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} />
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
                <Route path="/admin/statistics" element={<AdminStatistics />} />
              </Route>
              <Route path="/accessdenied" element={<AccessDenied />} />
            </Routes>

            <Footer />

            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="btn btn-success position-fixed bottom-0 end-0 m-4 p-3 rounded-circle shadow"
                style={{ zIndex: 1049 }}
              >
                <BsChatDotsFill size={24} />
              </button>
            )}

            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
