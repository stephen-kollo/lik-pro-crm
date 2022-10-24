import React from 'react';
import { Routes, Route} from "react-router-dom";
import "bootstrap/js/src/collapse.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";
import Navbar from './components/navbar.component';

function App() {
    return (
      <div className='App'>
        
        <Navbar /> 
        <Routes>
          <Route path="/" element={<ExercisesList/>} />
          <Route path="/edit/:id" element={<EditExercise/>} />
          <Route path="/create" element={<CreateExercise/>} />
          <Route path="/user" element={<CreateUser/>} />
        </Routes>
      </div>
    );
}

export default App;
