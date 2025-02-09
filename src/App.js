import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Content1 from './Components/Content1';
import Content2 from './Components/Content2';
import Login from './Components/Login';
import Ajouter from './Components/Ajouter';
import SignUp from './Components/SignUp';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/section1" element={<Content1 />} />
        <Route path="/section1" element={<Content2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Ajouter" element={<Ajouter />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
