'use client'

import {
  Box,
  Flex, Image, Text
} from '@chakra-ui/react'


export default function Footer() {
  return (
    <>
      <Box backgroundColor="#fff" style={{borderTop: '2px solid rgb(29 129 174)'}} width="100%" padding="4" color='white'>
        <Flex alignItems='center' justifyContent='center'>
          <Flex width="100%" gap={16} maxW="1200px" justifyContent="flex-start" alignItems="flex-start">
            {/*Cột 1: Logo và giới thiệu*/}

            <Box minW="200px">
              <Box fontWeight="bold" fontSize="xl" mb={2}>
                <Image src="/logo_toeic.png" height={'120px'}/>
              </Box>
              {/*<Box fontSize="sm" color={'#191e44'}>Cơ sở TOEIC chuyên luyện thi TOEIC chất lượng cao, giúp bạn đạt mục tiêu điểm số nhanh chóng và hiệu quả.</Box>*/}
            </Box>


            {/* Cột 2: Chính sách */}
            <Box flex="2" minW="200px">
              <Text
                borderRadius={'xl'}
                textAlign={'justify'}
                border={'1px dashed #2aa9c7'}
                p={4}
                bg={'#ecf6f8'}
                fontSize="md" color={'#000'}>Chúng tôi luôn mong muốn giúp bạn phát triển, đồng hành cùng bạn trên hành trình tốt nghiệp cùng với sự cam kết về chất lượng giảng dạy mà THD cung cấp.</Text>
            </Box>

            {/* Cột 3: Để trống hoặc bổ sung sau */}
            <Box flex="1" minW="200px">
              <Box fontWeight="bold" fontSize="lg" mb={2}  color={'#191e44'}>CONTACT US</Box>
              <Box as="ul" fontSize="sm" pl={4} color={'#191e44'} listStyleType="none">
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Image src="/icons/phone.svg" width="20px" mr={2} alt="Phone icon" />
                  <Text fontWeight="bold">
                    <a href="tel:0368348226" target="_blank">036 834 8226</a></Text>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Image src="/icons/mail-icon.svg" width="20px" mr={2} alt="Email icon" />
                  <Text fontWeight="bold">
                    <a href="mailto:990toeichadong.edu@gmail.com" target="_blank">990toeichadong.edu@gmail.com</a></Text>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Image src="/icons/internet-icon.svg" width="20px" mr={2} alt="Website icon" />
                  <Text fontWeight="bold">https://990toeichadong.com/</Text>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Image src="/icons/facebook-icon.svg" width="20px" mr={2} alt="Facebook icon" />
                  <Text fontWeight="bold">
                    <a href="https://www.facebook.com/share/16Ungr75vV/?mibextid=wwXIfr" target="_blank">TOEIC HÀ ĐÔNG</a></Text>
                </li>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}