import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  HStack,
  VStack,
  Text,
  Image,
  RadioGroup, IconButton, Group
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import AudioCommon from "@/components/common/AudioCommon";
import ActionHeaderTest from "@/components/common/ActionHeaderTest";
import {useRouter} from "next/router";
import {Constant} from "@/constants";

const singleQuestion = ["PART_1", "PART_2", "PART_5"];

const groupByPartForSelectQuestion = (questions) => {
  const grouped = {};
  for (const q of questions) {
    const part = q.type || "UNKNOWN";
    if (!grouped[part]) grouped[part] = [];
    grouped[part].push(q);
  }
  return Object.entries(grouped).map(([part, qs]) => ({part, questions: qs}));
};

const groupQuestions = (questions) => {
  const groups = [];
  let currentGroup = [];
  let currentType = '';

  questions.forEach((q) => {
    if (q.audioLink || q.imgLink || currentType !== q.type) {
      if (currentGroup.length) {
        groups.push(currentGroup);
      }
      currentGroup = [q];
    } else {
      currentGroup.push(q);
    }

    currentType = q.type;
  });

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups;
};

export default function Page() {
  const router = useRouter();

  const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState([]); // Sử dụng useState cho groupedQuestions
  const [partForSelectQuestion, setPartForSelectQuestion] = useState([]);
  const [listQuestion, setListQuestion] = useState([]);


  useEffect(() => {
    if (!router.query.id) {
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/test/${router.query.id}`)
      .then((response) => response.json())
      .then( res => {
        const data = res.data;
        setGroupedQuestions(groupQuestions(data.questionsJson));
        setPartForSelectQuestion(groupByPartForSelectQuestion(data.questionsJson));
        setListQuestion(data.questionsJson)
        setCurrentQuestion(data.questionsJson[0]);
      })
      .catch(err => {
        console.log(err, "error")})
  }, [router.query.id]);


  useEffect(() => {
    const selectedQuestion = listQuestion[currentIndexQuestion - 1];
    if (!selectedQuestion) {
      return;
    }

    const isGroupQuestion = !singleQuestion.includes(selectedQuestion.type);  // Kiểm tra là câu hỏi nhóm

    if (isGroupQuestion) {
      // Tìm nhóm câu hỏi hiện tại
      const group = groupedQuestions.find(g => g.some(q => q.index === selectedQuestion.index));
      const firstQuestion = group[0];
      const groupQuestions = group.map(q => q); // Lấy tất cả câu hỏi trong nhóm

      setCurrentQuestion({
        audioLink: firstQuestion.audioLink,
        imgLink: firstQuestion.imgLink,
        questions: groupQuestions
      })
    } else {
      setCurrentQuestion(selectedQuestion); // Nếu không phải câu hỏi nhóm, chỉ hiển thị câu hỏi đơn
    }
  }, [currentIndexQuestion, listQuestion]);

  const handleAnswerChange = (value, indexQuestion) => {
    setAnswers({...answers, [indexQuestion]: value.value});
  };

  const handleNext = () => {
    if (currentIndexQuestion < listQuestion.length) {
      setCurrentIndexQuestion(currentIndexQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndexQuestion > 1) {
      setCurrentIndexQuestion(currentIndexQuestion - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem(`${router.query.id}-${Constant.RESULT}`, JSON.stringify(answers));
    router.push(`/result/${router.query.id}`);
    console.log('Submitted answers:', answers);
  };

  // Handle Reload page

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = ''; // Chrome yêu cầu returnValue, nội dung hiện tại các trình duyệt bỏ qua
  //   };
  //
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const handleTimeUp = () => {
    alert("hello ads")
  }

  return (
    <Flex
      minH={'80vh'}
      align={'top'}
      justify={'space-around'}
      py={4}
      bg='gray.50'>
      <Stack
        boxShadow={'2xl'}
        bg='white'
        rounded={'xl'}
        p={3}
        w={'18%'}
        spacing={8}
        height={'100vh'}
        align={'center'}>
        <Heading size="md" mb={4}>List question</Heading>
        <VStack align="stretch" spacing={4} overflowY={'scroll'}>
          {partForSelectQuestion.map((partGroup, idx) => (
            <Box key={idx} pt={'6px'}>
              <Text fontWeight="bold" mb={1}>Part {partGroup.part.replace("PART_", "")}</Text>
              <HStack wrap="wrap" spacing={2}>
                {partGroup.questions.map((q) => (
                  <Button
                    key={q.index}
                    size="sm"
                    variant={q.index === currentIndexQuestion ? "solid" : (answers[q.index] ? "solid" : "outline")}
                    colorPalette={q.index === currentIndexQuestion || answers[q.index] ? "green" : "teal"}
                    onClick={() => setCurrentIndexQuestion(q.index)}
                  >
                    {q.index}
                  </Button>

                ))}
              </HStack>
            </Box>
          ))}
        </VStack>
      </Stack>


      <Stack
        boxShadow={'2xl'}
        bg='white'
        rounded={'xl'}
        p={4}
        pl={10}
        w={'80%'}
        spacing={8}
        height={'100vh'}
        align={'left'}
        divideY="2px">
        <Stack width={'100%'} direction="row" spacing={4} mt={4} mb={4}>
          <ActionHeaderTest
            currentQuestion={currentQuestion}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
            mockData={partForSelectQuestion}
          />
        </Stack>

        {/*<Stack overflowY={'scroll'}>*/}
        { currentQuestion && <Box pt={4} height='100%'>
          {
            singleQuestion.includes(currentQuestion.type) && (
              <>
                <Flex height='100%' direction="row" gap={8}>
                  {/* Cột 1: Ảnh và audio */}
                  <Box overflowY={'scroll'} minWidth='40%' maxWidth='60%' style={{maxHeight: 'calc(100% - 80px)'}}  bg="gray.100" p={6} borderRadius="md" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">

                    {currentQuestion.audioLink && (
                      <AudioCommon audioLink={currentQuestion.audioLink}/>
                    )}

                    {currentQuestion.imgLink && (
                      <Box mb={6} textAlign="center">
                        <Image src={currentQuestion.imgLink}/>
                      </Box>
                    )}

                  </Box>

                  {/* Cột 2: Câu hỏi */}
                  <Box flex={1}>
                    <Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>
                    {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}

                    <RadioGroup.Root
                      onValueChange={(e) => handleAnswerChange(e, currentQuestion.index)}
                      value={answers[currentQuestion.index] || ""}
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
                  </Box>
                </Flex>
              </>
            )
          }

          {
            (!singleQuestion.includes(currentQuestion.type) && currentQuestion.questions) && (
              <Flex direction="row"  height='100%' gap={8} >
                {/* Cột 1: Ảnh và audio */}
                <Box boxShadow="2xl" overflowY={'scroll'} minWidth='40%' maxWidth='60%' style={{maxHeight: 'calc(100% - 80px)'}}  bg="gray.100" p={6} borderRadius="md" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">

                  {currentQuestion.audioLink && (
                    <AudioCommon audioLink={currentQuestion.audioLink}/>
                  )}

                  {currentQuestion.imgLink && (
                    <Box mb={6} textAlign="center">
                      <Image src={currentQuestion.imgLink}/>
                    </Box>
                  )}

                </Box>

                {/* Cột 2: Câu hỏi */}
                <Box flex={1}>
                  {currentQuestion.questions.map((question, indexQuestion) => (
                    <Box key={`question-${indexQuestion}`}>
                      <Heading size="md" mt={4} mb={2}>Question {question.index}: {question.description && question.description}</Heading>

                      <RadioGroup.Root
                        onValueChange={(e) => handleAnswerChange(e, question.index)}
                        value={answers[question.index] || ""}
                      >
                        <VStack align="start" spacing={2}>
                          {(question.answer.length ? question.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
                            <RadioGroup.Item key={index} value={(index + 1)}>
                              <RadioGroup.ItemHiddenInput/>
                              <RadioGroup.ItemIndicator/>
                              <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </VStack>
                      </RadioGroup.Root>
                    </Box>
                  ))}
                </Box>
              </Flex>
            )
          }
        </Box>
        }
        {/*</Stack>*/}
      </Stack>
    </Flex>
  );

}
