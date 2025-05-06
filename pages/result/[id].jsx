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
  CloseButton, Image, RadioGroup
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Constant} from "@/constants";
import AudioCommon from "@/components/common/AudioCommon";

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
  const [currentQuestion, setCurrentQuestion] = useState(null);

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
      <Stack boxShadow="2xl" bg="white" rounded="xl" p={4} spacing={8} width="100%" align="left">

        <Heading> Kết quả đề thi: {dataExam?.name}</Heading>

        <Flex direction="column" align="left" justify="center" p={6}>
          <Box mb={4}>
            {/*<Text fontSize="xl" fontWeight="bold">Kết quả bài thi</Text>*/}
            <Text py={1}>{`Câu đúng: ${testResults.correct}`}</Text>
            <Text py={1}>{`Câu sai: ${testResults.incorrect}`}</Text>
            <Text py={1}>{`Câu hỏi bỏ qua: ${testResults.skipped}`}</Text>
            <Text py={1}>{`Tổng số câu hỏi: ${testResults.totalQuestions}`}</Text>
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
                            textStyle="md">{q.index} - {getAnswer(q.correct)} :</Text>
                          <Text style={{color: result[q.index] === q.correct ? '#2ecc71' : '#e74c3c'}}>{result[q.index] ? getAnswer(result[q.index]) : "Chưa trả lời"} </Text>
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


      <Dialog.Root  lazyMount open={openDialog} onOpenChange={(e) => { setOpenDialog(e.open); if (!e.open) setCurrentQuestion(null); }} size="cover" placement="center" scrollBehavior="inside">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Chi tiết câu {currentQuestion && currentQuestion.index}</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                {currentQuestion && (
                  <Box>
                    <VStack align="start" spacing={2} mb={3}>
                      {currentQuestion.answers && currentQuestion.answers.map((ans, idx) => (
                        <Box key={idx} p={2} borderRadius="md" bg={currentQuestion.correct === idx+1 ? 'green.100' : (result && result[currentQuestion.index] === idx+1 ? 'red.100' : 'gray.50')} border={currentQuestion.correct === idx+1 ? '2px solid #38A169' : '1px solid #E2E8F0'}>
                          <Text><b>{getAnswer(idx+1)}.</b> {ans}</Text>
                        </Box>
                      ))}
                    </VStack>
                    <Text fontWeight="semibold" color="green.600">Đáp án đúng: {getAnswer(currentQuestion.correct)}</Text>
                    {result && result[currentQuestion.index] && result[currentQuestion.index] !== currentQuestion.correct && (
                      <Text color="red.500">Bạn chọn: {getAnswer(result[currentQuestion.index])}</Text>
                    )}
                    <Box mt={3} p={2} bg="yellow.50" borderRadius="md">
                      <>
                        {/*<Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>*/}
                        {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}

                        {currentQuestion.imgLink && (
                          <Box mb={6} textAlign="center">
                            <Image src={currentQuestion.imgLink}/>
                          </Box>
                        )}

                        {currentQuestion.audioLink && (
                          <AudioCommon audioLink={currentQuestion.audioLink}/>
                        )}

                        <RadioGroup.Root
                          onValueChange={() => null}
                          value={result[currentQuestion.index] || ""}
                        >
                          <VStack align="start" spacing={2}>
                            {(currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
                              <RadioGroup.Item key={index} value={(index + 1)}>
                                <RadioGroup.ItemHiddenInput/>
                                <RadioGroup.ItemIndicator/>
                                <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                              </RadioGroup.Item>
                            ))}
                          </VStack>
                        </RadioGroup.Root>
                      </>
                      <Text fontWeight="bold" my={2}>Giải thích:</Text>
                      {currentQuestion.explanation ? (
                        <Box
                          as="div"
                          dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                        />
                      ) : (
                        <Text>Không có giải thích.</Text>
                      )}
                    </Box>
                  </Box>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  )
}