import {
  Box,
  Button,
  CloseButton,
  Dialog,
  FormControl,
  FormLabel,
  Input,
  Portal,
  Text,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

export default function ActivationDialog({ isOpen, onClose, onActivationSuccess }) {
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const toast = useToast();
  const { data: session } = useSession();

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      setError("Vui lòng nhập mã kích hoạt");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: activationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra khi kích hoạt tài khoản");
      }

      toaster.create({
        title: "Kích hoạt thành công",
        description: "Tài khoản của bạn đã được kích hoạt thành công",
        type: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onActivationSuccess) {
        onActivationSuccess(data.user);
      }

      onClose();
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi kích hoạt tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <></>
  );
}
