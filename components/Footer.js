'use client'

import {
  Box,
  Flex,
  Menu,
  Stack,
} from '@chakra-ui/react'


export default function Footer() {
  return (
    <>
      <Box background="#f39c12" width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='space-between'>
          <Box>Logo</Box>

          {/*<Flex alignItems='center'>*/}
          {/*  <Stack direction='row' spacing={7}>*/}

          {/*    <Menu>*/}

          {/*    </Menu>*/}
          {/*  </Stack>*/}
          {/*</Flex>*/}
        </Flex>
      </Box>
    </>
  )
}