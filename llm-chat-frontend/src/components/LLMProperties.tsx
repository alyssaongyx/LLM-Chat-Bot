import React, { useState } from "react";
import {
  Box,
  Text,
  Select,
  NumberInput,
  Button,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface LLMProperties {
  model: string;
  temperature: number;
  maxTokens: number;
}

const LLMProperties: React.FC = () => {
  const queryClient = useQueryClient();
  const [properties, setProperties] = useState<LLMProperties>({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
  });

  const { data: llmProperties, isLoading } = useQuery<LLMProperties>({
    queryKey: ["llmProperties"],
    queryFn: async () => {
      const response = await fetch("/api/llm-properties");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const updatePropertiesMutation = useMutation<
    void,
    Error,
    Partial<LLMProperties>
  >({
    mutationFn: async (newProperties) => {
      const response = await fetch("/api/llm-properties", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProperties),
      });
      if (!response.ok) {
        throw new Error("Failed to update properties");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["llmProperties"] });
    },
  });

  const updateProperties = (newProperties: Partial<LLMProperties>) => {
    updatePropertiesMutation.mutate(newProperties);
  };

  const handleUpdate = () => {
    updatePropertiesMutation.mutate(properties);
  };

  if (isLoading) return <Text>Loading LLM properties...</Text>;

  return (
    <Accordion>
      <Accordion.Item value="llm-properties">
        <Accordion.Control>
          <Text fw={500}>Update LLM Properties</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Box>
            <Select
              label="Model"
              value={properties.model}
              onChange={(value) =>
                setProperties({
                  ...properties,
                  model: value || "gpt-3.5-turbo",
                })
              }
              data={[
                { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
                { value: "gpt-4", label: "GPT-4" },
              ]}
              mb="sm"
            />
            <NumberInput
              label="Temperature"
              value={llmProperties?.temperature || 0}
              onChange={(value) =>
                updateProperties({ temperature: Number(value) })
              }
              min={0}
              max={1}
              step={0.1}
              mb="sm"
            />
            <NumberInput
              label="Max Tokens"
              value={properties.maxTokens}
              onChange={(value) =>
                setProperties({ ...properties, maxTokens: Number(value) || 0 })
              }
              min={1}
              max={2048}
              mb="md"
            />
            <Button
              onClick={handleUpdate}
              loading={updatePropertiesMutation.isPending}
            >
              Update Properties
            </Button>
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default LLMProperties;
