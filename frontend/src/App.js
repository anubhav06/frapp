import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';

import Modal from 'react-modal';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#root');

function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Router>
        <Routes>
          <Route element={<LandingPage />} path='/' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
