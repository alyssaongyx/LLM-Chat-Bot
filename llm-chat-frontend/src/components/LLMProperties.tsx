import { useState } from "react";
import { Box, Text, NumberInput, Button } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Conversation } from "../types/conversation";

const API_URL = "http://localhost:8000";

interface LLMPropertiesProps {
  conversation: Conversation;
}

export default function LLMProperties({ conversation }: LLMPropertiesProps) {
  const [temperature, setTemperature] = useState(
    conversation.params.temperature || 0.7
  );
  const [maxTokens, setMaxTokens] = useState(
    conversation.params.max_tokens || 150
  );
  const queryClient = useQueryClient();

  const updateProperties = useMutation({
    mutationFn: async () => {
      const response = await axios.put(
        `${API_URL}/conversations/${conversation.id}`,
        {
          params: {
            temperature,
            max_tokens: maxTokens,
          },
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

  return (
    <Box>
      <Text size="lg" fw={700} mb="md">
        LLM Properties
      </Text>
      <NumberInput
        label="Temperature"
        value={temperature}
        onChange={(value) => setTemperature(Number(value))}
        min={0}
        max={1}
        step={0.1}
        decimalScale={1}
        fixedDecimalScale
      />
      <NumberInput
        label="Max Tokens"
        value={maxTokens}
        onChange={(value) => setMaxTokens(Number(value))}
        min={1}
        max={2048}
      />
      <Button onClick={() => updateProperties.mutate()} mt="md">
        Update Properties
      </Button>
    </Box>
  );
}
