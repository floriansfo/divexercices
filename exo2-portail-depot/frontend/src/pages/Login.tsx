import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, Heading, Stack, Text } from '@chakra-ui/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
        const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
        setError('Identifiants incorrects');
        return;
        }
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
    } catch {
        setError('Serveur injoignable');
    } finally {
        setLoading(false);
    }
  }
  return (
    <Box maxW="400px" mx="auto" mt="80px" px="4">
      <Heading size="lg" mb="6">Portail de depot</Heading>
      <Stack gap="4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button onClick={handleSubmit} loading={loading}>
          Se connecter
        </Button>
      </Stack>
    </Box>
  );

}