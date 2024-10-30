import React from "react";
import { BrowserRouter} from "react-router-dom";
import NavBar from "../components/navBar/NavBar";
import { AuthProvider } from "../contexts/AuthContexts";

export const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    </AuthProvider>
  );
};
