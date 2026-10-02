import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dinacharya from "@/pages/Dinacharya";
import Deities from "@/pages/Deities";
import DeityDetail from "@/pages/DeityDetail";
import Panchangam from "@/pages/Panchangam";
import Festivals from "@/pages/Festivals";
import NityaPooja from "@/pages/NityaPooja";
import TulasiPooja from "@/pages/TulasiPooja";
import JapaCounter from "@/pages/JapaCounter";
import RamaKoti from "@/pages/RamaKoti";
import Profile from "@/pages/Profile";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dinacharya" element={<Dinacharya />} />
                <Route path="/deities" element={<Deities />} />
                <Route path="/deities/:id" element={<DeityDetail />} />
                <Route path="/panchangam" element={<Panchangam />} />
                <Route path="/festivals" element={<Festivals />} />
                <Route path="/pooja" element={<NityaPooja />} />
                <Route path="/pooja/tulasi" element={<TulasiPooja />} />
                <Route path="/japa" element={<JapaCounter />} />
                <Route path="/rama-koti" element={<RamaKoti />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-center" />
      </AppProvider>
    </div>
  );
}

export default App;
