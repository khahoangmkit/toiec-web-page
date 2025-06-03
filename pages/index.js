import Head from "next/head";
import {
  Box,
  Button,
  Tabs,
  Image,
  Text,
  Flex, Stack, Table
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {signIn, useSession} from "next-auth/react";

export default function Home() {

  const router = useRouter();
  const {data: session, status} = useSession()
  // Dữ liệu mẫu cho các bài test
  const testEts = [
    {
      name: "ETS 2024",
      value: 1,
      parts: [
        {
          name: "ETS 2024 - Test 1",
          id: 'ets_2024_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 2",
          id: 'ets_2024_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 3",
          id: 'ets_2024_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 4",
          id: 'ets_2024_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 5",
          id: 'ets_2024_test_5',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 6",
          id: 'ets_2024_test_6',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 7",
          id: 'ets_2024_test_7',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 8",
          id: 'ets_2024_test_8',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 9",
          id: 'ets_2024_test_9',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2024 - Test 10",
          id: 'ets_2024_test_10',
          desc: 'Thời gian: 120 phút'
        },
      ]
    },

    {
      name: "ETS 2023",
      value: 2,
      parts: [
        {
          name: "ETS 2023 - Test 1",
          id: 'ets_2023_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 2",
          id: 'ets_2023_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 3",
          id: 'ets_2023_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 4",
          id: 'ets_2023_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 5",
          id: 'ets_2023_test_5',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 6",
          id: 'ets_2023_test_6',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 7",
          id: 'ets_2023_test_7',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 8",
          id: 'ets_2023_test_8',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 9",
          id: 'ets_2023_test_9',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2023 - Test 10",
          id: 'ets_2023_test_10',
          desc: 'Thời gian: 120 phút'
        },
      ]
    },
    {
      name: "ETS 2022",
      value: 3,
      parts: [
        {
          name: "ETS 2022 - Test 1",
          id: 'ets_2022_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 2",
          id: 'ets_2022_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 3",
          id: 'ets_2022_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 4",
          id: 'ets_2022_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 5",
          id: 'ets_2022_test_5',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 6",
          id: 'ets_2022_test_6',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 7",
          id: 'ets_2022_test_7',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 8",
          id: 'ets_2022_test_8',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 9",
          id: 'ets_2022_test_9',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2022 - Test 10",
          id: 'ets_2022_test_10',
          desc: 'Thời gian: 120 phút'
        },
      ]
    },
    {
      name: "ETS 2021",
      value: 4,
      parts: [
        {
          name: "ETS 2021 - Test 1",
          id: 'ets_2021_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2021 - Test 2",
          id: 'ets_2021_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2021 - Test 3",
          id: 'ets_2021_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2021 - Test 4",
          id: 'ets_2021_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2021 - Test 5",
          id: 'ets_2021_test_5',
          desc: 'Thời gian: 120 phút'
        }
      ]
    },
    {
      name: "ETS 2020",
      value: 5,
      parts: [
        {
          name: "ETS 2020 - Test 1",
          id: 'ets_2020_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 2",
          id: 'ets_2020_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 3",
          id: 'ets_2020_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 4",
          id: 'ets_2020_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 5",
          id: 'ets_2020_test_5',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 6",
          id: 'ets_2020_test_6',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 7",
          id: 'ets_2020_test_7',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 8",
          id: 'ets_2020_test_8',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 9",
          id: 'ets_2020_test_9',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2020 - Test 10",
          id: 'ets_2020_test_10',
          desc: 'Thời gian: 120 phút'
        },
      ]
    },
    {
      name: "ETS 2019",
      value: 6,
      parts: [
        {
          name: "ETS 2019 - Test 1",
          id: 'ets_2019_test_1',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 2",
          id: 'ets_2019_test_2',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 3",
          id: 'ets_2019_test_3',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 4",
          id: 'ets_2019_test_4',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 5",
          id: 'ets_2019_test_5',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 6",
          id: 'ets_2019_test_6',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 7",
          id: 'ets_2019_test_7',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 8",
          id: 'ets_2019_test_8',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 9",
          id: 'ets_2019_test_9',
          desc: 'Thời gian: 120 phút'
        },
        {
          name: "ETS 2019 - Test 10",
          id: 'ets_2019_test_10',
          desc: 'Thời gian: 120 phút'
        },
      ]
    }
  ];

  const toiecTestSection = [
    {
      name: "Listening",
      value: 1,
      parts: [
        {
          name: "Part 1",
          id: 'part_1',
          desc: 'Mô tả tranh'
        },
        {
          name: "Part 2",
          id: 'part_2',
          desc: 'Hỏi và đáp: nghe và chọn câu trả lời phù hợp'

        },
        {
          name: "Part 3",
          id: 'part_3',
          desc: 'Đoạn hội thoại'
        },
        {
          name: "Part 4",
          id: 'part_4',
          desc: 'Bài nói ngắn'
        }
      ]
    },
    {
      name: "Reading",
      value: 2,
      parts: [
        {
          name: "Part 5",
          id: 'part_5',
          desc: 'Hoàn thành câu'
        },
        {
          name: "Part 6",
          id: 'part_6',
          desc: 'Hoàn thành đoạn văn'
        },
        {
          name: "Part 7",
          id: 'part_7',
          desc: 'Đọc hiểu'
        }
      ]
    }
  ];

  const topStudents = [
    {
      fullName: "Nguyễn Mạnh Quân",
      testName: 'ETS 2024 - Test 1',
      readingCorrect: 90,
      listeningCorrect: 95,
      totalCorrect: 185
    },
    {
      fullName: "Nguyễn Văn Dũng",
      testName: 'ETS 2024 - Test 1',
      readingCorrect: 85,
      listeningCorrect: 90,
      totalCorrect: 175
    },
    {
      fullName: "Đặng Thị Hằng Nga",
      testName: 'ETS 2024 - Test 2',
      readingCorrect: 85,
      listeningCorrect: 85,
      totalCorrect: 170
    },
    {
      fullName: "Đỗ Thu Trang",
      testName: 'ETS 2024 - Test 3',
      readingCorrect: 80,
      listeningCorrect: 80,
      totalCorrect: 160
    },
    {
      fullName: "Nguyễn Thị Ngọc Linh",
      testName: 'ETS 2024 - Test 3',
      readingCorrect: 65,
      listeningCorrect: 75,
      totalCorrect: 140
    },
    {
      fullName: "Nguyễn Tiến Toàn",
      testName: 'ETS 2024 - Test 3',
      readingCorrect: 55,
      listeningCorrect: 65,
      totalCorrect: 120
    }
  ];

  function goToFullTest(id) {
    if (session) {
      router.push(`/test/${id}`);
    } else {
      signIn('google', {callbackUrl: `/test/${id}`});
    }
  }

  function goToPracticeByPart(id) {
    router.push(`/practice/${id}`);
  }

  function getContentRank(idx) {
    switch (idx) {
      case 0:
        return <Image src="/icons/top1.png" alt="first" width="30px"/>
      case 1:
        return <Image src="/icons/top2.png" alt="second" width="30px"/>
      case 2:
        return <Image src="/icons/top3.png" alt="third" width="30px"/>
      default:
        return <div style={{width: "30px", textAlign: "center"}}>{idx + 1}</div>;
    }
  }

  return (
    <>
      <Head>
        <title>TOEIC Hà Đông - Luyện thi TOEIC online, đề thi thử chuẩn</title>
        <meta name="description"
              content="990toeichadong.com - Nền tảng luyện thi TOEIC online, cung cấp đề thi thử TOEIC mới nhất, mẹo làm bài, giải thích chi tiết, luyện tập các kỹ năng nghe, đọc, giúp bạn đạt điểm cao TOEIC."/>
        <meta name="keywords"
              content="TOEIC, luyện thi TOEIC, đề thi thử TOEIC, thi thử TOEIC, luyện nghe TOEIC, luyện đọc TOEIC, mẹo thi TOEIC, 990toeichadong, toeic online, đề thi TOEIC mới nhất"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="index, follow"/>
        <meta name="author" content="hoangdk"/>
        <meta name="language" content="vi"/>
        <link rel="canonical" href="https://990toeichadong.com/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://990toeichadong.com/"/>
        <meta property="og:title" content="TOEIC Hà Đông - Luyện thi TOEIC online, đề thi thử chuẩn"/>
        <meta property="og:description"
              content="990toeichadong.com - Nền tảng luyện thi TOEIC online, cung cấp đề thi thử TOEIC mới nhất, mẹo làm bài, giải thích chi tiết, luyện tập các kỹ năng nghe, đọc, giúp bạn đạt điểm cao TOEIC."/>
        <meta property="og:image" content="/og-image.jpg"/>
        <meta property="og:site_name" content="990toeichadong.com"/>
        <meta property="og:locale" content="vi_VN"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="TOEIC Hà Đông - Luyện thi TOEIC online, đề thi thử chuẩn"/>
        <meta name="twitter:description"
              content="990toeichadong.com - Nền tảng luyện thi TOEIC online, cung cấp đề thi thử TOEIC mới nhất, mẹo làm bài, giải thích chi tiết, luyện tập các kỹ năng nghe, đọc, giúp bạn đạt điểm cao TOEIC."/>
        <meta name="twitter:image" content="/og-image.jpg"/>
        <link rel="icon" href="/logo_toeic.png" sizes="32x32" type="image/png" id="favicon.ico"/>
      </Head>
      {/* Banner */}
      <Stack
        boxShadow="2xl"
        bg='gray.50'
        rounded="xl"
        p={4}
        spacing={8}
        width="100%"
        align="center">

        <Box width='100%' maxW="1200px" bg='white' rounded='xl' p={4} mx="auto" overflow="hidden" mb={2} boxShadow="xl">
          <Image src="/banner.jpeg" alt="Banner" width="100%" height="100%" objectFit="cover"/>
        </Box>

        {/* Luyện đề thi */}
        <Box width='100%' maxW="1200px" bg='white' rounded='xl' p={8} mx="auto" my={2} boxShadow="xl">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Làm bài thi TOEIC</Text>

          <Tabs.Root lazyMount unmountOnExit defaultValue={1}>
            <Tabs.List>
              {
                testEts.map((section, idx) => (
                  <Tabs.Trigger key={idx} value={section.value}>{section.name}</Tabs.Trigger>
                ))
              }
            </Tabs.List>

            {
              testEts.map((section, idx) => (
                <Tabs.Content key={idx} value={section.value}>
                  <Flex gap={4} wrap="wrap" justify={'start'}>
                    {section.parts.map((part, idp) => (
                      <Box borderWidth={1} borderRadius='2xl' p="6" spaceY="2" key={`part-${idp}`}
                           width={{base: '100%', md: '30%'}} mb={4} transition="transform 0.2s, box-shadow 0.2s"
                           _hover={{boxShadow: 'dark-lg', transform: 'translateY(-4px) scale(1.03)'}}>
                        <Text fontWeight='bold'>{part.name}</Text>
                        <Text>{part.desc}</Text>

                        <Button
                          onClick={() => {
                            goToFullTest(part.id)
                          }}
                          bg="#283382"
                          _hover={{
                            bg: "#2aa9c7",   // Màu nền khi hover
                          }}
                          variant="solid">
                          Take test
                        </Button>
                      </Box>
                    ))}
                  </Flex>
                </Tabs.Content>
              ))
            }
          </Tabs.Root>
        </Box>

        {/* Luyện thi theo từng phần */}
        <Box width='100%' maxW="1200px" bg='white' rounded='xl' p={8} mx="auto" my={2} boxShadow="xl">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Luyện thi theo từng phần</Text>
          <Tabs.Root lazyMount unmountOnExit defaultValue={1}>
            <Tabs.List>
              {
                toiecTestSection.map((section, idx) => (
                  <Tabs.Trigger key={idx} value={section.value}>{section.name}</Tabs.Trigger>
                ))
              }
            </Tabs.List>

            {
              toiecTestSection.map((section, idx) => (
                <Tabs.Content key={idx} value={section.value}>
                  <Flex gap={4} wrap="wrap" justify={'start'}>
                    {section.parts.map((part, idp) => (
                      <Box borderWidth={1}
                           borderRadius='2xl'
                           p="6"
                           spaceY="2"
                           key={`part-${idp}`}
                           width={{base: '100%', md: '30%'}}
                           mb={4}
                           transition="transform 0.2s, box-shadow 0.2s"
                           _hover={{boxShadow: 'dark-lg', transform: 'translateY(-4px) scale(1.03)'}}>

                        <Flex justifyContent="space-between">
                          <Text fontWeight='bold'>{part.name}</Text>
                          <Image style={{cursor: 'pointer'}} src='/icons/lock.svg' alt='lock-icon' boxSize='16px'/>
                        </Flex>
                        <Text height={'48px'}>{part.desc}</Text>

                        <Button
                          onClick={() => {
                            goToPracticeByPart(part.id)
                          }}
                          bg="#283382"
                          _hover={{
                            bg: "#2aa9c7",   // Màu nền khi hover
                          }}
                          disabled
                          variant="solid">
                          Take test
                        </Button>
                      </Box>
                    ))}
                  </Flex>
                </Tabs.Content>
              ))
            }
          </Tabs.Root>
        </Box>

        {/* Đánh giá của học sinh */}
        <Box width='100%' maxW="1200px" bg='white' rounded='xl' p={8} mx="auto" my={2} boxShadow="xl">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Leaderboard</Text>


          <Table.ScrollArea rounded="md" height="500px">
            <Table.Root variant="simple" size="md" stickyHeader>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader fontWeight="bold">Top</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Tên học viên</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">TEST</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Phần nghe</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Phần đọc</Table.ColumnHeader>
                  <Table.ColumnHeader fontWeight="bold">Tổng điểm</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {topStudents.map((student, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>{getContentRank(idx)}</Table.Cell>
                    <Table.Cell>{student.fullName}</Table.Cell>
                    <Table.Cell>{student.testName}</Table.Cell>
                    <Table.Cell>{student.readingCorrect * 5}</Table.Cell>
                    <Table.Cell>{student.listeningCorrect * 5}</Table.Cell>
                    <Table.Cell>{student.totalCorrect * 5}</Table.Cell>
                  </Table.Row>
                ))}
              < /Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>

      </Stack>
    </>
  );
}
