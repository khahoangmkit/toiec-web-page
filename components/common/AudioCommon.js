'use client'

import {
  Box, HStack, Image,
} from '@chakra-ui/react'
import React, {useRef} from "react";


export default function AudioCommon({ audioLink }) {

  const audioRef = useRef(null);

  const handleRewindBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };
  const handleRewindNext = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + 5);
    }
  };

  return (
    <HStack spacing={4} mb={4} >
      <Box style={{cursor: "pointer"}} onClick={handleRewindBack}>
        <Image src="/icons/rewind-5.svg" alt="Rewind 5s" boxSize="30px" />
      </Box>


      <Box style={{cursor: "pointer"}} onClick={handleRewindNext}>
        <Image src="/icons/rewind-5-forward.svg" alt="Rewind 5s" boxSize="30px" />
      </Box>

      <audio autoPlay key={audioLink} ref={audioRef} controls>
        <source
          src={audioLink}
          type="audio/mpeg" />
        Trình duyệt của bạn không hỗ trợ audio.
      </audio>
    </HStack>
  )
}