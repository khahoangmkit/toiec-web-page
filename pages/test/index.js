import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Wrap,
  useBreakpointValue,
  HStack,
  VStack,
  Text,
  Image,
  RadioGroup, IconButton
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import data from "../../data/test-1.json";
import AudioCommon from "@/components/common/AudioCommon";

const groupByPart = (questions) => {
  const grouped = {};
  for (const q of questions) {
    const part = q.type || "UNKNOWN";
    if (!grouped[part]) grouped[part] = [];
    grouped[part].push(q);
  }
  return Object.entries(grouped).map(([part, qs]) => ({ part, questions: qs }));
};

const mockData = groupByPart(data.questionsJson);

export default function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(mockData[0].questions[0]);
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion.index]: value.value});
  };

  const handleNext = () => {
    const currentIndex = mockData.findIndex(part => part.questions.includes(currentQuestion));
    const questionIndex = mockData[currentIndex].questions.indexOf(currentQuestion);
    if (questionIndex < mockData[currentIndex].questions.length - 1) {
      setCurrentQuestion(mockData[currentIndex].questions[questionIndex + 1]);
    } else if (currentIndex < mockData.length - 1) {
      setCurrentQuestion(mockData[currentIndex + 1].questions[0]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = mockData.findIndex(part => part.questions.includes(currentQuestion));
    const questionIndex = mockData[currentIndex].questions.indexOf(currentQuestion);
    if (questionIndex > 0) {
      setCurrentQuestion(mockData[currentIndex].questions[questionIndex - 1]);
    } else if (currentIndex > 0) {
      setCurrentQuestion(mockData[currentIndex - 1].questions[mockData[currentIndex - 1].questions.length - 1]);
    }
  };

  const handleSubmit = () => {
    // Implement submission logic here
    console.log('Submitted answers:', answers);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Chrome yêu cầu returnValue, nội dung hiện tại các trình duyệt bỏ qua
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
        <Heading size="md" mb={4}>Câu hỏi</Heading>
        <VStack align="stretch" spacing={4} overflowY={'scroll'}>
          {mockData.map((partGroup, idx) => (
            <Box key={idx} pt={'6px'}>
              <Text fontWeight="bold" mb={1}>Part {partGroup.part.replace("PART_", "")}</Text>
              <HStack wrap="wrap" spacing={2}>
                {partGroup.questions.map((q) => (
                  <Button
                    key={q.index}
                    size="sm"
                    variant={q.index === currentQuestion.index ? "solid" : (answers[q.index] ? "solid" : "outline") }
                    colorPalette={q.index === currentQuestion.index || answers[q.index] ? "green" : "teal"}
                    onClick={() => setCurrentQuestion(q)}
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
        <Stack direction="row" spacing={4} mt={4} mb={4}>
          <Button onClick={handlePrevious} isDisabled={currentQuestion.index === 0}>Previous</Button>
          <Button onClick={handleNext} isDisabled={currentQuestion.index === mockData[mockData.length - 1].questions[mockData[mockData.length - 1].questions.length - 1].index}>Next</Button>
          <Button onClick={handleSubmit} colorScheme="blue">Submit</Button>
        </Stack>

        <Box pt={4}>
          <Heading size="md" mb={2}>Câu hỏi {currentQuestion.index}</Heading>
          {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}

          {currentQuestion.imgLink && (
            <Box mb={6} textAlign="center">
              <Image src={currentQuestion.imgLink} />
            </Box>
          )}

          {currentQuestion.audioLink && (
            <AudioCommon audioLink={currentQuestion.audioLink} />
          )}

          <RadioGroup.Root
            onValueChange={(e) => handleAnswerChange(e)}
            value={answers[currentQuestion.index] || ""}
          >
            <VStack align="start" spacing={2}>
              {(currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
                <RadioGroup.Item key={index} value={(index + 1)}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </VStack>
          </RadioGroup.Root>
        </Box>
      </Stack>
    </Flex>

  );

}
