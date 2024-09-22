"use client";

import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import ConversationList from "../components/ConversationList";
import ChatArea from "../components/ChatArea";
import LLMProperties from "../components/LLMProperties";

export default function HomePage() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <ConversationList
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Text>LLM Chat Application</Text>
          </div>
        </Header>
      }
    >
      {selectedConversation ? (
        <>
          <ChatArea conversation={selectedConversation} />
          <LLMProperties conversation={selectedConversation} />
        </>
      ) : (
        <Text>
          Select a conversation or create a new one to start chatting.
        </Text>
      )}
    </AppShell>
  );
}
