import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ManageRoles from './pages/ManageRoles';
import ManageMedicine from './pages/ManageMedicine';
import ViewMedicine from './pages/ViewMedicine';

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage-roles" element={<ManageRoles />} />
                <Route path="/manage-medicine" element={<ManageMedicine />} />
                <Route path="/view-medicine" element={<ViewMedicine />} />
            </Routes>
        </Router>
    );
}

export default App;
