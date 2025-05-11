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
  RadioGroup,
  Tabs,
  CheckboxGroup,
  Checkbox, Fieldset,
  Input, For
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Constant} from "@/constants";
import ExamDetail from "@/components/common/ExamDetail";


const optionAction = [
  {
    name: 'Làm full test',
    value: 1,
  },
  {
    name: '',
    value: 2
  }
]
export default function Page() {
  const router = useRouter();

  const [showExam, setShowExam] = useState(false);

  const [listQuestion, setListQuestion] = useState([]);
  const [timer, setTimer] = useState(7200);
  const [selectedParts, setSelectedParts] = useState([]);
  const [practiceTime, setPracticeTime] = useState('');


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
      })
      .catch(err => {
        console.log(err, "error")
      })
  }, [router.query.id]);


  const handleSubmit = (result) => {
    localStorage.setItem(`${router.query.id}-${Constant.RESULT}`, JSON.stringify(result));
    router.push(`/result/${router.query.id}`);
    console.log('Submitted answers:', result);
  };

  return (
    <>
      {
        !showExam && (
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
                  Sẵn sàng để bắt đầu làm full test? Để đạt được kết quả tốt nhất, bạn cần dành ra 120 phút cho bài test này.
                </Box>

                <Box>
                  <Button size="sm" colorPalette="teal" variant="solid" onClick={() => setShowExam(true)}> Bắt đầu thi</Button>
                </Box>
              </Tabs.Content>
              <Tabs.Content value={2}>
                <Box background="tomato" width="100%" padding="4" mb={2} color="white">
                  Hình thức luyện tập từng phần và chọn mức thời gian phù hợp sẽ giúp bạn tập trung vào giải đúng các
                  câu hỏi thay vì phải chịu áp lực hoàn thành bài thi.
                </Box>

                {/* Chọn phần thi */}
                <Box mb={3}>
                  <Text fontWeight="bold" mb={1}>Chọn phần thi muốn luyện tập:</Text>
                  <Fieldset.Root>
                    <CheckboxGroup defaultValue={[]} name="framework">
                      <Fieldset.Legend fontSize="sm" mb="2">
                        Select framework
                      </Fieldset.Legend>
                      <Fieldset.Content>
                        <For each={["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"]}>
                          {(value) => (
                            <Checkbox.Root key={value} value={value}>
                              <Checkbox.HiddenInput />
                              <Checkbox.Control />
                              <Checkbox.Label>{value}</Checkbox.Label>
                            </Checkbox.Root>
                          )}
                        </For>
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
                    onClick={() => {
                      // Lọc câu hỏi theo part đã chọn và set lại timer
                      const filtered = listQuestion.filter(q => selectedParts.includes(q.type));
                      setListQuestion(filtered);
                      setTimer(Number(practiceTime) * 60);
                      setShowExam(true);
                    }}
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
        showExam && <ExamDetail
          listQuestion={listQuestion}
          timer={timer}
          onSubmit={(e) => handleSubmit(e)}
        ></ExamDetail>
      }
    </>
  );

}
