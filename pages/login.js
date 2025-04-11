import {Button, Flex, Heading, Stack, Wrap} from "@chakra-ui/react";


export default function Login() {
  const handleLogin = () => {
    // TODO: Thay bằng logic đăng nhập thật (Google OAuth)
    alert('Login with Google clicked!')
  }

  return (
    <Flex
      minH={'80vh'}
      align={'top'}
      justify={'center'}
      py={12}
      bg='gray.50'>
      <Wrap>
      <Stack
        boxShadow={'2xl'}
        bg='white'
        rounded={'xl'}
        p={10}
        spacing={8}
        align={'center'}>
        <Heading size="md">Đăng nhập để tiếp tục</Heading>

        <Button
          colorScheme="gray"
          variant="outline"
          size="lg"
          onClick={handleLogin}
        >
          Đăng nhập với Google
        </Button>
      </Stack>
      </Wrap>

    </Flex>
  )

}