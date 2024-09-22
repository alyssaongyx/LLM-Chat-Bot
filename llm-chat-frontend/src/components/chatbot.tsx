import React from "react";
import { Box, ScrollArea, Text, Anchor, Center, Flex } from "@mantine/core";
import { ChatInput } from "./input";
import { Message } from "./message";
import styles from "../styles/chatbot.module.css";
import { Logo } from "./logo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LLMProperties from "./LLMProperties";

const API_URL = "/api/chat";

interface MessageType {
  message: string;
  sender: string;
  loading?: boolean;
}

interface ConversationData {
  messages: MessageType[];
  conversationId: string;
}

export const Chatbot: React.FC = () => {
  const queryClient = useQueryClient();

  const chatMutation = useMutation<
    { response: string; conversationId: string },
    Error,
    { prompt: string; conversationId: string | null }
  >({
    mutationFn: async ({
      prompt,
      conversationId,
    }: {
      prompt: string;
      conversationId: string | null;
    }) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, conversationId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["conversation", data.conversationId],
        (oldData: any) => ({
          ...oldData,
          messages: [
            ...(oldData?.messages || []),
            { message: data.response, sender: "bot" },
          ],
        })
      );
    },
    onError: (error) => {
      console.error("Error fetching the API response.", error);
    },
  });

  const conversationData = queryClient.getQueryData<ConversationData>([
    "conversation",
    chatMutation.data?.conversationId,
  ]);
  const messages = conversationData?.messages || [];

  const handleSendMessage = async (message: string) => {
    const userMessage: MessageType = { message, sender: "user" };
    const currentConversationId = chatMutation.data?.conversationId || null;

    queryClient.setQueryData<ConversationData>(
      ["conversation", currentConversationId],
      (oldData) => ({
        ...oldData,
        messages: [...(oldData?.messages || []), userMessage],
        conversationId: currentConversationId || "",
      })
    );

    chatMutation.mutate({
      prompt: message,
      conversationId: currentConversationId,
    });
  };

  return (
    <Box className={styles.chatbot}>
      <ScrollArea className={styles.messages}>
        {messages.length === 0 ? (
          <Center style={{ height: "70vh" }}>
            <Flex justify="center" align="center" direction="column">
              <Logo width={200} height={80} />
              <Text c="dimmed">
                Chat with{" "}
                <Anchor href="https://openai.com/" target="_blank">
                  OpenAI
                </Anchor>{" "}
                projects
              </Text>
            </Flex>
          </Center>
        ) : (
          <Box className={styles.messageBox}>
            {messages.map((msg: MessageType, index: number) => (
              <div key={index} className={styles.messageContainer}>
                <Message
                  message={msg.message}
                  sender={msg.sender}
                  isLoading={
                    chatMutation.isPending && index === messages.length - 1
                  }
                />
              </div>
            ))}
          </Box>
        )}
      </ScrollArea>
      <Box p="sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
      <Box p="sm" style={{ marginTop: "auto" }}>
        <LLMProperties />
      </Box>
    </Box>
  );
};
