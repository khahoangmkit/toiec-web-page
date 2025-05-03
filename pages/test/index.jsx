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
import data from "../../data/test-1.json";
import AudioCommon from "@/components/common/AudioCommon";
import ActionHeaderTest from "@/components/common/ActionHeaderTest";

const singleQuestion = ["PART_1", "PART_2", "PART_5"];

const groupByPart = (questions) => {
  const grouped = {};
  for (const q of questions) {
    const part = q.type || "UNKNOWN";
    if (singleQuestion.includes(part)) {
      if (!grouped[part]) grouped[part] = [];
      grouped[part].push(q);
    }


  }
  console.log("group question: ", grouped)
  return Object.entries(grouped).map(([part, qs]) => ({part, questions: qs}));
};

const groupQuestions = (questions) => {
  const groups = [];
  let currentGroup = [];

  questions.forEach((q) => {
    if (q.audioLink) {
      if (currentGroup.length) {
        groups.push(currentGroup);
      }
      currentGroup = [q];
    } else {
      currentGroup.push(q);
    }
  });

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups;
};

const groupedQuestions = groupQuestions(data.questionsJson);
console.log("======cscs", groupedQuestions)

const mockData = groupByPart(data.questionsJson);

export default function Page() {
  const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const  [currentQuestion, setCurrentQuestion] = useState(data.questionsJson[0]);
  useEffect(() => {
    console.log(mockData, "======mockData")
    const question = data.questionsJson[currentIndexQuestion-1];

    setCurrentQuestion(question);


  }, [currentIndexQuestion]);

  const handleAnswerChange = (value) => {
    setAnswers({...answers, [currentIndexQuestion]: value.value});
  };

  const handleNext = () => {
    if (currentIndexQuestion <  data.questionsJson.length - 1) {
      setCurrentIndexQuestion(currentIndexQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndexQuestion > 1) {
      setCurrentIndexQuestion(currentIndexQuestion - 1);
    }
  };

  const handleSubmit = () => {

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
            mockData={mockData}
          />
        </Stack>

        <Box pt={4}>
          {
            singleQuestion.includes(currentQuestion.type) && (
              <>
                <Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>
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
                  onValueChange={(e) => handleAnswerChange(e)}
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
              </>
            )
          }
        </Box>
      </Stack>
    </Flex>

  );

}
