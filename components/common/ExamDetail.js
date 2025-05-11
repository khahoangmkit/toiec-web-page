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
  RadioGroup
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import AudioCommon from "@/components/common/AudioCommon";
import ActionHeaderTest from "@/components/common/ActionHeaderTest";
import {Constant} from "@/constants";

const singleQuestion = ["PART_1", "PART_2", "PART_5"];
const ListenQuestion = ["PART_1", "PART_2", "PART_3", "PART_4"];

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

export default function ExamDetail({listQuestion = [], timer = 7200, disableSelectListen = false, onSubmit}) {
  const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState([]);
  const [partForSelectQuestion, setPartForSelectQuestion] = useState([]);

  useEffect(() => {
    setGroupedQuestions(groupQuestions(listQuestion));
    setPartForSelectQuestion(groupByPartForSelectQuestion(listQuestion));
    setCurrentQuestion(listQuestion[0]);
  }, [listQuestion]);

  useEffect(() => {
    const selectedQuestion = listQuestion[currentIndexQuestion - 1];
    if (!selectedQuestion) {
      return;
    }
    const isGroupQuestion = !singleQuestion.includes(selectedQuestion.type);
    if (isGroupQuestion) {
      const group = groupedQuestions.find(g => g.some(q => q.index === selectedQuestion.index));
      const firstQuestion = group[0];
      const groupQuestionsArr = group.map(q => q);
      setCurrentQuestion({
        type: firstQuestion.type,
        audioLink: firstQuestion.audioLink,
        imgLink: firstQuestion.imgLink,
        questions: groupQuestionsArr
      });
    } else {
      setCurrentQuestion(selectedQuestion);
    }
  }, [currentIndexQuestion, listQuestion, groupedQuestions]);

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
    if (onSubmit) {
      onSubmit(answers);
    } else {
      // fallback: lưu localStorage (nếu cần)
      alert("Nộp bài thành công!");
    }
  };

  const handleTimeUp = () => {
    alert("time up")
  }

  function nextQuestion(question) {
    if (!question) return;
    if (singleQuestion.includes(question.type)) {
      const idx = listQuestion.findIndex(q => q.index === question.index);
      if (idx === -1) return;
      if (idx < listQuestion.length - 1) {
        setCurrentIndexQuestion(listQuestion[idx + 1].index);
      }
    } else {
      if (question.questions.length) {
        const lastQuestionInGroup = question.questions[question.questions.length - 1];
        setCurrentIndexQuestion(lastQuestionInGroup.index + 1)
      }
    }
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
            totalTime={timer}
            handleSubmit={handleSubmit}
          />
        </Stack>

        {currentQuestion && <Box pt={4} height='100%'>
          {
            singleQuestion.includes(currentQuestion.type) && (
              <>
                <Flex height='100%' direction="row" gap={8}>
                  {/* Cột 1: Ảnh và audio  trừ part 5 ko chia */}
                  {
                    currentQuestion.type !== "PART_5" &&
                    <Box overflowY={'scroll'} minWidth='40%' maxWidth='60%' style={{maxHeight: 'calc(100% - 80px)'}}
                         bg="gray.100" p={6} borderRadius="md" display="flex" flexDirection="column" alignItems="center"
                         justifyContent="flex-start">
                      {currentQuestion.audioLink && (
                        <AudioCommon onNextQuestion={() => nextQuestion(currentQuestion)}
                                     audioLink={currentQuestion.audioLink}/>
                      )}
                      {currentQuestion.imgLink && (
                        <Box mb={6} textAlign="center">
                          <Image src={currentQuestion.imgLink}/>
                        </Box>
                      )}
                    </Box>
                  }
                  {/* Cột 2: Câu hỏi */}
                  <Box flex={1}>
                    <Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>
                    {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}
                    <RadioGroup.Root
                      onValueChange={(e) => handleAnswerChange(e, currentQuestion.index)}
                      value={answers[currentQuestion.index] || ""}
                    >
                      <VStack align="start" spacing={2}>
                        {(currentQuestion.answer && currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
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
              <Flex direction="row" height='100%' gap={8}>
                {/* Cột 1: Ảnh và audio */}
                <Box boxShadow="2xl" overflowY={'scroll'} minWidth='40%' maxWidth='60%'
                     style={{maxHeight: 'calc(100% - 80px)'}} bg="gray.100" p={6} borderRadius="md" display="flex"
                     flexDirection="column" alignItems="center" justifyContent="flex-start">
                  {currentQuestion.audioLink && (
                    <AudioCommon onNextQuestion={() => nextQuestion(currentQuestion)}
                                 audioLink={currentQuestion.audioLink}/>
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
                      <Heading size="md" mt={4}
                               mb={2}>Question {question.index}: {question.description && question.description}</Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => handleAnswerChange(e, question.index)}
                        value={answers[question.index] || ""}
                      >
                        <VStack align="start" spacing={2}>
                          {(question.answer && question.answer.length ? question.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
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
        </Box>}
      </Stack>
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
                    minW='46px'
                    size="sm"
                    disabled={disableSelectListen &&ListenQuestion.includes(q.type)}
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
    </Flex>
  );
}