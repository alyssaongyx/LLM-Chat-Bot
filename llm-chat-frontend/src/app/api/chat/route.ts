import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";

export async function POST(req: NextRequest) {
  try {
    const { prompt, conversationId } = await req.json();

    let response;
    if (conversationId) {
      // If we have a conversation ID, send the prompt to the existing conversation
      response = await axios.post(`${API_URL}/queries?id=${conversationId}`, {
        role: "user",
        content: prompt,
      });
    } else {
      // If no conversation ID, create a new conversation
      const newConversation = await axios.post(`${API_URL}/conversations`, {
        name: "New Conversation",
        messages: [],
        params: {},
      });
      const newConversationId = newConversation.data.id;

      // Then send the prompt to this new conversation
      response = await axios.post(
        `${API_URL}/queries?id=${newConversationId}`,
        {
          role: "user",
          content: prompt,
        }
      );
    }

    if (response.status === 429) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }

    if (response.status !== 201) {
      throw new Error(`Error: ${response.status}`);
    }

    // Fetch the updated conversation to get the AI's response
    const updatedConversation = await axios.get(
      `${API_URL}/conversations/${response.data.id}`
    );
    const aiResponse = updatedConversation.data.messages.slice(-1)[0].content;

    return NextResponse.json({
      response: aiResponse,
      conversationId: response.data.id,
    });
  } catch (error) {
    console.error("Error fetching the API response.", error);
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
