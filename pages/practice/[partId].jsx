import {useState, useEffect} from "react";
import ExamDetail from "@/components/common/ExamDetail";
import {
  Box,
  Button, CloseButton,
  Dialog,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Portal, RadioGroup,
  Stack,
  Tabs,
  Text,
  VStack
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {Constant} from "@/constants";
import AudioCommon from "@/components/common/AudioCommon";

export default function Page() {
  const router = useRouter();

  const {partId} = router.query;

  const [stepIntro, setStepIntro] = useState(0);
  const [listQuestion, setListQuestion] = useState([]);
  const [practiceTime, setPracticeTime] = useState(0);

  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [testResults, setTestResults] = useState({
    correctAnswers: 0,
    inCorrectAnswers: 0,
    skippedAnswers: 0
  });
  useEffect(() => {
    if (!partId) return;
    fetch(`/api/part/${partId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '==============')
        setListQuestion(data.questionsJson || []);
      })
      .catch(() => setListQuestion([]));
  }, [partId]);

  function getPartName(partId) {
    const parts = [
      {name: 'Part 1', value: 'part_1'},
      {name: 'Part 2', value: 'part_2'},
      {name: 'Part 3', value: 'part_3'},
      {name: 'Part 4', value: 'part_4'},
      {name: 'Part 5', value: 'part_5'},
      {name: 'Part 6', value: 'part_6'},
      {name: 'Part 7', value: 'part_7'},
    ];
    const found = parts.find(part => part.value === partId);
    return found ? found.name : '';
  }

  const nextStep = () => setStepIntro(stepIntro + 1);
  const backToHome = () => router.push('/');

  const handleSubmit = (result) => {
    let correctAnswers = 0;
    let skippedAnswers = 0;
    let inCorrectAnswers = 0;

    listQuestion.forEach(quest => {
      const userAnswer = (result.answers || result)[quest.index];
      if (!result[quest.index]) skippedAnswers++;
      const isCorrect = userAnswer === quest.correct;
      if (isCorrect) correctAnswers++; else inCorrectAnswers++;
    });

    setTestResults({
      correctAnswers,
      skippedAnswers,
      inCorrectAnswers
    })
    nextStep();
  }

  return (
    <>
      {
        stepIntro === 0 && (
          <Box
            minH={'80vh'}
            background="white"
            boxShadow="lg"
            borderRadius="lg"
            padding={6}
            mb={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text fontSize="lg" color="gray.800" mb={4} textAlign="center">
              Bắt đầu luyện tập <strong> {getPartName(partId)}</strong>
            </Text>
            <Box mb={3}>
              <Text fontWeight="bold" mb={1}>Nhập thời gian làm bài (phút):</Text>
              <Input
                type="number"
                min={1}
                max={200}
                width="120px"
                value={practiceTime / 60}
                onChange={e => setPracticeTime(Number(e.target.value) * 60)}
              />
            </Box>

            <Button colorPalette="teal" onClick={nextStep}>
              Bắt đầu
            </Button>
          </Box>
        )
      }

      {
        stepIntro === 1 && <ExamDetail
          listQuestion={listQuestion}
          timer={practiceTime}
          disableSelectListen={false}
          onSubmit={(e) => handleSubmit(e)}
        ></ExamDetail>
      }

      {
        stepIntro === 2 && (
          <Box p={8}>
            <Stack boxShadow="2xl" bg="white" rounded="xl" p={4} spacing={8} width="100%" align="left">

              <Flex align={'center'} gap={4}>
                <Heading> Kết quả luyện tập <strong> {getPartName(partId)}</strong></Heading>
                <Button
                  size="sm"
                  colorPalette="teal"
                  variant="outline"
                  onClick={backToHome}
                >Quay lại trang chủ</Button>
              </Flex>

              <Flex direction="column" align="left" justify="center">
                <Box mb={2} mt={2}>
                  <HStack spacing={4}>
                    <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center" boxShadow="md"
                         display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Text pt={30} color={'#36cc71'}>Tổng câu đúng</Text>
                      <Text fontSize="lg" fontWeight="bold">{testResults.correctAnswers}</Text>
                    </Box>

                    <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center" boxShadow="md"
                         display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Image src="/icons/cancel-icon.svg" alt="wrong-icon" boxSize="30px"/>
                      <Text color={'#e74c3d'}>Sai</Text>
                      <Text fontSize="lg" fontWeight="bold">{testResults.inCorrectAnswers}</Text>
                    </Box>
                    <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center" boxShadow="md"
                         display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Image src="/icons/minus-circle.svg" alt="wrong-icon" boxSize="30px"/>
                      <Text>Bỏ qua</Text>
                      <Text fontSize="lg" fontWeight="bold">{testResults.skippedAnswers}</Text>
                    </Box>
                    <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center" boxShadow="md"
                         display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      <Text pt={30}>Tổng</Text>
                      <Text fontSize="lg" fontWeight="bold">{listQuestion.length}</Text>
                    </Box>
                  </HStack>
                </Box>
              </Flex>
            </Stack>


            {/*<Stack boxShadow="2xl" mt={8} bg="white" rounded="xl" p={3} spacing={8} height={'70vh'} width="100%" align="left">*/}
            {/*  <Heading fontWeight="bold" mt={4}>Đáp án:</Heading>*/}
            {/*  <VStack align="stretch" spacing={4} height={'100%'} overflowY="scroll">*/}
            {/*    <Tabs.Root defaultValue="PART_1">*/}
            {/*      <Tabs.List>*/}
            {/*        {Object.keys(groupedQuestions).map((part, idx) => (*/}
            {/*          <Tabs.Trigger key={idx} value={part}>*/}
            {/*            <Text fontWeight="bold">Part {part.replace("PART_", "")}</Text>*/}
            {/*          </Tabs.Trigger>*/}
            {/*        ))}*/}
            {/*      </Tabs.List>*/}

            {/*      {Object.keys(groupedQuestions).map((part, idx) => (*/}
            {/*        <Tabs.Content key={idx} value={part}>*/}
            {/*          <Box pt={0} p={8}>*/}
            {/*            <Flex gap="4" wrap="wrap" justify={'start'}>*/}
            {/*              {groupedQuestions[part].map((q) => (*/}
            {/*                <Box p="1" key={q.index} mb={1}>*/}
            {/*                  <HStack gap="1">*/}
            {/*                    <Text*/}
            {/*                      textStyle="md">{q.index} - {getAnswer(q.correct)} :</Text>*/}
            {/*                    <Text style={{color: result?.[q.index] === q.correct ? '#2ecc71' : '#e74c3c'}}>{result?.[q.index] ? getAnswer(result?.[q.index]) : "Chưa trả lời"} </Text>*/}
            {/*                    {*/}
            {/*                      result?.[q.index] === q.correct ? (*/}
            {/*                        <Image src="/icons/correct.svg" alt="correct-icon" boxSize="12px" />*/}
            {/*                      ) : (*/}
            {/*                        <Image src="/icons/wrong.svg" alt="wrong-icon" boxSize="12px" />*/}
            {/*                      )*/}
            {/*                    }*/}
            {/*                    <Image style={{cursor: 'pointer'}} onClick={() => viewDetailQuestion(q)} src="/icons/open-external.svg" alt="open-extenal-icon" boxSize="16px" />*/}
            {/*                    /!*<Text style={{cursor: 'pointer', color: '#2563eb'}} >[detail]</Text>*!/*/}
            {/*                  </HStack>*/}
            {/*                </Box>*/}
            {/*              ))}*/}
            {/*            </Flex>*/}
            {/*          </Box>*/}
            {/*        </Tabs.Content>*/}
            {/*      ))}*/}
            {/*    </Tabs.Root>*/}
            {/*  </VStack>*/}
            {/*</Stack>*/}


            {/*<Dialog.Root  lazyMount open={openDialog} onOpenChange={(e) => { setOpenDialog(e.open); if (!e.open) setCurrentQuestion(null); }} size="cover" placement="center" scrollBehavior="inside">*/}
            {/*  <Portal>*/}
            {/*    <Dialog.Backdrop />*/}
            {/*    <Dialog.Positioner>*/}
            {/*      <Dialog.Content>*/}
            {/*        <Dialog.Header>*/}
            {/*          <Dialog.Title>Chi tiết câu {currentQuestion && currentQuestion.index}</Dialog.Title>*/}
            {/*          <Dialog.CloseTrigger asChild>*/}
            {/*            <CloseButton size="sm" />*/}
            {/*          </Dialog.CloseTrigger>*/}
            {/*        </Dialog.Header>*/}
            {/*        <Dialog.Body>*/}
            {/*          {currentQuestion && (*/}
            {/*            <Box>*/}
            {/*              <VStack align="start" spacing={2} mb={3}>*/}
            {/*                {currentQuestion.answers && currentQuestion.answers.map((ans, idx) => (*/}
            {/*                  <Box key={idx} p={2} borderRadius="md" bg={currentQuestion.correct === idx+1 ? 'green.100' : (result && result[currentQuestion.index] === idx+1 ? 'red.100' : 'gray.50')} border={currentQuestion.correct === idx+1 ? '2px solid #38A169' : '1px solid #E2E8F0'}>*/}
            {/*                    <Text><b>{getAnswer(idx+1)}.</b> {ans}</Text>*/}
            {/*                  </Box>*/}
            {/*                ))}*/}
            {/*              </VStack>*/}
            {/*              <Text fontWeight="semibold" color="green.600">Đáp án đúng: {getAnswer(currentQuestion.correct)}</Text>*/}
            {/*              {result && result[currentQuestion.index] && result[currentQuestion.index] !== currentQuestion.correct && (*/}
            {/*                <Text color="red.500">Bạn chọn: {getAnswer(result[currentQuestion.index])}</Text>*/}
            {/*              )}*/}
            {/*              <Box mt={3} p={2} bg="yellow.50" borderRadius="md">*/}
            {/*                <>*/}
            {/*                  /!*<Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>*!/*/}
            {/*                  {(() => {*/}
            {/*                    const media = getGroupMediaForParts(currentQuestion);*/}
            {/*                    return (*/}
            {/*                      <>*/}
            {/*                        {media.imgLink && (*/}
            {/*                          <Box mb={6} textAlign="center">*/}
            {/*                            <Image src={media.imgLink}/>*/}
            {/*                          </Box>*/}
            {/*                        )}*/}
            {/*                        {media.audioLink && (*/}
            {/*                          <AudioCommon audioLink={media.audioLink}/>*/}
            {/*                        )}*/}
            {/*                      </>*/}
            {/*                    );*/}
            {/*                  })()}*/}
            {/*                  {currentQuestion.description && <Text mb={2} fontWeight='bold'>{currentQuestion.description}</Text>}*/}
            {/*                  <RadioGroup.Root*/}
            {/*                    onValueChange={() => null}*/}
            {/*                    value={result[currentQuestion.index] || ""}*/}
            {/*                  >*/}
            {/*                    <VStack align="start" spacing={2}>*/}
            {/*                      {(currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (*/}
            {/*                        <RadioGroup.Item key={index} value={(index + 1)}>*/}
            {/*                          <RadioGroup.ItemHiddenInput/>*/}
            {/*                          <RadioGroup.ItemIndicator/>*/}
            {/*                          <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>*/}
            {/*                        </RadioGroup.Item>*/}
            {/*                      ))}*/}
            {/*                    </VStack>*/}
            {/*                  </RadioGroup.Root>*/}
            {/*                </>*/}
            {/*                <Text fontWeight="bold" my={2}>Giải thích:</Text>*/}
            {/*                {currentQuestion.explanation ? (*/}
            {/*                  <Box*/}
            {/*                    as="div"*/}
            {/*                    dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}*/}
            {/*                  />*/}
            {/*                ) : (*/}
            {/*                  <Text>Không có giải thích.</Text>*/}
            {/*                )}*/}
            {/*              </Box>*/}
            {/*            </Box>*/}
            {/*          )}*/}
            {/*        </Dialog.Body>*/}
            {/*      </Dialog.Content>*/}
            {/*    </Dialog.Positioner>*/}
            {/*  </Portal>*/}
            {/*</Dialog.Root>*/}
          </Box>
        )
      }
    </>

  )
}