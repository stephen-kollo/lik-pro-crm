import React from 'react';
import { Routes, Route} from "react-router-dom";
import "bootstrap/js/src/collapse.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import ClientsList from "./components/clients-list.component";
import Navbar from './components/navbar.component';
import WeeklyReport from './components/weekly-report.component';


function App() {
    return (
      <div className='App'>
        
        <Navbar /> 
        <Routes>
          <Route path="/" element={<ClientsList/>} />
          <Route path="/weekly_report" element={<WeeklyReport/>} />
        </Routes>
      </div>
    );
}

export default App;
