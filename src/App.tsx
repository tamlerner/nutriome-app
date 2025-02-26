import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './contexts/ProfileContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ScannerScreen from './components/ScannerScreen';
import ProfileScreen from './components/ProfileScreen';
import ResultsScreen from './components/ResultsScreen';
import NavBar from './components/common/NavBar';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <Router>
          <div className="App max-w-lg mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<ScannerScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/results" element={<ResultsScreen />} />
              </Routes>
            </div>
            <NavBar />
          </div>
        </Router>
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default App;