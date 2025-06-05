import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";

export default function RegisterForm() {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000";

  const handleRegister = async () => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Registro exitoso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Opcional: limpiar campos o cambiar tab
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al registrar",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error en la conexión",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <FormControl mb={3} isRequired>
          <FormLabel>Usuario</FormLabel>
          <Input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl mb={6} isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          width="full"
          type="submit"
          onClick={handleRegister}
          isLoading={loading}
          disabled={!username || !password}
        >
          Registrar
        </Button>
      </form>
    </>
  );
}
