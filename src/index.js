import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout'
import Home from './pages/Home';
import About from './pages/About';
import Freights from './pages/Freights';

import './assets/index.css';

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <Layout /> }>
        <Route index element={ <Home /> } />
        <Route path="/about" element={ <About /> } />
        <Route path="/freights" element={ <Freights /> } />
      </Route>
    </Routes>
  </BrowserRouter>,

  document.getElementById("root")
);
