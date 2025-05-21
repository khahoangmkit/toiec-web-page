import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function ButtonTimerGroup({ initialTime, onTimeUp }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let interval;
    if (initialTime === 0) {
      // Đếm tăng dần
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (time <= 0) {
        onTimeUp(); // Gọi callback khi hết thời gian
        return;
      }
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [time, initialTime, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <Text fontSize="xl" color={'#283382'} px={2} borderRadius="md" border="1px solid #283382">
      {initialTime === 0 ? formattedTime : time <= 0 ? "00:00" : formattedTime}
    </Text>
  );
}