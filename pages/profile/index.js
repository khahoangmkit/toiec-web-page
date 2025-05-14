import {Box, Flex, Text, Spinner, Image, Table, Thead, Tbody, Tr, Th, Td, Button} from '@chakra-ui/react';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import {router} from "next/client";

function formatDate(dateString) {
  const date = new Date(dateString);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export default function PageProfile() {
  const {data: session, status} = useSession();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      fetch(`/api/result?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.data || []);
        })
        .finally(() => setLoading(false));
    }
  }, [session?.user?.id]);

  if (status === 'loading') return <Spinner/>;

  function viewDetail(result) {
    router.push(`/result/${result.testId}/${result.id}`);
  }

  return (
    <Flex direction={{base: 'column', md: 'row'}} gap={8} p={8}>
      {/* Box trái: Thông tin người dùng */}
      <Box flex={1} p={6} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md">
        <Flex align="center" direction="column" gap={4}>
          <Image boxSize="96px" borderRadius="full" src={session?.user?.image} alt={session?.user?.name}/>
          <Text fontWeight="bold" fontSize="xl">{session?.user?.name}</Text>
          <Text color="gray.500">{session?.user?.email}</Text>
        </Flex>
      </Box>
      {/* Box phải: Lịch sử làm bài */}
      <Box flex={4} p={6} borderWidth={1} borderRadius="lg" bg="white" boxShadow="md" minH={300}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Lịch sử làm bài</Text>
        {loading ? <Spinner/> : results.length === 0 ? (
          <Text color="gray.500">Chưa có lịch sử làm bài.</Text>
        ) : (
          <Table.Root variant="simple" size="md">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>STT</Table.ColumnHeader>
                <Table.ColumnHeader>Tên bài</Table.ColumnHeader>
                <Table.ColumnHeader>Số câu đúng</Table.ColumnHeader>
                <Table.ColumnHeader>Ngày làm bài</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((result, idx) => (
                <Table.Row key={result.id}>
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{result.testId}</Table.Cell>
                  <Table.Cell>{result.score}</Table.Cell>
                  <Table.Cell>{formatDate(result.submittedAt)}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button onClick={() => viewDetail(result)} colorPalette="blue" size="sm">Xem chi tiết</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            < /Table.Body>
          </Table.Root>
        )}
      </Box>
    </Flex>
  );
}