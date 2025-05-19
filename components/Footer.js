'use client'

import {
  Box,
  Flex, Image
} from '@chakra-ui/react'


export default function Footer() {
  return (
    <>
      <Box backgroundColor="#fff" style={{borderTop: '2px solid rgb(29 129 174)'}} width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='center'>
          <Flex width="100%" gap={16} maxW="1200px" justifyContent="space-between" alignItems="flex-start">
            {/*Cột 1: Logo và giới thiệu*/}

            <Box flex="1" minW="200px">
              <Box fontWeight="bold" fontSize="xl" mb={2}>
                <Image src="/logo_toeic.png" height={'120px'}/>
              </Box>
              <Box fontSize="sm" color={'#191e44'}>Cơ sở TOEIC chuyên luyện thi TOEIC chất lượng cao, giúp bạn đạt mục tiêu điểm số nhanh chóng và hiệu quả.</Box>
            </Box>


            {/* Cột 2: Chính sách */}
            <Box flex="1" minW="200px">
              <Box fontWeight="bold" fontSize="lg" mb={2}  color={'#191e44'}>Chính sách</Box>
              <Box as="ul" fontSize="sm" pl={4}  color={'#191e44'}>
                <li>Chính sách bảo mật</li>
                <li>Điều khoản sử dụng</li>
                <li>Chính sách hoàn tiền</li>
              </Box>
            </Box>

            {/* Cột 3: Để trống hoặc bổ sung sau */}
            <Box flex="1" minW="200px"></Box>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}