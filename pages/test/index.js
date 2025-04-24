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
  RadioGroup
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import data from "../../data/test-1.json";

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
  const audioRef = useRef(null);

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion.index]: value.value});
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

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
                    variant={q.index === currentQuestion.index ? "solid" : "outline"}
                    colorScheme="teal"
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
        p={3}
        w={'80%'}
        spacing={8}
        height={'100vh'}
        align={'center'}>
        <Heading size="md" mb={2}>Câu hỏi {currentQuestion.index}</Heading>
        {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}

        {currentQuestion.imgLink && (
          <Box mb={6} textAlign="center">
            <Image src={currentQuestion.imgLink} />
          </Box>
        )}

        {currentQuestion.audioLink && (
          <HStack spacing={4} mb={4} align="center">
            <audio ref={audioRef} controls>
              <source src={currentQuestion.audioLink} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
            <Button size="sm" mt={2} onClick={handleRewind} colorScheme="gray">
              ⏪ Lùi 5 giây
            </Button>
          </HStack>
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

      </Stack>
    </Flex>

  );

}