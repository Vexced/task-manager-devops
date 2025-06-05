import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Textarea,
  useToast,
  Spinner,
  Flex,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";

import { EditIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";

const API_URL = "http://localhost:3000";

export default function Tasks({ token, onLogout }) {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [addingTask, setAddingTask] = useState(false); // nuevo estado

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.filter((t) => !t.completed));
        setCompletedTasks(data.filter((t) => t.completed));
      } else {
        toast({ title: "Error al cargar tareas", status: "error" });
      }
    } catch (error) {
      toast({ title: "Error de conexión", status: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        toast({ title: "Tarea actualizada", status: "success" });
        fetchTasks();
        setEditingTask(null);
      } else {
        toast({ title: "Error al actualizar tarea", status: "error" });
      }
    } catch {
      toast({ title: "Error en la conexión", status: "error" });
    }
  };

  const createTask = async (newTask) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        toast({ title: "Tarea creada", status: "success" });
        fetchTasks();
        setAddingTask(false);
      } else {
        toast({ title: "Error al crear tarea", status: "error" });
      }
    } catch {
      toast({ title: "Error en la conexión", status: "error" });
    }
  };

  const completeTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });
      if (res.ok) {
        toast({ title: "Tarea marcada como completada", status: "success" });
        fetchTasks();
      } else {
        toast({ title: "Error al marcar completada", status: "error" });
      }
    } catch {
      toast({ title: "Error en la conexión", status: "error" });
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast({ title: "Tarea eliminada", status: "success" });
        fetchTasks();
      } else {
        toast({ title: "Error al eliminar tarea", status: "error" });
      }
    } catch {
      toast({ title: "Error en la conexión", status: "error" });
    }
  };

  // Formulario para editar tarea
  const EditForm = () => {
    const [title, setTitle] = useState(editingTask.title);
    const [description, setDescription] = useState(editingTask.description);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      setSaving(true);
      await updateTask(editingTask.id, { title, description });
      setSaving(false);
    };

    return (
      <Box mb={4} p={4} bg="white" borderRadius="md" boxShadow="md">
        <Input
          mb={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />
        <Textarea
          mb={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        <Flex justifyContent="flex-end" gap={2}>
          <Button onClick={() => setEditingTask(null)}>Cancelar</Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={saving}
            disabled={!title}
          >
            Guardar
          </Button>
        </Flex>
      </Box>
    );
  };

  // Nuevo formulario para crear tarea
  const AddForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      if (!title.trim()) return; // validar título no vacío
      setSaving(true);
      // user_id se asume que el backend la asigna o la manejas según tu lógica, aquí sólo envías title y description
      await createTask({ title, description, completed: false });
      setSaving(false);
    };

    return (
      <Box mb={4} p={4} bg="white" borderRadius="md" boxShadow="md">
        <Input
          mb={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />
        <Textarea
          mb={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        <Flex justifyContent="flex-end" gap={2}>
          <Button onClick={() => setAddingTask(false)}>Cancelar</Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isLoading={saving}
            disabled={!title.trim()}
          >
            Añadir
          </Button>
        </Flex>
      </Box>
    );
  };

  if (loading) return <Spinner size="xl" />;

  const renderTaskRow = (task, isCompleted = false) => (
    <Tr key={task.id}>
      <Td>{task.id}</Td>
      <Td>{task.title}</Td>
      <Td>{task.description}</Td>
      <Td>
        {task.completed ? (
          <CheckCircleIcon color="green.400" boxSize={5} />
        ) : (
          <TimeIcon color="orange.400" boxSize={5} />
        )}
      </Td>

      <Td>
        <Flex gap={2}>
          {!isCompleted && (
            <>
              <Tooltip label="Editar">
                <IconButton
                  aria-label="Modificar"
                  icon={<EditIcon />}
                  size="sm"
                  onClick={() => setEditingTask(task)}
                />
              </Tooltip>
              <Tooltip label="Completar">
                <IconButton
                  aria-label="Completar"
                  icon={<CheckIcon />}
                  size="sm"
                  colorScheme="green"
                  onClick={() => completeTask(task.id)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip label="Eliminar">
            <IconButton
              aria-label="Eliminar"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={() => deleteTask(task.id)}
            />
          </Tooltip>
        </Flex>
      </Td>
    </Tr>
  );

  return (
    <Box maxW="4xl" mx="auto" p={6} borderRadius="xl" boxShadow="lg" bg="gray.50">
      {/* Botón para cerrar sesión */}
      <Flex justifyContent="space-between" mb={4} alignItems="center">
        <Button colorScheme="red" onClick={onLogout}>
          Cerrar sesión
        </Button>

        {/* Botón para añadir tarea */}
        {!addingTask && !editingTask && (
          <Button colorScheme="green" onClick={() => setAddingTask(true)}>
            Añadir tarea
          </Button>
        )}
      </Flex>

      {/* Mostrar formulario agregar o editar según el estado */}
      {addingTask && <AddForm />}
      {editingTask && <EditForm />}

      <Tabs
        variant="enclosed"
        isFitted
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        p={4}
      >
        <TabList mb={4} borderBottom="none">
          <Tab
            _selected={{
              color: "blue.600",
              borderColor: "blue.600",
              bg: "white",
              fontWeight: "bold",
            }}
            color="gray.700"
            fontWeight="medium"
            _focus={{ boxShadow: "none" }}
            borderRadius="md"
          >
            Tareas Activas
          </Tab>
          <Tab
            _selected={{
              color: "blue.600",
              borderColor: "blue.600",
              bg: "white",
              fontWeight: "bold",
            }}
            color="gray.700"
            fontWeight="medium"
            _focus={{ boxShadow: "none" }}
            borderRadius="md"
          >
            Tareas Completadas
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              borderRadius="md"
              overflowX="auto"
              bg="gray.50"
              p={4}
              boxShadow="sm"
            >
              <Table variant="simple" size="lg" bg="white" borderRadius="md">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Título</Th>
                    <Th>Descripción</Th>
                    <Th>Status</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tasks.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center">
                        No hay tareas activas
                      </Td>
                    </Tr>
                  ) : (
                    tasks.map((task) => renderTaskRow(task))
                  )}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              borderRadius="md"
              overflowX="auto"
              bg="gray.50"
              p={4}
              boxShadow="sm"
            >
              <Table variant="simple" size="lg" bg="white" borderRadius="md">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Título</Th>
                    <Th>Descripción</Th>
                    <Th>Status</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {completedTasks.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center">
                        No hay tareas completadas
                      </Td>
                    </Tr>
                  ) : (
                    completedTasks.map((task) => renderTaskRow(task, true))
                  )}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
