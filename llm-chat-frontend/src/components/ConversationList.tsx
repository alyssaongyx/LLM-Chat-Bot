import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { List, Button, Text, Paper } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Conversation } from "../types/conversation";

const API_URL = "http://localhost:8000";

interface ConversationListProps {
  onSelectConversation: Dispatch<SetStateAction<Conversation | null>>;
  selectedConversation: Conversation | null;
}

export default function ConversationList({
  onSelectConversation,
  selectedConversation,
}: ConversationListProps) {
  const queryClient = useQueryClient();

  const {
    data: conversations,
    isLoading,
    isError,
  } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/conversations`);
      return response.data;
    },
  });

  const createConversation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${API_URL}/conversations`, {
        name: `New Conversation ${new Date().toLocaleString()}`,
      });
      return response.data;
    },
    onSuccess: (newConversation: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      onSelectConversation(newConversation);
    },
  });

  if (isLoading) return <Text>Loading conversations...</Text>;
  if (isError) return <Text>Error loading conversations</Text>;

  return (
    <>
      <Button onClick={() => createConversation.mutate()} fullWidth mb="md">
        New Conversation
      </Button>
      <List spacing="xs" size="sm" mb={12} center>
        {conversations?.map((conversation) => (
          <List.Item key={conversation.id}>
            <Paper
              p="xs"
              onClick={() => onSelectConversation(conversation)}
              style={(theme) => ({
                backgroundColor:
                  selectedConversation?.id === conversation.id
                    ? theme.colors.blue[1]
                    : "transparent",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              })}
            >
              {conversation.name}
            </Paper>
          </List.Item>
        ))}
      </List>
    </>
  );
}
