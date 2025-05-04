import {Box, Button, Flex, Tabs, Heading, HStack, Stack, Text, VStack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Constant} from "@/constants";

const groupByPart = (questions) => {
  const grouped = {};
  questions.forEach((question) => {
    const part = question.type || "UNKNOWN";
    if (!grouped[part]) {
      grouped[part] = [];
    }
    grouped[part].push(question);
  });
  return grouped;
};

export default function Page() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [dataExam, setDataExam] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState({});


  useEffect(() => {
    if (!router.query.id) {
      return;
    }
    // fetch Data
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/test/${router.query.id}`)
      .then((response) => response.json())
      .then(res => {
        const data = res.data;
        setDataExam(data);
        setGroupedQuestions(groupByPart(data.questionsJson));
      })
      .catch(err => {
        console.log(err, "error")
      })

    // fetch Result Exam
    const resultData = localStorage.getItem(`${router.query.id}-${Constant.RESULT}`);
    if (resultData) {
      const parsedData = JSON.parse(resultData);
      console.log("da", resultData)
      setResult(resultData);
    }

  }, [router.query.id]);

  useEffect(() => {

  }, []);

  function setCurrentQuestion(q) {

  }

  function getAnswer(index) {
    switch (index) {
      case 1: return "A";
      case 2: return "B";
      case 3: return "C";
      case 4: return "D";
      default: return null;
    }
  }

  return (
    <>
      <Heading> Kết quả đề thi: {dataExam?.name}</Heading>


      <Text fontWeight="bold" mt={4}>Đáp án:</Text>


      <Stack boxShadow="2xl" bg="white" rounded="xl" p={3} spacing={8} height="100vh" width="100%" align="center">
        <Heading size="md" mb={4}>Câu hỏi</Heading>
        <VStack align="stretch" spacing={4} overflowY="scroll">
          <Tabs.Root defaultValue="PART_1">
            <Tabs.List>
              {Object.keys(groupedQuestions).map((part, idx) => (
                <Tabs.Trigger key={idx} value={part}>
                  <Text fontWeight="bold">Part {part.replace("PART_", "")}</Text>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {Object.keys(groupedQuestions).map((part, idx) => (
              <Tabs.Content key={idx} value={part}>
                <Box pt="6px">
                  <Text fontWeight="bold" mb={2}>Questions for Part {part.replace("PART_", "")}</Text>
                  <Flex gap="4" wrap="wrap"  justify={'space-around'} >
                    {groupedQuestions[part].map((q) => (
                      <Box key={q.index} width={{ base: '100%', md: '48%' }} mb={4}>
                        <Text >{q.index} - {getAnswer(q.index)} </Text>

                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </VStack>
      </Stack>

    </>
  )
}