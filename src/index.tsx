import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './common/animation.css';
import {Sandbox} from "./component/old/sandbox/sandbox";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {FormGenerateZoo} from "./component/old/form-generate-zoo/form-generate-zoo";
import Home from "./component/home/home";
import Draft from "./component/draft/draft";
import Game from "./component/game/game";
import Background from "./component/shared/background/background";
import Login from "./component/login/login";
import Register from "./component/register/register";
import axios from "axios";

axios.defaults.headers.common['Authorization'] =`Bearer ${localStorage.getItem('token')}`
axios.interceptors.response.use(
    res => res,
    err => {
        // Any HTTP Code which is not 2xx will be considered as error
        const statusCode = err.response.status;
        if (statusCode === 401 || statusCode === 403) {
            document.location.href = '/login';
        }

        throw err;
    }
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Background/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/draft" element={<Draft />} />
            <Route path="/game/:zooId" element={<Game />} />
            {/*OLD*/}
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/animals" element={<Sandbox />} />
            <Route path="/history" element={<Sandbox />} />
            <Route path="/generate-zoo" element={<FormGenerateZoo />} />
        </Routes>
    </BrowserRouter>
);
