import './App.css';
import { Routes, Route } from "react-router-dom";
import { Dashboard, Login, Signup } from './components';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
    </div>  
  );
}

export default App;


