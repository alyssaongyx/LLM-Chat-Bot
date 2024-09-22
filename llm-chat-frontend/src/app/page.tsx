"use client";
import React from "react";
import { Chatbot } from "../components/chatbot";
import { Navbar } from "../components/navbar";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Home: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar />
        <Chatbot />
      </div>
    </QueryClientProvider>
  );
};

export default Home;
