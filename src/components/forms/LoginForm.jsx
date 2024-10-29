import React, { useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContexts";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("usuario autenticado:", user.email);
      navigate("/dashboard");
    } else {
      console.log("usuario no autenticado");
      navigate("/login");
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem("Token", token);
    } catch (error) {
      console.log("Error en el login", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-svh">
      <div className="bg-black/80 rounded-lg w-5/6 sm:w-2/3 lg:w-4/12 pb-10 ">
        <div className="flex mb-10 h-12 rounded-lg justify-center items-center bg-yellow-500">
          <h3>Inicio de sesión</h3>
        </div>
        <form className="flex flex-col items-center" onSubmit={handleLogin}>
          <div className="w-4/5 sm:w-3/4 space-y-5">
            <Input
              type="email"
              label="Correo"
              placeholder="Ingrese el correo"
              isRequired
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              isRequired
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end pt-5">
              <Button
                className="w-28 flex space-x-2 justify-center "
                variant="solid"
                color="warning"
                type="submit"
                isLoading={isLoading}
              >
                Ingresar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
