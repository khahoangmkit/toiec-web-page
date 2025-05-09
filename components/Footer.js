'use client'

import {
  Box,
  Flex
} from '@chakra-ui/react'


export default function Footer() {
  return (
    <>
      <Box background="#f39c12" width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='center'>
          <Flex width="100%" gap={16} maxW="1200px" justifyContent="space-between" alignItems="flex-start">
            {/*Cột 1: Logo và giới thiệu*/}

            <Box flex="1" minW="200px">
              <Box fontWeight="bold" fontSize="xl" mb={2}>Logo</Box>
              <Box fontSize="sm">Cơ sở TOEIC chuyên luyện thi TOEIC chất lượng cao, giúp bạn đạt mục tiêu điểm số nhanh chóng và hiệu quả.</Box>
            </Box>


            {/* Cột 2: Chính sách */}
            <Box flex="1" minW="200px">
              <Box fontWeight="bold" fontSize="lg" mb={2}>Chính sách</Box>
              <Box as="ul" fontSize="sm" pl={4}>
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