import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Content1 from './Components/Content1';
import Content2 from './Components/Content2';
import Login from './Components/Login';
import Ajouter from './Components/Ajouter';
import SignUp from './Components/SignUp';
import ProductDetail from './Components/ProductDetail';
import Message from './Components/Message';
import Password from './Components/Password';
import UserProducts from './Components/UserProducts';
import Favorites from './Components/Favorites';
import EditProduct from './Components/EditProduct';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/section1" element={<Content1 />} />
        <Route path="/section2" element={<Content2 />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/edit-product/:id" element={<EditProduct/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/password" element={<Password />} />
        <Route path="/Ajouter" element={<Ajouter />} />
        <Route path="/Message" element={<Message />} />
        <Route path="/user-product" element={<UserProducts />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;