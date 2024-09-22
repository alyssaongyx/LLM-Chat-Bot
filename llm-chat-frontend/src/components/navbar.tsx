import React from "react";
import { Button, Group, Box, Title } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import styles from "../styles/navbar.module.css";

export const Navbar: React.FC = () => {
  return (
    <Box h={60} className={styles.navbar}>
      <Group className={styles.group}>
        <Title order={3} className={styles.title}>
          OpenAI Chatbot🤖
        </Title>
        <Button
          component="a"
          href="https://github.com/alyssaongyx/LLM-Chat-Bot"
          target="_blank"
          rel="noopener noreferrer"
          color="dark"
          leftSection={<IconBrandGithub />}
          className={styles.button}
        >
          Github
        </Button>
      </Group>
    </Box>
  );
};
