import {
  Box,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  HStack,
  Image,
  Portal, RadioGroup,
  Stack,
  Tabs,
  Text,
  VStack
} from "@chakra-ui/react";
import AudioCommon from "@/components/common/AudioCommon";
import React, { useEffect, useState } from "react";


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


export default function AnswersComponent({listQuestion = [], result = {}}) {

  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setGroupedQuestions(groupByPart(listQuestion));
  }, [listQuestion]);

  // useEffect(() => {
  //   const resultData = localStorage.getItem('result-test-local');
  //   if (resultData) {
  //     const parsedData = JSON.parse(resultData);
  //     setResult(parsedData);
  //   }
  // }, []);

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

  // Hàm lấy audioLink và imgLink cho các PART cần gom nhóm (chia nhóm liên tiếp, lấy media đầu nhóm)
  function getGroupMediaForParts(question) {
    const groupParts = ["PART_3", "PART_4", "PART_6", "PART_7"];
    if (question && groupParts.includes(question.type) && groupedQuestions[question.type]) {
      const partQuestions = groupedQuestions[question.type];
      // Chia thành các nhóm liên tiếp dựa vào audioLink hoặc imgLink
      let groups = [];
      let currentGroup = [];
      for (let q of partQuestions) {
        if (q.audioLink || q.imgLink) {
          if (currentGroup.length) groups.push(currentGroup);
          currentGroup = [q];
        } else {
          currentGroup.push(q);
        }
      }
      if (currentGroup.length) groups.push(currentGroup);
      // Tìm nhóm chứa câu hiện tại
      const group = groups.find(g => g.some(q => q.index === question.index));
      if (group && group.length) {
        return {
          audioLink: group[0].audioLink || null,
          imgLink: group[0].imgLink || null
        };
      }
    }
    return {
      audioLink: question ? question.audioLink : null,
      imgLink: question ? question.imgLink : null
    };
  }

  return (
    <>
      <Stack boxShadow="2xl" mt={8} bg="white" rounded="xl" p={4} spacing={8} height={'70vh'} width="100%" align="left">
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
                      <Box p="1" key={q.index} mb={1}>
                        <HStack gap="1">
                          <Text
                            textStyle="md">{q.index} - {getAnswer(q.correct)} :</Text>
                          <Text
                            style={{color: result?.[q.index] === q.correct ? '#2ecc71' : '#e74c3c'}}>{result?.[q.index] ? getAnswer(result?.[q.index]) : "Chưa trả lời"} </Text>
                          {
                            result?.[q.index] === q.correct ? (
                              <Image src="/icons/correct.svg" alt="correct-icon" boxSize="12px"/>
                            ) : (
                              <Image src="/icons/wrong.svg" alt="wrong-icon" boxSize="12px"/>
                            )
                          }
                          <Image style={{cursor: 'pointer'}} onClick={() => viewDetailQuestion(q)}
                                 src="/icons/open-external.svg" alt="open-extenal-icon" boxSize="16px"/>
                          {/*<Text style={{cursor: 'pointer', color: '#2563eb'}} >[detail]</Text>*/}
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


      <Dialog.Root lazyMount open={openDialog} onOpenChange={(e) => {
        setOpenDialog(e.open);
        if (!e.open) setCurrentQuestion(null);
      }} size="cover" placement="center" scrollBehavior="inside">
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Chi tiết câu {currentQuestion && currentQuestion.index}</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm"/>
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                {currentQuestion && (
                  <Box>
                    <VStack align="start" spacing={2} mb={3}>
                      {currentQuestion.answers && currentQuestion.answers.map((ans, idx) => (
                        <Box key={idx} p={2} borderRadius="md"
                             bg={currentQuestion.correct === idx + 1 ? 'green.100' : (result && result[currentQuestion.index] === idx + 1 ? 'red.100' : 'gray.50')}
                             border={currentQuestion.correct === idx + 1 ? '2px solid #38A169' : '1px solid #E2E8F0'}>
                          <Text><b>{getAnswer(idx + 1)}.</b> {ans}</Text>
                        </Box>
                      ))}
                    </VStack>
                    <Text fontWeight="semibold" color="green.600">Đáp án đúng: {getAnswer(currentQuestion.correct)}</Text>
                    {result && result[currentQuestion.index] && result[currentQuestion.index] !== currentQuestion.correct && (
                      <Text color="red.500">Bạn chọn: {getAnswer(result[currentQuestion.index])}</Text>
                    )}
                    <Flex direction="row" gap={4} mt={3} p={2} bg="yellow.50" borderRadius="md">
                      <Box minW={500}>
                        {/*<Heading size="md" mb={2}>Question {currentQuestion.index}</Heading>*/}
                        {(() => {
                          const media = getGroupMediaForParts(currentQuestion);
                          return (
                            <>
                              {media.imgLink && (
                                <Box mb={6} textAlign="center">
                                  <Image src={media.imgLink}/>
                                </Box>
                              )}
                              {media.audioLink && (
                                <AudioCommon audioLink={media.audioLink}/>
                              )}
                            </>
                          );
                        })()}
                        {currentQuestion.description &&
                          <Text mb={2} fontWeight='bold'>{currentQuestion.description}</Text>}
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
                      </Box>
                      <Box>
                        <Text fontWeight="bold" my={2}>Giải thích:</Text>
                        {currentQuestion.explanation ? (
                          <Box
                            as="div"
                            dangerouslySetInnerHTML={{__html: currentQuestion.explanation}}
                          />
                        ) : (
                          <Text>Không có giải thích.</Text>
                        )}
                      </Box>

                    </Flex>
                  </Box>
                )}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )

}