import { Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function ButtonTimerGroup({ initialTime, onTimeUp }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp(); // Gọi callback khi hết thời gian
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <Text fontSize="xl" fontWeight="bold">
      {time <= 0 ? "00:00" : formattedTime}
    </Text>
  );
}