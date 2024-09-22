"use client";
import React from "react";
import { Chatbot } from "../components/chatbot";
import { Navbar } from "../components/navbar";
import "./globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Chatbot />
    </div>
  );
};

export default Home;
