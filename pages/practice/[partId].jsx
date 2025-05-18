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
import AnswersComponent from "@/components/common/AnswersComponent";

export default function Page() {
  const router = useRouter();

  const {partId} = router.query;

  const [stepIntro, setStepIntro] = useState(0);
  const [listQuestion, setListQuestion] = useState([]);
  const [practiceTime, setPracticeTime] = useState(0);
  const [answers, setAnswers] = useState({});

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
    setAnswers(result);
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

            <AnswersComponent listQuestion={listQuestion} result={answers}></AnswersComponent>
          </Box>
        )
      }
    </>

  )
}