'use client'

import {
  Box, Button,
  Flex, Menu,
  Portal, Avatar
} from '@chakra-ui/react'
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HeaderNav() {
  const router = useRouter()
  const {data: session, status} = useSession()

  return (
    <>
      <Box background="#f39c12" width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='space-between'>
          <Box>Logo</Box>

          {status === "loading" ? <Box/> : !session ?
            (<Button onClick={() => signIn('google')}>Login</Button>)
            :
            (
              <Menu.Root positioning={{ placement: "bottom" }}>
                <Menu.Trigger rounded="full">
                  <Avatar.Root>
                    <Avatar.Image src={session?.user?.image}/>
                  </Avatar.Root>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item onClick={() => router.push('/profile')}>Your profile</Menu.Item>
                      <Menu.Item onClick={() => signOut()}>Sign out</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            )
          }
        </Flex>
      </Box>
    </>
  )
}