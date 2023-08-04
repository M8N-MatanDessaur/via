import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';

import Links from "./JSON/Links.json";


export default function App() {
    // state for the user's input
    const [userInput, setUserInput] = useState("");
  
    // state for the conversation history
    const [chatHistory, setChatHistory] = useState([
      {
        role: "AI",
        text: "Bonjour, je suis VIA, votre assistant virtuel. Je suis là pour vous aider à trouver les informations dont vous avez besoin."
      }
    ]);
  
    // Fetches a response from the AI each time the user sends a message
    useEffect(() => {
      const fetchAIResponse = async () => {
        const userMessage = chatHistory[chatHistory.length - 1];
        
        if (userMessage && userMessage.role === "user") {
          const response = await axios.get(
            ".netlify/functions/aichat", 
            {
              params: {
                input: userMessage.text,
                history: chatHistory.map(message => `\n${message.role === "AI" ? "VIA" : "Agent de vente"}: ${message.text}`).join('')
              }
            }
          );
        
          if (response.status === 200) {
            setChatHistory([
              ...chatHistory,
              {
                role: "AI",
                text: response.data.output
              }
            ]);
          }
        }
      };
  
      fetchAIResponse();
    }, [chatHistory]);
  
    // Handles when the user sends a message
    const handleSend = () => {
      setChatHistory([
        ...chatHistory,
        {
          role: "user",
          text: userInput
        }
      ]);
  
      setUserInput("");
    };
  
    // Renders the conversation history
    const renderChatHistory = () => {
      return chatHistory.map((message, index) => (
        message.role === "AI" ? (
          <AIText key={index}>{message.text}</AIText>
        ) : (
          <UserText key={index}>{message.text}</UserText>
        )
      ));
    };

  return (
    <ViewContainer>
      <LeftContainer>
        <LogoContainer>
          <Logo>VIA</Logo>
        </LogoContainer>
        <BottomContainer>
          <SectionContainer>
            <SectionTitle>Liens Essentiels</SectionTitle>
            <Inner>
              <LinksContainer>
                {Links.map((link) => (
                  <Link href={link.url} target="_blank" rel="noreferrer">
                    {link.name}
                  </Link>
                ))}
              </LinksContainer>
            </Inner>
          </SectionContainer>
        </BottomContainer>
      </LeftContainer>
      <RightContainer>
        <SectionContainer>
          <SectionTitle>VIA</SectionTitle>
          <Inner>
            <ChatView>
            {renderChatHistory()}
            </ChatView>
            <UserInput>
            <ChatInput value={userInput} onChange={event => setUserInput(event.target.value)} />
              <SendButton onClick={handleSend}>
                <svg height="100%" width="100%" fill="#414141" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.85L12 12l-7.758 2.91-1.212 4.848a.998.998 0 0 0 1.396 1.147l17-8a1.001 1.001 0 0 0 0-1.81Z"></path>
                </svg>
              </SendButton>
            </UserInput>
          </Inner>
        </SectionContainer>
      </RightContainer>
    </ViewContainer>
  );
}

const ViewContainer = styled.div`
  height: 100dvh;
  width: 100vw;
  background-color: #1c1c1c;
  display: flex;
  gap: 25px;
  padding: 25px;
`;

const LeftContainer = styled.div`
  height: 100%;
  width: 35%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  height: 35%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 8rem;
  color: #ffda58;
`;

const BottomContainer = styled.div`
  height: 65%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

const RightContainer = styled.div`
  height: 100%;
  width: 65%;
  display: flex;
  flex-direction: column;
  justify-content: end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SectionContainer = styled.div`
  position: relative;
  height: 90%;
  border: 1px solid #ffda5880;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 15px;
`;

const SectionTitle = styled.h2`
position: absolute;
top: -46px;
left: -1px;
font-size: 1rem;
color: #fff;
padding: 10px 35px;
margin: 0;
border: 1px solid #ffda5880;
border-bottom: 1px solid #1c1c1c;
border-top-left-radius: 10px;
border-top-right-radius: 10px
`;

const Inner = styled.div` 
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid #414141A0;
  border-radius: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #1c1c1c;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffda5880;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ffda58;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Link = styled.a`
  border-bottom: 1px solid #414141A0;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #ffda58;
    background-color: #414141;
  }

  &:active {
    color: #ffda58;
  }

  &:first-child {
    border-top: 1px solid #414141A0;
  }
  `;

const UserInput = styled.div`
  position: absolute;
  bottom: 15px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
`;

const ChatInput = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid #414141;
  border-radius: 10px;
  padding: 0 15px;
  background-color: #1c1c1c;
  color: #fff;
  font-size: 1.2rem;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: #ffda58;
  }
`;

const SendButton = styled.button`
  height: 50px;
  width: 50px;
  border: 1px solid #414141;
  border-radius: 10px;
  background-color: #1c1c1c;
  color: #fff;
  font-size: 1.2rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  padding: 10px;

  &:hover {
    & svg {
      transform: scale(1.1);
      fill: #ffda58;
    }

    border-color: #ffda58;
  }

  &:active {
    & svg {
      transform: scale(0.9);
    }
  }
`;

const ChatView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  height: 87%;
  overflow-y: auto;
  box-shadow: inset 0 0 30px #00000050;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #1c1c1c;
  }

  &::-webkit-scrollbar-thumb {
    background: #ffda5880;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ffda58;
  }

`;

const AIText = styled.p`
  position: relative;
  width: fit-content;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffc90c50;
  color: #fff;
  font-size: 1.2rem;
  align-self: flex-start;
`;

const UserText = styled.p`
  position: relative;
  width: fit-content;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #35373a;
  color: #fff;
  font-size: 1.2rem;
  align-self: flex-end;
`;
