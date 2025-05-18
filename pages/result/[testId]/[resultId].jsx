import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Image
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Constant} from "@/constants";
import AudioCommon from "@/components/common/AudioCommon";
import AnswersComponent from "@/components/common/AnswersComponent";

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

export default function ResultPage() {
  const router = useRouter();
  const { testId, resultId } = router.query;

  const [result, setResult] = useState(null);
  const [listQuestions, setListQuestions] = useState([]);
  const [partSelected, setPartSelected] = useState(["PART_1", "PART_2", "PART_3", "PART_4","PART_5", "PART_6", "PART_7"]);

  const [dataExam, setDataExam] = useState(null);
  const [testResults, setTestResults] = useState({
    correct: 0,
    correctListen: 0,
    correctRead: 0,
    incorrect: 0,
    skipped: 0,
    totalQuestions: 0,
  });

  // Fetch result by resultId
  useEffect(() => {
    if (!resultId) {
      return;
    }
    if (Number(resultId) === 0) {

      const resultData = localStorage.getItem('result-test-local');
      if (resultData) {
        const parsedData = JSON.parse(resultData);
        setResult(parsedData.result);
        setPartSelected(parsedData.parts.length > 0 ? parsedData.parts : setPartSelected);
      }
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/result?id=${resultId}`)
      .then((response) => response.json())
      .then(res => {
        if (res && res.data) {
          setResult(res.data.answers);
          setPartSelected(res.data.parts.length > 0 ? res.data.parts : setPartSelected);
        } else {
          setResult(null);
        }
      })
      .catch(err => {
        console.log(err, "error fetching result");
        setResult(null);
      });
  }, [resultId]);

  // Fetch test data by testId
  useEffect(() => {
    if (!testId) {
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/test/${testId}`)
      .then((response) => response.json())
      .then(res => {
        const data = res.data;
        setDataExam(data);
        setListQuestions(data.questionsJson || [])
        if (!result) return;
        const results = {
          correct: 0,
          correctListen: 0,
          correctRead: 0,
          incorrect: 0,
          skipped: 0,
          totalQuestions: data.questionsJson.length,
        };
        // Check answers for each question
        data.questionsJson.forEach(question => {
          const userAnswer = result[question.index];
          if (userAnswer) {
            if (userAnswer === question.correct) {
              results.correct += 1;
              Constant.ListenQuestion.includes(question.type) ? results.correctListen += 1 :  results.correctRead += 1;
            } else {
              results.incorrect += 1;
            }
          } else if (partSelected.includes(question.type)) {
            results.skipped += 1;
          }
        });
        setTestResults(results);
      })
      .catch(err => {
        console.log(err, "error")
      })
  }, [testId, result]);

  function backToHome() {
    router.push("/");
  }

  return (
    <Box p={8}>
      <Stack boxShadow="2xl" bg="white" rounded="xl" p={4} spacing={8} width="100%" align="left">

        <Flex align={'center'} gap={4}>
          <Heading> Kết quả đề thi: {dataExam?.name}</Heading>
          <Button
            size="sm"
            colorPalette="teal"
            variant="outline"
            onClick={backToHome}
          >Quay lại trang chủ</Button>
        </Flex>

        <Flex direction="column" align="left" justify="center" >
          <Box mb={2} mt={2}>
            <HStack spacing={4}>
              <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center"  boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Text pt={30} color={'#36cc71'}>Tổng câu đúng</Text>
                <Text fontSize="lg" fontWeight="bold">{testResults.correct}</Text>
              </Box>
                <Box px={5} py={3} borderRadius="lg" width="220px" height="110px" textAlign="center" boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Image src="/icons/sound-max.svg" alt="Listen"  boxSize="30px" ></Image>
                  <Text  color={'#3498db'}>Số câu nghe đúng </Text>
                  <Text fontSize="lg" fontWeight="bold">{testResults.correctListen}</Text>
                </Box>
                <Box color="purple.800" px={5} py={3} borderRadius="lg" width="220px" height="110px" textAlign="center" boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Image src="/icons/reading-icon.svg" alt="Reading" boxSize="30px" />
                  <Text color={'#36cc71'}>Số câu đọc đúng</Text>
                  <Text fontSize="lg" fontWeight="bold">{testResults.correctRead}</Text>
                </Box>

              <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center" boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Image src="/icons/cancel-icon.svg" alt="wrong-icon" boxSize="30px" />
                <Text color={'#e74c3d'}>Sai</Text>
                <Text fontSize="lg" fontWeight="bold">{testResults.incorrect}</Text>
              </Box>
              <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center"  boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Image src="/icons/minus-circle.svg" alt="wrong-icon" boxSize="30px" />
                <Text>Bỏ qua</Text>
                <Text fontSize="lg" fontWeight="bold">{testResults.skipped}</Text>
              </Box>
              <Box px={5} py={3} borderRadius="lg" width="200px" height="110px" textAlign="center"  boxShadow="md" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Text pt={30}>Tổng điểm</Text>
                <Text fontSize="lg" fontWeight="bold">{(testResults.correct * 5)}</Text>
              </Box>
            </HStack>
          </Box>
        </Flex>
      </Stack>


      <AnswersComponent listQuestion={listQuestions} result={result} />
    </Box>
  );
}
