import React, { useState } from "react";
import { FormControl } from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

export default function LoginForm({ onLoginSuccess }) {
  // <-- recibe prop
  const toast = useToast();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const API_URL = "http://localhost:3000";

  const handleLogin = async () => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Login exitoso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const expiration = new Date().getTime() + 10 * 60 * 1000; // 10 minutos
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_expiration", expiration);

        onLoginSuccess(data.token);
        // Aquí llamamos a la función que recibe el token y lo envía a App.js
        onLoginSuccess(data.token);
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al iniciar sesión",
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
      <form onSubmit={handleLogin}>
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
          onClick={handleLogin}
          isLoading={loading}
          disabled={!username || !password}
        >
          Entrar
        </Button>
      </form>
    </>
  );
}
