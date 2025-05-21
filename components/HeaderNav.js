'use client'

import {
  Box, Button,
  Flex, Menu, Text,
  Portal, Avatar, Image
} from '@chakra-ui/react'
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HeaderNav() {
  const router = useRouter()
  const {data: session, status} = useSession()

  return (
    <>
      <Box background="linear-gradient(to right, #2a3380 0%, #04adc9 100%);" border="1px #283382" width="100%" padding="2" color='white'>
        <Flex alignItems='center' justifyContent='space-between'>
          <Flex alignItems={'center'}>
            <Box style={{cursor: "pointer"}} onClick={() => router.push('/')}>
              <Image src="/logo_toeic_white.png" height='60px'/>
            </Box>
            <Text color='#fff' fontWeight='bold'>HỆ THỐNG THI TRỰC TUYẾN </Text>

          </Flex>

          {status === "loading" ? <Box/> : !session ?
            (<Button borderRadius="full" fontWeight="bold" variant="outline" onClick={() => signIn('google')}>Login</Button>)
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
                      <Menu.Item _hover={{
                        bg: '#e4e4e7'
                      }} onClick={() => router.push('/profile')}>Your profile</Menu.Item>
                      <Menu.Item _hover={{
                        bg: '#e4e4e7'
                      }} onClick={() => signOut()}>Sign out</Menu.Item>
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