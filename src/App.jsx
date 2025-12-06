import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import MappingPage from './pages/MappingPage';
import FHIRBuilder from './pages/FHIRBuilder';
import APIPlayground from './pages/APIPlayground';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/mapping/:code" element={<MappingPage />} />
          <Route path="/fhir-builder" element={<FHIRBuilder />} />
          <Route path="/api-playground" element={<APIPlayground />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
