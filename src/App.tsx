import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Builder } from "./pages/Builder";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
