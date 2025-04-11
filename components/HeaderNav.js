'use client'

import {
  Box, Button,
  Flex,
} from '@chakra-ui/react'
import {useRouter} from "next/router";


export default function HeaderNav() {
  const router = useRouter()

  return (
    <>
      <Box background="#f39c12" width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='space-between'>
          <Box>Logo</Box>

          <Button onClick={() => router.push('/login')}>Login</Button>
        </Flex>
      </Box>
    </>
  )
}