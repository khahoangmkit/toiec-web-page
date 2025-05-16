import {
  Box,
  Button,
  Stack,
  Text,
  Tabs,
  CheckboxGroup,
  Checkbox, Fieldset,
  Input, For
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Constant } from "@/constants";
import ExamDetail from "@/components/common/ExamDetail";
import { toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

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
const ListenQuestion = ["PART_1", "PART_2", "PART_3", "PART_4"];

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  const [showExam, setShowExam] = useState(false);
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
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
  const handleVolume = (e) => {
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  useEffect(() => {
    if (!router.query.id) {
      return;
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
        headers: { "Content-Type": "application/json" },
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
      toaster.create({ title: "Lưu kết quả thất bại", type: "error" });
    }

    localStorage.setItem('result-test-local', JSON.stringify(result));
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

    if (!practiceTime) {
      toaster.create({
        title: `Vui lòng chọn thời gian luyện tập`,
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
    setShowExam(true);
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
                <Box background="tomato" width="100%" padding="4" mb={2} color="white">
                  Sẵn sàng để bắt đầu làm full test? Để đạt được kết quả tốt nhất, bạn cần dành ra 120 phút cho bài test
                  này.
                </Box>

                <Box>
                  <Button size="sm" colorPalette="teal" variant="solid" onClick={() => startFullTest()}> Bắt đầu
                    thi</Button>
                </Box>
              </Tabs.Content>
              <Tabs.Content value={2}>
                <Box background="tomato" width="100%" padding="4" mb={2} color="white">
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
                    onClick={() => startPractice()}
                    isDisabled={selectedParts.length === 0 || !practiceTime}
                  >
                    Luyện tập
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
              Gioi thieu mo dau test am thanh
            </Text>
            {/* Audio test section */}
            <Box mb={4} display="flex" flexDirection="column" alignItems="center">
              <audio ref={audioRef} autoPlay   src="/introduct-test.mp3" loop />
              <Box display="flex" alignItems="center">
                <Text fontSize="sm" mr={2}>Âm lượng</Text>
                <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume} style={{width: 120}} />
              </Box>
            </Box>
            <Button colorPalette="teal" onClick={nextStep}>
              Tiếp tục
            </Button>
          </Box>
        )
      }
      {
        stepIntro === 2 && (
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
              Gioi thieu part 1 thi
            </Text>
            {/* Audio test section */}
            <Box mb={4} display="flex" flexDirection="column" alignItems="center">
              <audio ref={audioRef} src="/introduct-test.mp3" autoPlay loop />
              <Box display="flex" alignItems="center">
                <input type="range" min={0} max={1} step={0.01} defaultValue={1} onChange={handleVolume} style={{width: 120}} />
              </Box>
            </Box>
            <Button colorPalette="teal"  onClick={nextStep}>
              Bắt đầu làm bài
            </Button>
          </Box>
        )
      }

      {
        stepIntro === 3 && <ExamDetail
          listQuestion={listQuestion}
          timer={timer}
          disableSelectListen={isFullTest}
          onSubmit={(e) => handleSubmit(e)}
        ></ExamDetail>
      }
    </>
  );

}
