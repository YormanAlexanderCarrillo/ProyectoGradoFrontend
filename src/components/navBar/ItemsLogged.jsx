import { Button, Link } from "@nextui-org/react";
import { ChartNoAxesCombined, FileChartColumn, FileSliders, Home, LogOut, MessageSquareWarning } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

export const ItemsLogged = ({ handleLogout }) => {
  return (
    <div className="h-full flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              as={NavLink}
              to="/"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              
            >
              <Home size={20} color="#e8053f" />
              <h3 className="text-black">Inicio</h3>
            </Link>
          </li>
          <li>
            <Link
              as={NavLink}
              to="/dashboard"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChartNoAxesCombined size={20} color="#e8053f"/>
              <h3 className="text-black">Dashboard</h3>
            </Link>
          </li>
          <li>
            <Link
              as={NavLink}
              to="/analisisPredictivo"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
             <FileChartColumn size={20} color="#e8053f"/>
              <h3 className="text-black">Analisis Predictivo</h3>
            </Link>
          </li>
          <li>
            <Link
              as={NavLink}
              to="/dashboard"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <MessageSquareWarning size={20} color="#e8053f" />
              <h3 className="text-black">Reportes</h3>
            </Link>
          </li>
          <li>
            <Link
              as={NavLink}
              to="/dashboard"
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <FileSliders size={20} color="#e8053f" />
              <h3 className="text-black">Configuración</h3>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          color="danger"
          variant="bordered"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};
