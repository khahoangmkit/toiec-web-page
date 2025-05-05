import {
  Box,
  Button,
  Flex,
  Tabs,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
  Dialog,
  Portal,
  CloseButton
} from "@chakra-ui/react";
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

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [dataExam, setDataExam] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [testResults, setTestResults] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    totalQuestions: 0,
  });


  useEffect(() => {
    if (!router.query.id) {
      return;
    }
    // fetch Result Exam
    const resultData = localStorage.getItem(`${router.query.id}-${Constant.RESULT}`);
    if (resultData) {
      const parsedData = JSON.parse(resultData);
      console.log("da", parsedData)
      setResult(parsedData);
    }


  }, [router.query.id]);

  useEffect(() => {
    // fetch Data
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/test/${router.query.id}`)
      .then((response) => response.json())
      .then(res => {
        const data = res.data;
        setDataExam(data);
        setGroupedQuestions(groupByPart(data.questionsJson));

        const results = {
          correct: 0,
          incorrect: 0,
          skipped: 0,
          totalQuestions: data.questionsJson.length,
        };

        // Check answers for each question
        data.questionsJson.forEach(question => {
          const userAnswer = result[question.index];

          if (userAnswer) {
            if (userAnswer === question.correct) {
              results.correct += 1;
            } else {
              results.incorrect += 1;
            }
          } else {
            results.skipped += 1;
          }
        });
        setTestResults(results);

      })
      .catch(err => {
        console.log(err, "error")
      })

  }, [result]);

  function setCurrentQuestion(q) {

  }

  function getAnswer(index) {
    switch (index) {
      case 1:
        return "A";
      case 2:
        return "B";
      case 3:
        return "C";
      case 4:
        return "D";
      default:
        return null;
    }
  }

  function viewDetailQuestion(question) {
    setCurrentQuestion(question)

    setOpenDialog(true);

  }

  return (
    <Box p={8}>
      <Stack boxShadow="2xl" bg="white" rounded="xl" p={3} spacing={8} width="100%" align="left">

        <Heading> Kết quả đề thi: {dataExam?.name}</Heading>

        <Flex direction="column" align="center" justify="center" p={6}>
          <Box mb={4}>
            <Text fontSize="xl" fontWeight="bold">Kết quả bài thi</Text>
            <Text>{`Tổng số câu hỏi: ${testResults.totalQuestions}`}</Text>
            <Text>{`Câu đúng: ${testResults.correct}`}</Text>
            <Text>{`Câu sai: ${testResults.incorrect}`}</Text>
            <Text>{`Câu hỏi bỏ qua: ${testResults.skipped}`}</Text>
          </Box>
        </Flex>
      </Stack>


      <Stack boxShadow="2xl" mt={8} bg="white" rounded="xl" p={3} spacing={8} height={'70vh'} width="100%" align="left">
        <Heading fontWeight="bold" mt={4}>Đáp án:</Heading>
        <VStack align="stretch" spacing={4} height={'100%'} overflowY="scroll">
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
                <Box pt={0} p={8}>
                  <Flex gap="4" wrap="wrap" justify={'start'}>
                    {groupedQuestions[part].map((q) => (
                      <Box p="4" spaceY="2" key={q.index} width={{base: '100%', md: '30%'}} mb={4}>
                        <HStack gap="1">
                          <Text
                            textStyle="md">{q.index} - {getAnswer(q.correct)} : {result[q.index] ? getAnswer(result[q.index]) : "Chưa trả lời"} </Text>
                          <Text style={{cursor: 'pointer', color: '#2563eb'}} onClick={() => viewDetailQuestion(q)}>[detail]</Text>
                        </HStack>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </VStack>
      </Stack>


      <Dialog.Root  lazyMount open={openDialog} onOpenChange={(e) => setOpenDialog(e.open)} size="cover" placement="center" scrollBehavior="inside">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>

              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  )
}