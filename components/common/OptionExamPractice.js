'use client'

import { Box, Button, Checkbox, CheckboxGroup, Fieldset, Input, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

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
export default function OptionExamPractice(selectedParts, onChangeCheckBox, onStartTest) {

  const [practiceTime, setPracticeTime] = useState(0);


  const startFullTest = (isFullTest) => {
    if (!isFullTest) {
      if (selectedParts.empty()) {
        toaster.create({
          title: `Vui lòng chọn phần thi muốn luyện tập`,
          type: 'error',
        })
      }

      if (!practiceTime) {
        toaster.create({
          title: `Vui lòng chọn thời gian luyện tập`,
          type: 'error',
        })
      }
    }
    onStartTest({
      fullTest: isFullTest,
      selectedParts,
      practiceTime
    });
  }
  return (
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
            <Button size="sm" colorPalette="teal" variant="solid" onClick={() => setShowExam(true)}> Bắt đầu
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
              onClick={() => startFullTest(false)}
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