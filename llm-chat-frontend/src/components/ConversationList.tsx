import { useState, useEffect } from "react";
import { List, Button, Text } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8000";

interface Conversation {
  id: string;
  name: string;
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  if (isLoading) return <Text>Loading conversations...</Text>;
  if (isError) return <Text>Error loading conversations</Text>;

  return (
    <>
      <Button onClick={() => createConversation.mutate()}>
        New Conversation
      </Button>
      <List spacing="xs" size="sm" mb={12} center>
        {conversations?.map((conversation) => (
          <List.Item
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            style={{
              cursor: "pointer",
              backgroundColor:
                selectedConversation?.id === conversation.id
                  ? "#f0f0f0"
                  : "transparent",
            }}
          >
            {conversation.name}
          </List.Item>
        ))}
      </List>
    </>
  );
}
