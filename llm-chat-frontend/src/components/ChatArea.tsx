import { useState } from "react";
import {
  Box,
  Text,
  TextInput,
  Button,
  Group,
  Paper,
  ScrollArea,
  Loader,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Conversation, Message } from "../types/conversation";

const API_URL = "http://localhost:8000";

interface ChatAreaProps {
  conversation: Conversation;
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await axios.post(
        `${API_URL}/queries?id=${conversation.id}`,
        {
          role: "user" as const,
          content: message,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversation.id],
      });
    },
  });

  const handleSend = () => {
    if (input.trim()) {
      sendMessage.mutate(input);
      setInput("");
    }
  };

  return (
    <Box
      style={{
        height: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ScrollArea style={{ flex: 1 }}>
        {conversation.messages.map((message: Message, index: number) => (
          <Paper
            key={index}
            p="md"
            mb="sm"
            style={(theme) => ({
              backgroundColor:
                message.role === "user"
                  ? theme.colors.blue[1]
                  : theme.colors.gray[1],
            })}
          >
            <Text>
              <strong>{message.role}:</strong> {message.content}
            </Text>
          </Paper>
        ))}
        {sendMessage.isPending && (
          <Paper p="md" mb="sm">
            <Text>Loading...</Text>
          </Paper>
        )}
      </ScrollArea>
      <Group mt="md" align="flex-end">
        <TextInput
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={sendMessage.isPending}>
          Send
        </Button>
      </Group>
    </Box>
  );
}
