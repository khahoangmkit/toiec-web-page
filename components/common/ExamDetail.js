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
import {useEffect, useRef, useState} from "react";
import AudioCommon from "@/components/common/AudioCommon";
import ActionHeaderTest from "@/components/common/ActionHeaderTest";
import {Constant} from "@/constants";
import { useRouter } from "next/router";

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

export default function ExamDetail({listQuestion = [], timer = 7200, isFullTest = false, onSubmit}) {

  const audioRef = useRef(null);
  const router = useRouter();

  const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState([]);
  const [partForSelectQuestion, setPartForSelectQuestion] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'flagged', 'unanswered'
  const [showListQuestion, setShowListQuestion] = useState(false); // Ẩn mặc định
  const [showPartIntro, setShowPartIntro] = useState(false);
  const [nextPart, setNextPart] = useState("");

  useEffect(() => {
    if (!listQuestion.length) return;
    setGroupedQuestions(groupQuestions(listQuestion));
    setPartForSelectQuestion(groupByPartForSelectQuestion(listQuestion));
    setCurrentQuestion(listQuestion[0]);
    setCurrentIndexQuestion(listQuestion[0].index)
  }, [listQuestion]);

  useEffect(() => {
    const selectedQuestion = listQuestion.find(q => q.index === currentIndexQuestion);
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Bạn có chắc chắn muốn thoát khỏi trạng thái làm bài ?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleRouteChangeStart = (url) => {
      if (url.includes('/result')) return;
      if (window.confirm("Bạn có chắc chắn muốn thoát khỏi trạng thái làm bài ?")) {
        // Cho phép điều hướng
      } else {
        // Chặn điều hướng
        router.events.emit('routeChangeError');
        throw "routeChange aborted.";
      }
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  const handleVolume = (e) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  const handleAnswerChange = (value, indexQuestion) => {
    setAnswers({...answers, [indexQuestion]: value.value});
  };

  const handleSubmit = () => {
    if (onSubmit) {
      console.log('answers', answers);
      onSubmit(answers);
    }
  };

  function nextQuestion(question) {
    if (!question) return;
    if (singleQuestion.includes(question.type)) {
      const idx = listQuestion.findIndex(q => q.index === question.index);
      if (idx === -1) return;
      // Check if next question is a new part
      if (idx < listQuestion.length - 1) {
        const nextQ = listQuestion[idx + 1];
        if (nextQ.type !== question.type && isFullTest && (!Constant.ReadingQuestion.includes(nextQ.type))) {
          setShowPartIntro(true);
          setNextPart(nextQ.type);
          return;
        }
        setCurrentIndexQuestion(nextQ.index);
      }
    } else {
      if (question.questions.length) {
        const lastQuestionInGroup = question.questions[question.questions.length - 1];
        const idx = listQuestion.findIndex(q => q.index === lastQuestionInGroup.index);
        if (idx < listQuestion.length - 1) {
          const nextQ = listQuestion[idx + 1];
          if (nextQ.type !== question.type && isFullTest && (!Constant.ReadingQuestion.includes(nextQ.type))) {
            setShowPartIntro(true);
            setNextPart(nextQ.type);
            return;
          }
          setCurrentIndexQuestion(nextQ.index);
        }
      }
    }
  }

  function showBtnNextQuestion() {
    const selectedQuestion = listQuestion.find(q => q.index === currentIndexQuestion);
    if (!selectedQuestion) return;
    return Constant.ReadingQuestion.includes(selectedQuestion.type);
  }

  function getAudioIntro(nextPart) {
    switch (nextPart) {
      case 'PART_2':
        return "/part2_intro.mp3";
      case 'PART_3':
        return "/part3_intro.mp3";
      case 'PART_4':
        return "/part4_intro.mp3";
    }
    return "";
  }
  function getContentIntro(nextPart) {
    switch (nextPart) {
      case 'PART_2':
        return "Directions: You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement and mark the letter (A), (B), or (C) on your answer sheet.";
      case 'PART_3':
        return "Directions: You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The conversations will not be printed in your test book and will be spoken only one time.";
      case 'PART_4':
        return "Directions: You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. Select the best response to each question and mark the letter (A), (B), (C), or (D) on your answer sheet. The talks will not be printed in your test book and will be spoken only one time.";
    }
    return "";
  }

  return (
    <Flex
      minH={'calc(100vh - 90px)'}
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
        w={showListQuestion ? '80%' : '99%'}
        spacing={8}
        height={'100vh'}
        align={'left'}
        divideY="2px">
        <HStack width={'100%'} direction="row" spacing={4}>
          <ActionHeaderTest
            currentQuestion={currentQuestion}
            totalTime={timer}
            handleSubmit={handleSubmit}
          />
          {
            showBtnNextQuestion() && (
              <Box alignItems='center' pt={2}>
                <Button colorPalette={'yellow'} onClick={() => nextQuestion(currentQuestion)} mb={2}>
                  Next
                </Button>
              </Box>
            )
          }
          <Box alignItems='center' pt={2}>
            <Button colorPalette={showListQuestion ? 'red' : 'teal'} onClick={() => setShowListQuestion(v => !v)}
                    mb={2}>
              {showListQuestion ? 'Hidden' : 'Review'}
            </Button>
          </Box>
        </HStack>

        {/* Show part intro if needed */}
        {showPartIntro && (
          <Box py={10} display="flex" textAlign="center" justifyContent="center">
            <Box p={4}
                 width={'800px'}
                 boxShadow={'2xl'}
                 bg='white'
                 rounded={'xl'}>

              {/* Audio test section */}
              <Box mb={4} display="flex" borderBottomWidth="1px" flexDirection="row" justifyContent='space-between'>
                <Heading pb={1}>{nextPart.replace('_', ' ')}</Heading>

                <audio ref={audioRef} autoPlay src={getAudioIntro(nextPart)} loop/>
                <Box display="flex" gap={1} alignItems="center">
                  <Image src="/icons/sound-max.svg" boxSize="26px"></Image>
                  <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume}
                         style={{width: 120}}/>
                </Box>
              </Box>

              <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">
                {getContentIntro(nextPart)}
              </Text>

              <Button colorPalette="teal" onClick={() => {
                setShowPartIntro(false);
                // Tìm câu đầu tiên của part mới
                const idx = listQuestion.findIndex(q => q.type === nextPart);
                if (idx !== -1) setCurrentIndexQuestion(listQuestion[idx].index);
              }}>
                Continue
              </Button>

            </Box>

          </Box>
        )}

        {/* Main question UI */}
        {!showPartIntro && currentQuestion && <Box pt={4} height='100%'>
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
                                     disabled={isFullTest}
                                     audioLink={currentQuestion.audioLink}/>
                      )}
                      {currentQuestion.imgLink && currentQuestion.imgLink.length > 0 && (
                        currentQuestion.imgLink.map((imgLink, index) => (
                          <Box mb={6} textAlign="center">
                            <Image src={imgLink} key={index}/>)
                          </Box>
                        )))}
                    </Box>
                  }
                  {/* Cột 2: Câu hỏi */}
                  <Box flex={1}>
                    <Heading size="md" mb={2}>
                      Question {currentQuestion.index}
                      <Box as="span" ml={2} style={{cursor: 'pointer'}} onClick={() => {
                        setFlaggedQuestions(prev => prev.includes(currentQuestion.index)
                          ? prev.filter(i => i !== currentQuestion.index)
                          : [...prev, currentQuestion.index]);
                      }}>
                        <Image
                          src={flaggedQuestions.includes(currentQuestion.index) ? '/icons/flag-solid.svg' : '/icons/flag.svg'}
                          alt="Flag" boxSize="24px" display="inline"/>
                      </Box>
                    </Heading>
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
                                 disabled={isFullTest}
                                 audioLink={currentQuestion.audioLink}/>
                  )}
                  {currentQuestion.imgLink && currentQuestion.imgLink.length > 0 && (
                    currentQuestion.imgLink.map((src, idx) => (
                      <Box mb={6} key={`img-quest-${idx}`} textAlign="center">
                        <Image src={src}/>
                      </Box>
                    ))
                  )}
                </Box>
                {/* Cột 2: Câu hỏi */}
                <Box flex={1} overflowY={'scroll'} style={{maxHeight: 'calc(100% - 80px)'}}>
                  {currentQuestion.questions.map((question, indexQuestion) => (
                    <Box key={`question-${indexQuestion}`}>
                      <Heading size="md" mt={4} mb={2}>
                        Question {question.index}: {question.description && question.description}
                        <Box as="span" ml={2} style={{cursor: 'pointer'}} onClick={() => {
                          setFlaggedQuestions(prev => prev.includes(question.index)
                            ? prev.filter(i => i !== question.index)
                            : [...prev, question.index]);
                        }}>
                          <Image
                            src={flaggedQuestions.includes(question.index) ? '/icons/flag-solid.svg' : '/icons/flag.svg'}
                            alt="Flag" boxSize="24px" display="inline"/>
                        </Box>
                      </Heading>
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

      {showListQuestion && (
        <Stack
          boxShadow={'2xl'}
          bg='white'
          rounded={'xl'}
          p={3}
          w={'18%'}
          spacing={8}
          height={'100vh'}
          align={'start'}>
          <Heading size="md" mb={2}>List question</Heading>
          <HStack mb={2} spacing={2} width="100%" justify="center" pb={2} borderBottom="1px solid"
                  borderColor="gray.200">
            <Button size="sm" variant={filterType === 'unanswered' ? 'solid' : 'outline'} colorPalette={'blue'}
                    onClick={() => setFilterType('unanswered')}>Chưa trả lời</Button>
            <Button size="sm" variant={filterType === 'flagged' ? 'solid' : 'outline'} colorPalette={'yellow'}
                    onClick={() => setFilterType('flagged')}>Đánh dấu</Button>
            <Button size="sm" variant={filterType === 'all' ? 'solid' : 'outline'} colorPalette={'teal'}
                    onClick={() => setFilterType('all')}>Tất cả</Button>
          </HStack>
          <VStack align="stretch" minW={"100%"} spacing={4} overflowY={'scroll'}>
            {partForSelectQuestion.map((partGroup, idx) => (
              <Box key={idx} pt={'6px'}>
                <Text fontWeight="bold" mb={1}>Part {partGroup.part.replace("PART_", "")}</Text>
                <HStack wrap="wrap" spacing={2}>
                  {partGroup.questions
                    .filter((q) => {
                      if (filterType === 'flagged') return flaggedQuestions.includes(q.index);
                      if (filterType === 'unanswered') return !answers[q.index];
                      return true;
                    })
                    .map((q) => (
                      <Button
                        key={q.index}
                        minW='46px'
                        size="sm"
                        disabled={isFullTest && Constant.ListenQuestion.includes(q.type)}
                        variant={flaggedQuestions.includes(q.index) || answers[q.index] ? "solid" : "outline"}
                        colorPalette={flaggedQuestions.includes(q.index) ? "yellow" : (answers[q.index] ? "green" : "teal")}
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
      )}
    </Flex>
  );
}