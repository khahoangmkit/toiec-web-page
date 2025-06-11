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
  Checkbox,
  RadioGroup, Input,
  Dialog, Portal, CloseButton, Textarea
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AudioCommon from "@/components/common/AudioCommon";
import { Constant } from "@/constants";
import { useRouter } from "next/router";
import ButtonTimerGroup from "@/components/common/Timer";
import * as Diff from 'diff';

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
    if (q.audioLink || q.imgLink.length || currentType !== q.type) {
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

export default function ExamPractice({listQuestion = [], timer = 7200, onSubmit}) {
  const audioRef = useRef(null);
  const router = useRouter();

  const [currentIndexQuestion, setCurrentIndexQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [groupedQuestions, setGroupedQuestions] = useState([]);
  const [partForSelectQuestion, setPartForSelectQuestion] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'flagged', 'unanswered'
  const [showListQuestion, setShowListQuestion] = useState(true); // Show by default for practice mode
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [checkedAnswers, setCheckedAnswers] = useState({}); // Track which answers have been checked
  const [showDictionary, setShowDictionary] = useState(false); // Track which answers have been checked
  const [dictationText, setDictationText] = useState({}); // Store dictation text for each question
  const [dictationResults, setDictationResults] = useState({}); // Store dictation comparison results
  const [showKeywordsDialog, setShowKeywordsDialog] = useState(false); // State for keywords dialog
  const [dictationGroupText, setDictationGroupText] = useState({});
  const [dictationGroupResults, setDictationGroupResults] = useState({}); // Store dictation comparison results

  useEffect(() => {
    if (!listQuestion.length) return;
    setGroupedQuestions(groupQuestions(listQuestion));
    setPartForSelectQuestion(groupByPartForSelectQuestion(listQuestion));
    setCurrentQuestion(listQuestion[0]);
    setCurrentIndexQuestion(listQuestion[0].index);
  }, [listQuestion]);

  useEffect(() => {
    const selectedQuestion = listQuestion.find(q => q.index === currentIndexQuestion);
    if (!selectedQuestion) {
      return;
    }
    const isGroupQuestion = !Constant.singleQuestion.includes(selectedQuestion.type);
    if (isGroupQuestion) {
      const group = groupedQuestions.find(g => g.some(q => q.index === selectedQuestion.index));
      if (!group) return;
      const firstQuestion = group[0];
      const groupQuestionsArr = group.map(q => q);
      setCurrentQuestion({
        type: firstQuestion.type,
        index: firstQuestion.index,
        audioLink: firstQuestion.audioLink,
        imgLink: firstQuestion.imgLink,
        questions: groupQuestionsArr,
        explanation: firstQuestion.explanation,
        dictionary: firstQuestion.dictionary,
        dictionaryCorrect: firstQuestion.dictionaryCorrect
      });

      if (!dictationGroupText[firstQuestion.index]) {
        setDictationGroupText(prev => ({
          ...prev,
          [firstQuestion.index]: firstQuestion.dictionary
        }))
      }

    } else {
      setCurrentQuestion(selectedQuestion);
    }
    setCurrentExplanation("");
  }, [currentIndexQuestion, listQuestion, groupedQuestions]);

  useEffect(() => {
    if (!currentQuestion) return;

    // Update explanation based on current question
    if (Constant.singleQuestion.includes(currentQuestion.type)) {
      if (isAnswerChecked(currentQuestion.index)) {
        // If we have stored dictation results, use them
        if (dictationResults[currentQuestion.index]) {
          setCurrentExplanation(dictationResults[currentQuestion.index]);
        } else {
          setCurrentExplanation(currentQuestion.explanation || "Không có giải thích cho câu hỏi này.");
        }
      }
    } else if (Constant.showDictionaryQuestionV2.includes(currentQuestion.type)) {
      if (dictationResults[currentQuestion.index]) {
        setCurrentExplanation(dictationResults[currentQuestion.index]);
      } else {
        setCurrentExplanation(currentQuestion.explanation || "Không có giải thích cho câu hỏi này.");
      }
    } else if (currentQuestion.questions) {
      // For group questions
      const explanationContent = generateGroupExplanation();
      setCurrentExplanation(explanationContent);
    }
  }, [currentQuestion, currentIndexQuestion, dictationResults]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Bạn có chắc chắn muốn thoát khỏi trạng thái luyện tập ?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleRouteChangeStart = (url) => {
      if (url.includes('/result')) return;
      if (window.confirm("Bạn có chắc chắn muốn thoát khỏi trạng thái luyện tập ?")) {
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
    // Don't allow changing answers that have been checked
    if (isAnswerChecked(indexQuestion)) {
      return;
    }

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
    if (Constant.singleQuestion.includes(question.type)) {
      const idx = listQuestion.findIndex(q => q.index === question.index);
      if (idx === -1) return;
      if (idx < listQuestion.length - 1) {
        const nextQ = listQuestion[idx + 1];
        setCurrentIndexQuestion(nextQ.index);
      }
    } else {
      if (question.questions.length) {
        const lastQuestionInGroup = question.questions[question.questions.length - 1];
        const idx = listQuestion.findIndex(q => q.index === lastQuestionInGroup.index);
        if (idx < listQuestion.length - 1) {
          const nextQ = listQuestion[idx + 1];
          setCurrentIndexQuestion(nextQ.index);
        }
      }
    }
  }

  function previousQuestion(currentQuestion) {
    if (!currentQuestion) return;
    if (Constant.singleQuestion.includes(currentQuestion.type)) {
      const idx = listQuestion.findIndex(q => q.index === currentQuestion.index);
      if (idx === -1) return;
      if (idx > 0) {
        const prevQ = listQuestion[idx - 1];
        setCurrentIndexQuestion(prevQ.index);
      }
    } else {
      if (currentQuestion.questions.length) {
        const firstQuestionInGroup = currentQuestion.questions[0];
        const idx = listQuestion.findIndex(q => q.index === firstQuestionInGroup.index);
        if (idx > 0) {
          const prevQ = listQuestion[idx - 1];
          setCurrentIndexQuestion(prevQ.index);
        }
      }
    }
  }

  function showBtnNextQuestion() {
    const selectedQuestion = listQuestion.find(q => q.index === currentIndexQuestion);
    if (!selectedQuestion) return;
    return true; // Always show navigation buttons in practice mode
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

  function handleCheckAnswer(questionIndex) {
    if (!isQuestionAnswered(questionIndex)) {
      // Don't mark as checked if not answered
      return;
    }

    setCheckedAnswers(prev => ({
      ...prev,
      [questionIndex]: true
    }));

    // Automatically show explanation for the current question
    if (Constant.singleQuestion.includes(currentQuestion.type)) {
      let explanation = currentQuestion.explanation || "Không có giải thích cho câu hỏi này.";

      // If dictation is enabled and this is a dictation-compatible question type
      if (showDictionary && Constant.showDictionaryQuestion.includes(currentQuestion.type)) {
        // Get the question's dictation inputs
        const questionDictation = dictationText[questionIndex] || {};
        
        // Get the correct text for each option from the question's dictionary field
        const optionTexts = currentQuestion.dictionary || {};
        
        // Generate HTML for each option's comparison
        let dictationHtml = '';
        let optionsCount = 0;
        
        // Process each option that has user input
        Object.keys(questionDictation).forEach(option => {
          const userText = questionDictation[option] || '';
          if (!userText.trim()) return; // Skip empty inputs
          
          // Get correct text for this option from dictionary
          const correctText = optionTexts[option] || '';
          if (!correctText) return; // Skip if no reference text
          
          const plainCorrectText = stripHtml(correctText);
          
          // Generate diff HTML and get similarity
          const {html: diffHtml, similarity} = generateDiffHtml(userText, plainCorrectText);

          dictationHtml += `
            <div class="dictation-option-comparison" style="margin-bottom: 15px;">
              <div style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px; margin-bottom: 8px;">
                ${option}: ${diffHtml}
              </div>
            </div>
          `;
          optionsCount++;
        });
        
        // Add dictation comparison to explanation
        if (dictationHtml) {
          explanation = `
            <div class="dictation-comparison">
             <p><strong>Dictation:</strong></p>
              ${dictationHtml}
            </div>
            <hr/>
            <div class="explanation">
              <p><strong>Explanation:</strong></p>
              ${explanation}
            </div>
          `;
        }

        // Store the result for future reference
        setDictationResults(prev => ({
          ...prev,
          [questionIndex]: explanation
        }));
      }

      setCurrentExplanation(explanation);
    } else if (currentQuestion.questions) {
      // For group questions
      const explanationContent = generateGroupExplanation();
      setCurrentExplanation(explanationContent);
    }
  }

  function checkAnswer(questionIndex) {
    const question = listQuestion.find(q => q.index === questionIndex);
    if (!question) return false;

    return answers[questionIndex] === question.correct;
  }

  function isQuestionAnswered(questionIndex) {
    return !!answers[questionIndex];
  }

  function isAnswerChecked(questionIndex) {
    return !!checkedAnswers[questionIndex];
  }

  // Function to strip HTML tags and normalize text for comparison
  function stripHtml(html) {
    if (!html) return "";
    // Create a temporary element to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;
    // Get the text content and normalize it
    let text = temp.textContent || temp.innerText || "";
    // Remove answer choice indicators like (A), (B), (C), (D)
    text = text.replace(/\([A-D]\)/g, "");
    // Remove extra whitespace
    text = text.replace(/\s+/g, " ").trim();
    return text;
  }

  // Function to generate HTML with highlighted differences and calculate similarity using diff
  function generateDiffHtml(userText, correctText) {
    if (!userText || !correctText) return {html: "", similarity: 0};

    // Trim the texts but preserve line breaks
    const userTextTrimmed = userText.trim();
    const correctTextTrimmed = correctText.trim();

    // Generate diff using diffLines to preserve line structure
    const diff = Diff.diffWords(userTextTrimmed, correctTextTrimmed);

    // Calculate similarity based on diff results
    let totalLength = 0;
    let matchedLength = 0;

    diff.forEach(part => {
      if (part.added) {
        totalLength += part.value.length;
      } else if (part.removed) {
        totalLength += part.value.length;
      } else {
        // Matched parts
        matchedLength += part.value.length;
        totalLength += part.value.length;
      }
    });

    // Calculate similarity as percentage of matched text
    const similarity = totalLength > 0 ? matchedLength / totalLength : 0;

    // Create HTML with highlighted differences
    let html = '<div style="white-space: pre-wrap;">';
    diff.forEach((part) => {
      const style = part.added ? 'background-color: #e6ffe6; color: green; text-decoration: underline;' :
        part.removed ? 'background-color: #ffe6e6; color: red; text-decoration: line-through;' : '';

      // Get the text with preserved line breaks
      let displayText = part.value;
      
      if (part.added) {
        html += `<span style="${style}">+${displayText}</span>`;
      } else if (part.removed) {
        html += `<span style="${style}">-${displayText}</span>`;
      } else {
        html += `<span style="${style}">${displayText}</span>`;
      }
    });
    html += '</div>';

    return {html, similarity};
  }

  // Function to check if all questions in a group have been answered
  function areAllGroupQuestionsAnswered() {
    if (!currentQuestion || !currentQuestion.questions) return false;

    return currentQuestion.questions.every(question =>
      isQuestionAnswered(question.index)
    );
  }

  // Function to check if any question in a group has been checked
  function isAnyGroupQuestionChecked() {
    if (!currentQuestion || !currentQuestion.questions) return false;

    return currentQuestion.questions.some(question =>
      isAnswerChecked(question.index)
    );
  }

  // Function to handle checking all answers in a group
  function handleCheckAllGroupAnswers() {
    if (!currentQuestion || !currentQuestion.questions) return;

    // Check each question in the group
    currentQuestion.questions.forEach(question => {
      if (isQuestionAnswered(question.index)) {
        handleCheckAnswer(question.index);
      }
    });

    // Handle dictation for group questions if enabled
    if (showDictionary && Constant.showDictionaryQuestionV2.includes(currentQuestion.type)) {
      // Get the user's dictation input for this group
      let userDictationText = dictationGroupText[currentQuestion.index] || '';
      userDictationText = userDictationText.replace(/_/g, '');

      // Get the correct text from the question's dictionary field
      const correctText = currentQuestion.dictionaryCorrect || '';

      let explanation = currentQuestion.questions[0].explanation || "Không có giải thích cho câu hỏi này.";

      if (userDictationText.trim() && correctText) {
        // Generate diff HTML and get similarity
        const {html: diffHtml} = generateDiffHtml(userDictationText, correctText);

        // Add dictation comparison to explanation
        explanation = `
          <div class="dictation-comparison">
            <p><strong>Dictation:</strong></p>
            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px; margin-bottom: 8px;">
              ${diffHtml}
            </div>
          </div>
          <hr/>
          <div class="explanation">
            <p><strong>Explanation:</strong></p>
            ${explanation}
          </div>
        `;
      }
      setCurrentExplanation(explanation);
      setDictationResults(prev => ({
        ...prev,
        [currentQuestion.index]: explanation
      }));
    }
  }

  // Generate a single explanation for all questions in a group
  function generateGroupExplanation() {
    if (!currentQuestion || !currentQuestion.questions) return "";

    const explanationContent = currentQuestion.questions[0].explanation;

    return explanationContent;
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
        <HStack width={'100%'} direction="row" justifyContent={'end'} gap="4">
          <Box width={'80%'} display={'flex'} gap={4} justifyContent={'end'}>
            <Box display={'flex'} gap={4} alignContent={'center'} justifyContent={'center'}>
              <Checkbox.Root
                colorPalette={'green'}
                checked={showDictionary}
                onCheckedChange={(e) => setShowDictionary(!!e.checked)}
              >
                <Checkbox.HiddenInput/>
                <Checkbox.Control/>
                <Checkbox.Label>Dictation</Checkbox.Label>
              </Checkbox.Root>

              <Button
                variant="surface"
                colorPalette="teal"
                onClick={() => setShowKeywordsDialog(true)}
                size="md"
              >
                Keywords
              </Button>
            </Box>

            <ButtonTimerGroup
              initialTime={timer}
              onTimeUp={handleSubmit}
            />

          </Box>

          <Box height='56px' borderLeft='2px solid #1d81ae'></Box>
          {
            showBtnNextQuestion() && (
              <Flex gap='4' direction='row' alignItems='center' pt={2}>
                <Button variant="surface" colorPalette={'orange'} onClick={() => previousQuestion(currentQuestion)}
                        mb={2}>
                  Previous
                </Button>
                <Button variant="surface" colorPalette={'orange'} onClick={() => nextQuestion(currentQuestion)} mb={2}>
                  Next
                </Button>
              </Flex>
            )
          }
          <Box _hover={{
            opacity: 0.7
          }}
               minWidth='46px'
               alignItems='center' p={2} borderRadius={'md'} border={'1px solid #f2f2f2'} style={{cursor: "pointer"}}>
            <Image onClick={() => setShowListQuestion(v => !v)} src="/icons/menu-icon.svg" alt='icon-menu'
                   boxSize="32px"></Image>
          </Box>

          {/* Keywords Dialog */}
          <Dialog.Root lazyMount open={showKeywordsDialog} onOpenChange={(e) => {
            setShowKeywordsDialog(e.open);
          }} size="md" placement="center" scrollBehavior="inside">
            <Portal>
              <Dialog.Backdrop/>
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Keywords</Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm"/>
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    {currentQuestion && currentQuestion.keywords && currentQuestion.keywords.length > 0 ? (
                      <VStack align="start" spacing={2}>
                        {currentQuestion.keywords.map((keyword, index) => (
                          <Text key={index}>{keyword}</Text>
                        ))}
                      </VStack>
                    ) : (
                      <Text>Không có từ vựng cho câu hỏi này.</Text>
                    )}
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </HStack>

        {/* Main question UI */}
        {currentQuestion && <Box pt={4} height='100%'>
          {
            Constant.singleQuestion.includes(currentQuestion.type) && (
              <>
                <Flex height='100%' direction="row" gap={8}>
                  {/* Cột 1: Ảnh và audios  trừ part 5 ko chia */}
                  {
                    currentQuestion.type !== "PART_5" &&
                    <Box overflowY={'scroll'} minWidth='40%' maxWidth='60%'
                         style={{maxHeight: 'calc(100% - 80px)'}}
                         bg="gray.100" p={6} borderRadius="md" display="flex" flexDirection="column" alignItems="center"
                         justifyContent="flex-start">
                      {currentQuestion.audioLink && (
                        <AudioCommon onNextQuestion={null}
                                     disabled={false}
                                     audioLink={currentQuestion.audioLink}/>
                      )}
                      {currentQuestion.imgLink && currentQuestion.imgLink.length > 0 && (
                        currentQuestion.imgLink.map((imgLink, index) => (
                          <Box mb={6} textAlign="center" key={index}>
                            <Image src={imgLink}/>
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

                      {/*
                      ==============
                      show Icon correct, incorrect
                      */}
                      {/*{isQuestionAnswered(currentQuestion.index) && isAnswerChecked(currentQuestion.index) && (*/}
                      {/*  <Box as="span" ml={2}>*/}
                      {/*    <Image*/}
                      {/*      src={checkAnswer(currentQuestion.index) ? '/icons/correct.svg' : '/icons/wrong.svg'}*/}
                      {/*      alt={checkAnswer(currentQuestion.index) ? "Correct" : "Wrong"}*/}
                      {/*      boxSize="24px"*/}
                      {/*      display="inline"/>*/}
                      {/*  </Box>*/}
                      {/*)}*/}
                    </Heading>
                    {currentQuestion.description && <Text mb={2}>{currentQuestion.description}</Text>}
                    <RadioGroup.Root
                      onValueChange={(e) => handleAnswerChange(e, currentQuestion.index)}
                      value={answers[currentQuestion.index] || ""}
                      disabled={isAnswerChecked(currentQuestion.index)}
                    >
                      <VStack align="start" spacing={2}>
                        {(currentQuestion.answer && currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
                          <RadioGroup.Item
                            key={index}
                            value={(index + 1)}
                            disabled={isAnswerChecked(currentQuestion.index)}
                            style={{
                              backgroundColor: isQuestionAnswered(currentQuestion.index) && isAnswerChecked(currentQuestion.index) &&
                                (currentQuestion.correct === index + 1 ? '#d4edda' :
                                  (answers[currentQuestion.index] === index + 1 && answers[currentQuestion.index] !== currentQuestion.correct ? '#f8d7da' : 'transparent')),
                              padding: '2px 12px',
                              borderRadius: '4px',
                              width: '100%',
                              opacity: isAnswerChecked(currentQuestion.index) ? (answers[currentQuestion.index] === index + 1 || currentQuestion.correct === index + 1 ? 1 : 0.6) : 1
                            }}
                          >
                            <RadioGroup.ItemHiddenInput/>
                            <RadioGroup.ItemIndicator/>
                            <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                            {showDictionary && Constant.showDictionaryQuestion.includes(currentQuestion.type) && (
                              <Input
                                placeholder={`Type what you hear for option ${choice}...`}
                                value={(dictationText[currentQuestion.index] && dictationText[currentQuestion.index][choice]) || ""}
                                onChange={(e) => setDictationText(prev => ({
                                  ...prev,
                                  [currentQuestion.index]: {
                                    ...(prev[currentQuestion.index] || {}),
                                    [choice]: e.target.value
                                  }
                                }))}
                                disabled={isAnswerChecked(currentQuestion.index)}
                                size="sm"
                              />
                            )}
                          </RadioGroup.Item>
                        ))}
                      </VStack>
                    </RadioGroup.Root>

                    {/*{*/}
                    {/*  showDictionary && Constant.showDictionaryQuestion.includes(currentQuestion.type) && (*/}
                    {/*    <Box mt={3}>*/}
                    {/*      <Text fontWeight="bold" mb={2}>Dictation:</Text>*/}
                    {/*      <VStack align="start" spacing={3}>*/}
                    {/*        {(currentQuestion.answer && currentQuestion.answer.length ? currentQuestion.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (*/}
                    {/*          <Box key={`dictation-${index}`} width="100%">*/}
                    {/*            <Text mb={1}>Option {choice}:</Text>*/}
                    {/*            <Input*/}
                    {/*              placeholder={`Type what you hear for option ${choice}...`}*/}
                    {/*              value={(dictationText[currentQuestion.index] && dictationText[currentQuestion.index][choice]) || ""}*/}
                    {/*              onChange={(e) => setDictationText(prev => ({*/}
                    {/*                ...prev,*/}
                    {/*                [currentQuestion.index]: {*/}
                    {/*                  ...(prev[currentQuestion.index] || {}),*/}
                    {/*                  [choice]: e.target.value*/}
                    {/*                }*/}
                    {/*              }))}*/}
                    {/*              disabled={isAnswerChecked(currentQuestion.index)}*/}
                    {/*              resize="vertical"*/}
                    {/*            />*/}
                    {/*          </Box>*/}
                    {/*        ))}*/}
                    {/*      </VStack>*/}
                    {/*    </Box>*/}
                    {/*  )*/}
                    {/*}*/}

                    {isQuestionAnswered(currentQuestion.index) && !isAnswerChecked(currentQuestion.index) && (
                      <Button
                        mt={3}
                        colorPalette="blue"
                        onClick={() => handleCheckAnswer(currentQuestion.index)}
                      >
                        Check Answer
                      </Button>
                    )}

                    {/* Show explanation automatically if answer has been checked */}
                    {isAnswerChecked(currentQuestion.index) && (
                      <Box mt={4} p={3} bg="blue.50" borderRadius="md">
                        <Text fontWeight="bold">Explanation:</Text>
                        <Box dangerouslySetInnerHTML={{__html: currentExplanation}}/>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </>
            )
          }
          {/*====================================================*/}
          {/*Show List question group */}
          {/*====================================================*/}
          {
            (!Constant.singleQuestion.includes(currentQuestion.type) && currentQuestion.questions) && (
              <Flex direction="row" height='100%' gap={8}>
                {/* Cột 1: Ảnh và audios */}
                <Box boxShadow="2xl" overflowY={'scroll'} minWidth='40%' maxWidth='60%'
                     style={{maxHeight: 'calc(100% - 80px)'}} bg="gray.100" p={6} borderRadius="md" display="flex"
                     flexDirection="column" alignItems="center" justifyContent="flex-start">
                  <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
                    {currentQuestion.audioLink && (
                      <AudioCommon onNextQuestion={() => nextQuestion(currentQuestion)}
                                   disabled={false}
                                   audioLink={currentQuestion.audioLink}/>
                    )}
                    {areAllGroupQuestionsAnswered() && !isAnyGroupQuestionChecked() && (
                      <Button
                        mb={4}
                        colorPalette="blue"
                        onClick={handleCheckAllGroupAnswers}
                        size="lg"
                      >
                        Check All Answers
                      </Button>
                    )}
                  </Box>

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
                        {/*
                          ==============
                          show Icon correct, incorrect
                        */}
                        {/*{isQuestionAnswered(question.index) && isAnswerChecked(question.index) && (*/}
                        {/*  <Box as="span" ml={2}>*/}
                        {/*    <Image*/}
                        {/*      src={checkAnswer(question.index) ? '/icons/correct.svg' : '/icons/wrong.svg'}*/}
                        {/*      alt={checkAnswer(question.index) ? "Correct" : "Wrong"}*/}
                        {/*      boxSize="24px"*/}
                        {/*      display="inline"/>*/}
                        {/*  </Box>*/}
                        {/*)}*/}
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => handleAnswerChange(e, question.index)}
                        value={answers[question.index] || ""}
                        disabled={isAnswerChecked(question.index)}
                      >
                        <VStack align="start" spacing={2}>
                          {(question.answer && question.answer.length ? question.answer : ['A', 'B', 'C', 'D']).map((choice, index) => (
                            <RadioGroup.Item
                              key={index}
                              value={(index + 1)}
                              disabled={isAnswerChecked(question.index)}
                              style={{
                                backgroundColor: isQuestionAnswered(question.index) && isAnswerChecked(question.index) &&
                                  (question.correct === index + 1 ? '#d4edda' :
                                    (answers[question.index] === index + 1 && answers[question.index] !== question.correct ? '#f8d7da' : 'transparent')),
                                padding: '8px 12px',
                                borderRadius: '4px',
                                opacity: isAnswerChecked(question.index) ? (answers[question.index] === index + 1 || question.correct === index + 1 ? 1 : 0.6) : 1
                              }}
                            >
                              <RadioGroup.ItemHiddenInput/>
                              <RadioGroup.ItemIndicator/>
                              <RadioGroup.ItemText>{choice}</RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </VStack>
                      </RadioGroup.Root>
                    </Box>
                  ))}

                  {/* Single Check Answer button for the entire group */}
                  {
                    showDictionary && Constant.showDictionaryQuestionV2.includes(currentQuestion.type) && (
                      <Box mt={3} mb={3}>
                        <Text fontWeight="bold" mb={2}>Dictation:</Text>
                        <VStack align="start" spacing={3}>
                          <Textarea
                            placeholder={`Type what you hear...`}
                            value={(dictationGroupText[currentQuestion.index] && dictationGroupText[currentQuestion.index]) || ""}
                            onChange={(e) => setDictationGroupText(prev => ({
                              ...prev,
                              [currentQuestion.index]: e.target.value
                            }))}
                            disabled={isAnyGroupQuestionChecked()}
                            height="150px"
                            resize="vertical"
                          />
                        </VStack>
                      </Box>
                    )
                  }

                  {/* Single explanation for the entire group */}
                  {isAnyGroupQuestionChecked() && (
                    <Box mt={4} mb={5} p={4} bg="blue.50" borderRadius="md" boxShadow="md">
                      <Heading size="md" mb={3}>Explanation: </Heading>
                      <Box
                        dangerouslySetInnerHTML={{__html: currentExplanation }}
                        p={2}
                      />
                    </Box>
                  )}
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
                    .map((q) => {
                      // Determine button color based on answer status
                      let colorPalette = "teal";
                      if (answers[q.index] && isAnswerChecked(q.index)) {
                        colorPalette = checkAnswer(q.index) ? "green" : "red";
                      } else if (flaggedQuestions.includes(q.index)) {
                        colorPalette = "yellow";
                      }

                      return (
                        <Button
                          key={q.index}
                          minW='46px'
                          size="sm"
                          variant={flaggedQuestions.includes(q.index) || answers[q.index] ? "solid" : "outline"}
                          colorPalette={colorPalette}
                          onClick={() => setCurrentIndexQuestion(q.index)}
                        >
                          {q.index}
                        </Button>
                      );
                    })}
                </HStack>
              </Box>
            ))}
          </VStack>
        </Stack>
      )}
    </Flex>
  );
}