"use client";

import { AppShell, Text, Button, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Conversation } from "../types/conversation";
import ConversationList from "../components/ConversationList";
import ChatArea from "../components/ChatArea";
import LLMProperties from "../components/LLMProperties";
import { useState } from "react";

export default function HomePage() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{
        height: 60,
      }}
    >
      <AppShell.Navbar p="xs">
        <ConversationList
          onSelectConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
      </AppShell.Navbar>

      <AppShell.Header>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            onClick={toggle}
            variant="subtle"
            size="sm"
            style={{ marginRight: "1rem" }}
          >
            {opened ? "Close" : "Menu"}
          </Button>
          <Text size="xl" fw={700}>
            LLM Chat Application
          </Text>
        </div>
      </AppShell.Header>

      <AppShell.Main>
        {selectedConversation ? (
          <>
            <ChatArea conversation={selectedConversation} />
            <LLMProperties conversation={selectedConversation} />
          </>
        ) : (
          <Text ta="center" size="xl" mt="xl">
            Select a conversation or create a new one to start chatting.
          </Text>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
