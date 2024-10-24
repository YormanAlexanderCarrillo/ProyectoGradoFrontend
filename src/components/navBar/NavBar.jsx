import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../contexts/AuthContexts";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user]);

  const handleLogout = async () => {
    logout();
    navigate("/login");
    setLoggedIn(false);
  };

  return (
    <div>
      <Navbar className="fixed top-0 right-0 w-full z-50 bg-white shadow-md">
        <NavbarContent justify="end">
          {!loggedIn ? (
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
          ) : (
            <NavbarItem>
              <Button color="danger" variant="bordered" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default NavBar;
