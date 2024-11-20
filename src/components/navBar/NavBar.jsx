import React, { useState } from "react";

import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

import { ProtectedRoute } from "../../routes/ProtectedRoute";
import { DashboardPage } from "../../pages/DashboardPage";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { Menu, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContexts";
import { ItemsLogged } from "./ItemsLogged";
import { PredictiveAnalyticsPage } from "../../pages/PredictiveAnalyticsPage";
import { ReportsPage } from "../../pages/ReportsPage";
import { SettingsPage } from "../../pages/SettingsPage";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando ...
      </div>
    );
  }

  return (
    <>
      {user ? (
        <>
          <aside
            className={`fixed h-full bg-white shadow-lg z-40 transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-0"
            }`}
          >
            <div
              className={`h-full flex flex-col ${
                !isSidebarOpen ? "hidden" : ""
              }`}
            >
              <div className="p-4 flex flex-col items-center border-b">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <User size={40} className="text-gray-500" />
                </div>
                <span className="text-lg font-semibold">
                  {user?.email.split("@")[0] || "Usuario"}
                </span>
              </div>

              <ItemsLogged handleLogout={handleLogout} />
            </div>
          </aside>

          <div
            className={`min-h-screen transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-0"
            }`}
          >
            <div className="bg-white shadow-md flex">
              <Button isIconOnly variant="light" onClick={toggleSidebar}>
                <Menu size={24} />
              </Button>
            </div>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="/analisisPredictivo"
                  element={<PredictiveAnalyticsPage />}
                />
                <Route path="/reportes" element={<ReportsPage />} />
                <Route path="/configuracion" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </>
      ) : (
        <div className="fixed top-0 w-full z-40">
          <Navbar className="bg-white shadow-md">
            <NavbarContent justify="end">
              <div className="flex gap-4 justify-center items-center">
                <NavbarItem>
                  <Link as={NavLink} color="foreground" to="/">
                    Inicio
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={NavLink}
                    color="danger"
                    variant="bordered"
                    to="/login"
                  >
                    Ingresar
                  </Button>
                </NavbarItem>
              </div>
            </NavbarContent>
          </Navbar>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default NavBar;
