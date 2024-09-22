import React, { useState } from "react";
import {
  Box,
  ScrollArea,
  Title,
  Text,
  Anchor,
  Center,
  Flex,
} from "@mantine/core";
import { ChatInput } from "./input";
import { Message } from "./message";
import styles from "../styles/chatbot.module.css";
import { Logo } from "./logo"; // Import the new Logo component

const API_URL = "/api/chat";

interface MessageType {
  message: string;
  sender: string;
  loading?: boolean;
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const fetchResponse = async (prompt: string) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, conversationId }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment before trying again."
          );
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setConversationId(data.conversationId);
      return data.response;
    } catch (error) {
      console.error("Error fetching the API response.", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage = { message, sender: "user" };
    setMessages([
      ...messages,
      userMessage,
      { message: "", sender: "bot", loading: true },
    ]);
    setIsLoading(true);

    const botResponse = await fetchResponse(message);

    setMessages((prev) =>
      prev.map((msg, index) =>
        index === prev.length - 1
          ? { message: botResponse, sender: "bot", loading: false }
          : msg
      )
    );
    setIsLoading(false);
  };

  return (
    <Box className={styles.chatbot}>
      <ScrollArea className={styles.messages}>
        {messages.length === 0 ? (
          <Center style={{ height: "70vh" }}>
            <Flex justify="center" align="center" direction="column">
              <Logo width={200} height={80} />{" "}
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
            {messages.map((msg, index) => (
              <div key={index} className={styles.messageContainer}>
                <Message
                  message={msg.message}
                  sender={msg.sender}
                  isLoading={(msg.loading && isLoading) || false}
                />
              </div>
            ))}
          </Box>
        )}
      </ScrollArea>
      <Box p="sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </Box>
  );
};
