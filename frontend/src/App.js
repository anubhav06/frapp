import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import MembersPage from './pages/MembersPage';
import BooksPage from './pages/BooksPage';

function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Router>
        <Routes>
          <Route element={<LandingPage />} path='/' />
          <Route element={<MembersPage />} path='/members' />
          <Route element={<BooksPage />} path='/books' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
