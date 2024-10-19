import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import Signup from './pages/Signup.js';
import Login from './pages/Login.js';
import NotFound from './pages/NotFound.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; 
import { PostProvider } from './context/PostContext';  
import { GetAllPostsProvider } from './context/GetAllPostsContext.js';  
import Bot from './Bot.js'
import Logout from './pages/Logout.js'
import AboutUs from './pages/AboutUs.js'
import { DarkModeProvider } from './context/DarkModeContext.js';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
      <PostProvider>
        <GetAllPostsProvider>
          <DarkModeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/app/*" element={<App />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/bot" element={<Bot />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="*" element={<NotFound />} /> 
              </Routes>
            </Router>
          </DarkModeProvider>
        </GetAllPostsProvider>
      </PostProvider>
    </UserProvider>
  </React.StrictMode>
);
