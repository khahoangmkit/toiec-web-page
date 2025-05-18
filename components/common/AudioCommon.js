'use client'

import {
  Box, HStack, Image,
} from '@chakra-ui/react'
import React, {useRef} from "react";


export default function AudioCommon({ audioLink, onNextQuestion, disabled = false}) {

  const audioRef = useRef(null);

  const handleRewindBack = () => {
    if (disabled) return;
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };
  const handleRewindNext = () => {
    if (disabled) return;
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + 5);
    }
  };

  return (
    <Box style={{position: "relative"}}>
    <HStack spacing={4} mb={4}>
      {disabled && (<div style={{position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: 100, background: "#f4f4f5" }}></div>)}
      <Box style={{cursor: "pointer"}} onClick={handleRewindBack}>
        <Image src="/icons/rewind-5.svg" alt="Rewind 5s" boxSize="30px" />
      </Box>

      <Box style={{cursor: "pointer"}} onClick={handleRewindNext}>
        <Image src="/icons/rewind-5-forward.svg" alt="Rewind 5s" boxSize="30px" />
      </Box>

      <audio
        autoPlay
        key={audioLink}
        ref={audioRef}
        controls
        controlsList="nodownload"
        onEnded={() => {
          if (typeof onNextQuestion === 'function') {
            onNextQuestion();
          }
        }}
      >
        <source
          src={audioLink}
          type="audio/mpeg" />
        Trình duyệt của bạn không hỗ trợ audio.
      </audio>
    </HStack>
    </Box>
  )
}