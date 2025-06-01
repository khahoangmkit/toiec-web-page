// --- Bình luận cho từng bài thi TOEIC ---
import { Textarea, Stack, Box, Button, Text, Heading, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { log } from "next/dist/server/typescript/utils";

export default function CommentSection({ testId, session }) {

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // Lấy danh sách comment
  const fetchComments = async () => {
    setLoading(true);
    const res = await fetch(`/api/comments/${testId}`);
    const data = await res.json();
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (testId) fetchComments();
  }, [testId]);

  // Gửi comment cha
  const handleSubmit = async () => {
    if (!content.trim()) return;
    const res = await fetch(`/api/comments/${testId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setContent("");
      fetchComments();
    }
  };

  // Gửi reply
  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;
    const res = await fetch(`/api/comments/${testId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, parentId }),
    });
    if (res.ok) {
      setReplyTo(null);
      setReplyContent("");
      fetchComments();
    }
  };
  console.log('section', session)

  return (
    <Box mt={10} mb={10}  width={'800px'} p={4} borderWidth={"1px"} borderRadius="md" bg="gray.50">
      <Heading size="md" mb={4}>Bình luận</Heading>
      {session ? (
        <Box mb={4} display="flex" gap={2} alignItems="flex-start" driverWidth="1px">
          <Avatar.Root>
            <Avatar.Image src={session?.user?.image}/>
          </Avatar.Root>
          <Textarea
            placeholder="Viết bình luận của bạn..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={2}
            maxLength={500}
          />
          <Button ml={2}
                  bg="#283382"
                  _hover={{
                    bg: "#2aa9c7",   // Màu nền khi hover
                  }}  onClick={handleSubmit} isLoading={loading}>
            Gửi
          </Button>
        </Box>
      ) : (
        <Text mb={4} color="gray.500">Bạn cần đăng nhập để bình luận.</Text>
      )}
      {/*<Divider mb={4}/>*/}
      {loading ? <Text>Đang tải bình luận...</Text> : (
        <Stack spacing={6}>
          {comments.length === 0 && <Text color="gray.500">Chưa có bình luận nào.</Text>}
          {/*{console.log('comments', comments)}*/}
          {comments.map(c => (
            <Box key={c.id} p={3} >
              <Box display="flex" gap={2} alignItems="center">
                <Avatar.Root>
                  <Avatar.Image src={c.user?.image || undefined}/>
                </Avatar.Root>
                <Text fontWeight="bold" fontSize="sm">{c.user?.name || "Ẩn danh"}</Text>
                <Text fontSize="xs" color="gray.500">{new Date(c.createdAt).toLocaleString()}</Text>
              </Box>
              <Text mt={1} fontSize="sm">{c.content}</Text>
              <Box mt={2}>
                {session && (
                  <Button
                    size="xs"
                    variant="plain"
                    fontWeight="bold"
                    colorPalette="blue"
                    onClick={() => setReplyTo(c.id)}>Trả lời</Button>
                )}
              </Box>
              {/* Reply form */}
              {replyTo === c.id && (
                <Box mt={2} display="flex" gap={2} alignItems="flex-start">
                  {/*<Avatar size="xs" src={session.user?.image || undefined}/>*/}
                  <Avatar.Root>
                    <Avatar.Image size="xs" src={session.user?.image || undefined}/>
                  </Avatar.Root>
                  <Textarea
                    placeholder="Viết trả lời..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={2}
                    maxLength={500}
                  />
                  <Button ml={2} colorPalette="teal" size="sm" onClick={() => handleReply(c.id)}>
                    Gửi
                  </Button>
                  <Button colorPalette="red" ml={2} size="sm" onClick={() => { setReplyTo(null); setReplyContent(""); }}>Huỷ</Button>
                </Box>
              )}
              {/* Hiển thị replies */}
              <Stack mt={3} pl={6} spacing={3}>
                {c.replies?.map(r => (
                  <Box key={r.id} borderLeft="2px solid #2aa9c7" pl={3}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Avatar.Root>
                        <Avatar.Image size="xs" src={r.user?.image || undefined}/>
                      </Avatar.Root>
                      <Text fontWeight="bold" fontSize="sm">{r.user?.name || "Ẩn danh"}</Text>
                      <Text fontSize="xs" color="gray.500">{new Date(r.createdAt).toLocaleString()}</Text>
                    </Box>
                    <Text mt={1} fontSize="sm">{r.content}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
