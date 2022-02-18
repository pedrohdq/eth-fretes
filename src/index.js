import { render } from 'react-dom';

// React-Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Redux
import store from "./store/store";
import { Provider } from "react-redux";

// Pages
import Layout from './pages/Layout'
import Home from './pages/Home';
import About from './pages/About';
import Freights from './pages/Freights';

// Global CSS
import './assets/index.css';

render(
  <Provider store={store}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> }>
          <Route index element={ <Home /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/freights" element={ <Freights /> } />
        </Route>
      </Routes>
    </BrowserRouter>,

  </Provider>,

  document.getElementById("root")
);
