import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Stack, Text, Spinner } from '@chakra-ui/react';

type DepositRequest = {
  id: string;
  title: string;
  token: string;
  expectedFileCount: number;
  uploadedFileCount: number;
  expiresAt: string;
  status: 'PENDING' | 'COMPLETE' | 'EXPIRED';
};

export default function Dashboard() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:3000/requests', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => data && setRequests(data))
      .catch(() => setError('Impossible de charger les demandes'))
      .finally(() => setLoading(false));
  }, [navigate]);

    if (loading) {
    return (
      <Box p="8" textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt="10" px="4">
      <Heading size="lg" mb="6">Mes demandes</Heading>

      {error && <Text color="red.500" mb="4">{error}</Text>}

      {requests.length === 0 && !error && (
        <Box borderWidth="1px" borderRadius="12px" p="8" textAlign="center">
          <Text fontWeight="600" mb="2">Aucune demande en cours</Text>
          <Text color="gray.600">
            Cree une demande pour recevoir des pieces de ton client.
          </Text>
        </Box>
      )}

      <Stack gap="4">
        {requests.map((r) => (
          <Box key={r.id} borderWidth="1px" borderRadius="12px" p="5" bg="white">
            <Text fontWeight="600">{r.title}</Text>
            <Text fontSize="sm" color="gray.600">
              Expire le {new Date(r.expiresAt).toLocaleDateString('fr-FR')}
            </Text>
            <Text fontSize="sm" mt="2">
              {r.status} — {r.uploadedFileCount} piece(s) sur {r.expectedFileCount}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}