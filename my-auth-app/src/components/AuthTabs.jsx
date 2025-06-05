import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, useColorModeValue } from '@chakra-ui/react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthTabs({ onLoginSuccess }) {
  const bg = useColorModeValue('white', 'gray.700')
  const boxShadow = useColorModeValue('md', 'dark-lg')

  return (
    <Box maxW="md" w="100%" p={6} bg={bg} borderRadius="md" boxShadow={boxShadow}>
      <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
        <TabList mb="1em">
          <Tab>Login</Tab>
          <Tab>Registro</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Pasamos onLoginSuccess */}
            <LoginForm onLoginSuccess={onLoginSuccess} />
          </TabPanel>
          <TabPanel>
            <RegisterForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}