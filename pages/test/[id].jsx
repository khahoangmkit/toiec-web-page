import {
  Box,
  Button,
  Stack,
  Text,
  Tabs,
  CheckboxGroup,
  Checkbox, Fieldset,
  Input, Heading, Image
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Constant } from "@/constants";
import ExamDetail from "@/components/common/ExamDetail";
import { toaster } from "@/components/ui/toaster";
import {signIn, useSession} from "next-auth/react";

const listPartOption = [
  {
    name: 'Part 1',
    value: 'PART_1',
  },
  {
    name: 'Part 2',
    value: 'PART_2',
  },
  {
    name: 'Part 3',
    value: 'PART_3',
  },
  {
    name: 'Part 4',
    value: 'PART_4',
  },
  {
    name: 'Part 5',
    value: 'PART_5',
  },
  {
    name: 'Part 6',
    value: 'PART_6',
  },
  {
    name: 'Part 7',
    value: 'PART_7',
  },
];

export default function Page() {
  const router = useRouter();
  const {data: session, status} = useSession();


  const [stepIntro, setStepIntro] = useState(0);

  const [isFullTest, setIsFullTest] = useState(true);
  const [listQuestion, setListQuestion] = useState([]);
  const [testName, setTestName] = useState("");

  const [timer, setTimer] = useState(7200);
  const [selectedParts, setSelectedParts] = useState([]);
  const [practiceTime, setPracticeTime] = useState(0);

  // Hàm nextStep để chuyển bước
  const nextStep = () => setStepIntro(stepIntro + 1);

  // Ref và hàm điều khiển audio test
  const audioRef = useRef(null);

  const handleVolume = (e) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  useEffect(() => {
    if (!router.query.id) {
      return;
    }
    if (!session) {
      signIn('google', { callbackUrl: router.asPath });
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/test/${router.query.id}`)
      .then((response) => response.json())
      .then(res => {
        const data = res.data;
        setListQuestion(data.questionsJson);
        setTestName(data.name);
      })
      .catch(err => {
        console.log(err, "error")
      })
  }, [router.query.id]);

  const handleSubmit = async (result) => {
    try {
      let listeningCorrect = 0;
      let readingCorrect = 0;
      let totalListening = 0;
      let totalReading = 0;

      listQuestion.forEach(quest => {
        const isListening = Constant.ListenQuestion.includes(quest.type);
        const userAnswer = (result.answers || result)[quest.index];
        const isCorrect = userAnswer === quest.correct;

        if (isListening) {
          totalListening++;
          if (isCorrect) listeningCorrect++;
        } else {
          totalReading++;
          if (isCorrect) readingCorrect++;
        }
      });

      const res = await fetch("/api/result", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: session.user.id,
          testId: router.query.id,
          testName,
          nameTest: result.nameTest,
          answers: result.answers || result,
          listeningCorrect,
          readingCorrect,
          totalListening,
          totalReading,
          isFullTest,
          parts: result.parts || selectedParts || [],
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Lưu kết quả thất bại");
    } catch (e) {
      console.error(e);
      toaster.create({title: "Lưu kết quả thất bại", type: "error"});
    }

    localStorage.setItem('result-test-local', JSON.stringify({result, parts: result.parts || selectedParts || []}));
    router.push(`/result/${router.query.id}/0`);
  };

  function startPractice() {
    if (selectedParts.length === 0) {
      toaster.create({
        title: `Vui lòng chọn phần thi muốn luyện tập`,
        type: 'error',
      })
      return;
    }

    const filtered = listQuestion.filter(q => selectedParts.includes(q.type));
    setListQuestion(filtered);
    setTimer(Number(practiceTime) * 60);
    setIsFullTest(false);
    setStepIntro(3);
  }

  function onChangeCheckBox(e) {
    setSelectedParts(e);
  }

  function startFullTest() {
    setStepIntro(1);
  }

  return (
    <>
      {
        stepIntro === 0 && (
          <Stack
            minH={'80vh'}
            bg='white'
            rounded={'xl'}
            p={8}
            align={'center'}
          >

            <Tabs.Root defaultValue={1} width={'800px'}>
              <Tabs.List>
                <Tabs.Trigger value={1}>
                  <Text fontWeight="bold">Làm full test</Text>
                </Tabs.Trigger>
                <Tabs.Trigger value={2}>
                  <Text fontWeight="bold">Luyện tập</Text>
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value={1}>
                <Box backgroundColor="#04adc9" borderRadius='md' width="100%" padding="4" mb={2} color="white">
                  Sẵn sàng để bắt đầu làm full test?<br/> Để đạt được kết quả tốt nhất, bạn cần dành ra 120 phút cho bài test
                  này.
                </Box>

                <Box>
                  <Button size="sm"
                          bg="#283382"
                          _hover={{
                            bg: "#2aa9c7",   // Màu nền khi hover
                          }}
                          variant="solid" onClick={() => startFullTest()}>
                    Start test
                  </Button>
                </Box>
              </Tabs.Content>
              <Tabs.Content value={2}>
                <Box backgroundColor="#04adc9" borderRadius='md' width="100%" padding="4" mb={2} color="white">
                  Hình thức luyện tập từng phần và chọn mức thời gian phù hợp sẽ giúp bạn tập trung vào giải đúng các
                  câu hỏi thay vì phải chịu áp lực hoàn thành bài thi.
                </Box>

                {/* Chọn phần thi */}
                <Box mb={3}>
                  <Fieldset.Root>
                    <CheckboxGroup
                      defaultValue={[]}
                      name="framework"
                      value={selectedParts}
                      onValueChange={(e) => onChangeCheckBox(e)}
                    >
                      <Fieldset.Legend fontWeight="bold" fontSize="sm" mb="2">
                        Chọn phần thi muốn luyện tập:
                      </Fieldset.Legend>
                      <Fieldset.Content>
                        {listPartOption.map((item, idx) => (
                          <Checkbox.Root key={idx} value={item.value}>
                            <Checkbox.HiddenInput/>
                            <Checkbox.Control/>
                            <Checkbox.Label>{item.name}</Checkbox.Label>
                          </Checkbox.Root>
                        ))}
                      </Fieldset.Content>
                    </CheckboxGroup>
                  </Fieldset.Root>
                </Box>

                {/* Nhập thời gian làm bài */}
                <Box mb={3}>
                  <Text fontWeight="bold" mb={1}>Nhập thời gian làm bài (phút):</Text>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    width="120px"
                    value={practiceTime}
                    onChange={e => setPracticeTime(e.target.value)}
                  />
                </Box>

                <Box>
                  <Button
                    size="sm"
                    colorPalette="teal"
                    variant="solid"
                    bg="#283382"
                    _hover={{
                      bg: "#2aa9c7",   // Màu nền khi hover
                    }}
                    onClick={() => startPractice()}
                    isDisabled={selectedParts.length === 0 || !practiceTime}
                  >
                    Start practice
                  </Button>
                </Box>
              </Tabs.Content>
            </Tabs.Root>

          </Stack>

        )
      }
      {
        stepIntro === 1 && (
          <Box
            minH={'80vh'}
            boxShadow="lg"
            borderRadius="lg"
            padding={6}
            mb={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Box p={4}
                 width={'800px'}
                 boxShadow={'2xl'}
                 bg='white'
                 rounded={'xl'}>


              {/* Audio test section */}
              <Box mb={4} display="flex" borderBottomWidth="1px" flexDirection="row" justifyContent='space-between'>
                <Heading pb={1}>Volume test</Heading>

                <audio ref={audioRef} autoPlay src="/VoiecTest.mp3" loop/>
                <Box display="flex" gap={1} alignItems="center">
                  <Image src="/icons/sound-max.svg" boxSize="26px"></Image>
                  <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume}
                         style={{width: 120}}/>
                </Box>
              </Box>

              <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">
                This is Volume Test. If you don't hear clearly, adjust the volume control on your computer, or
                contact the administrators for assistance.
              </Text>
              <Button bg="#283382"
                      _hover={{
                        bg: "#2aa9c7",   // Màu nền khi hover
                      }}
                      colorPalette="teal" onClick={nextStep}>
                Next
              </Button>

            </Box>
          </Box>
        )
      }
      {/*{*/}
      {/*  stepIntro === 2 && (*/}
      {/*    <Box*/}
      {/*      minH={'80vh'}*/}
      {/*      boxShadow="lg"*/}
      {/*      borderRadius="lg"*/}
      {/*      padding={6}*/}
      {/*      mb={4}*/}
      {/*      display="flex"*/}
      {/*      flexDirection="column"*/}
      {/*      alignItems="center"*/}
      {/*    >*/}
      {/*      <Box p={4}*/}
      {/*           width={'800px'}*/}
      {/*           boxShadow={'2xl'}*/}
      {/*           bg='white'*/}
      {/*           rounded={'xl'}>*/}

      {/*        /!* Audio test section *!/*/}
      {/*        <Box mb={4} display="flex" borderBottomWidth="1px" flexDirection="row" justifyContent='space-between'>*/}
      {/*          <Heading pb={1}>DIRECTIONS</Heading>*/}

      {/*          <audio ref={audioRef} autoPlay src="/directions.mp3" loop/>*/}
      {/*          <Box display="flex" gap={1} alignItems="center">*/}
      {/*            <Image src="/icons/sound-max.svg" boxSize="26px"></Image>*/}
      {/*            <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume}*/}
      {/*                   style={{width: 120}}/>*/}
      {/*          </Box>*/}
      {/*        </Box>*/}

      {/*        <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">*/}
      {/*          In the Listening test, you will be asked to demonstrate how well you understand spoken English. The entire*/}
      {/*          Listening test will last approximately 45 minutes. There are four parts, and directions are given for each*/}
      {/*          part. You must mark your answers on the separate answer sheet. Do not write your answers in your test book*/}
      {/*        </Text>*/}

      {/*        <Button colorPalette="teal" onClick={nextStep}>*/}
      {/*          Next*/}
      {/*        </Button>*/}

      {/*      </Box>*/}
      {/*    </Box>*/}
      {/*  )*/}
      {/*}*/}
      {
        stepIntro === 2 && (
          <Box
            minH={'80vh'}
            boxShadow="lg"
            borderRadius="lg"
            padding={6}
            mb={4}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Box p={4}
                 width={'800px'}
                 boxShadow={'2xl'}
                 bg='white'
                 rounded={'xl'}>
              <Box mb={4} borderBottomWidth="1px" display="flex" flexDirection="row" justifyContent='space-between'>
                <Heading pb={1}>LISTENING TEST</Heading>

                <audio ref={audioRef} src="/introduct-test.mp3" autoPlay loop/>
                <Box display="flex" gap={1} alignItems="center">
                  <Image src="/icons/sound-max.svg" boxSize="26px"></Image>
                  <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume}
                         style={{width: 120}}/>
                </Box>
              </Box>

              <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">
                In the Listening test, you will be asked to demonstrate how well you understand spoken English.
                The entire Listening test will last approximately 45 minutes. There are four parts, and directions are
                given for each part. You must mark your answers on the separate answer sheet. Do not write your answers in
                your test book.
              </Text>

              <Heading pb={1} borderBottomWidth="1px">PART 1</Heading>

              <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">
                <strong>Directions:</strong> For each question in this part, you will hear four statements about a picture
                in your test book. When you hear the statements, you must select the one statement that best describes
                what you see in the picture. Then find the number of the question on your answer sheet and mark your
                answer. The statements will not be printed in your test book and will be spoken only one time.
              </Text>

              <Image src="/intro_toiec.png"></Image>
              <Text pt={1} fontSize="md" color="gray.800" mb={4} textAlign="start">
                Statement (C), "They're sitting at a table," is the best description of the picture, so you should select
                answer (C) and mark it on your answer sheet
              </Text>

              <Button bg="#283382"
                      _hover={{
                        bg: "#2aa9c7",   // Màu nền khi hover
                      }}
                      colorPalette="teal" onClick={nextStep}>
                Start Test
              </Button>
            </Box>
          </Box>
        )
      }

      {
        stepIntro === 3 && <ExamDetail
          listQuestion={listQuestion}
          timer={timer}
          isFullTest={isFullTest}
          onSubmit={(e) => handleSubmit(e)}
        ></ExamDetail>
      }
    </>
  );

}
