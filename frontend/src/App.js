import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dinacharya from "@/pages/Dinacharya";
import Deities from "@/pages/Deities";
import DeityDetail from "@/pages/DeityDetail";
import Panchangam from "@/pages/Panchangam";
import Festivals from "@/pages/Festivals";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dinacharya" element={<Dinacharya />} />
              <Route path="/deities" element={<Deities />} />
              <Route path="/deities/:id" element={<DeityDetail />} />
              <Route path="/panchangam" element={<Panchangam />} />
              <Route path="/festivals" element={<Festivals />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster position="top-center" />
      </AppProvider>
    </div>
  );
}

export default App;
