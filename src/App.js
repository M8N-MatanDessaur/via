import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from 'axios';

import Links from "./JSON/Links.json";


export default function App() {
  // state for the user's input
  const [userInput, setUserInput] = useState("");
  const chatEndRef = React.useRef(null);


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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Handles when the user sends a message
  const handleSend = () => {
    
    if (userInput.trim() === "") {
      return; 
    }
    else{

    setChatHistory([
      ...chatHistory,
      {
        role: "user",
        text: userInput
      }
    ]);
  }

    setUserInput("");
  };

  const openLinks = () => {
    window.open("https://clicplus.int.videotron.com/vui/#/", "_blank");
    window.open("https://csr.etiya.videotron.com/private/search", "_blank");
    window.open("https://ops.hub.videotron.com/FR/procedures/Pages/etiquettes-liste-de-prix-mobile.aspx", "_blank");
    window.open("https://app-videotron.beehivr.com/app-login", "_blank");
    window.open("https://conciliation.videotron.com/", "_blank");
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
          <svg fill="none" height="72" viewBox="0 0 72 72" width="72" xmlns="http://www.w3.org/2000/svg">
            <path class="fill-brand" d="m72 0h-72v72h72z"></path>
            <path fill="#000" d="m19.4496 18.4777 34.8306 17.3199-34.8725 17.7222 22.43-17.6687z"></path>

          </svg>
        </LogoContainer>
        <BottomContainer>
          <SectionContainer>
            <SectionTitle>Liens Essentiels</SectionTitle>
            <RapidAccess onClick={openLinks}>
              <svg fill="#1c1c1c" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m6 12 2-9h7.5L14 9h4L9 21l1.5-9H6Z"></path>
              </svg>
            </RapidAccess>
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
          <SectionTitle>Assistant VIA</SectionTitle>
          <Inner>
            <ChatView>
              {renderChatHistory()}
               <div ref={chatEndRef} />
            </ChatView>
            <UserInput>
              <ChatInput value={userInput} onChange={event => setUserInput(event.target.value)} onKeyPress={event => {
                if (event.key === 'Enter') {
                  handleSend();
                  event.preventDefault(); // Prevents the addition of a new line in the input on Enter
                }
              }} />
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

  @media (max-width: 500px) {
    padding: 0;
  }
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;

  & svg {
    margin-left: 10px;
    fill: #ffd200;
    border-radius: 50%;
  }

`;

const Logo = styled.h1`
  font-size: 8rem;
  color: #ffd200;
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
  background-color: #ffd200;
  border: 1px solid #ffd200;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 15px;

  @media (max-width: 500px) {
    height: 100%;
  }
`;

const SectionTitle = styled.h2`
position: absolute;
top: -44px;
left: -1px;
font-size: 1rem;
font-weight: 800;
color: #1c1c1c;
padding: 10px 35px;
margin: 0;
border: 1px solid #ffd200;
border-bottom: none;
background-color: #ffd200;
border-bottom: none;
border-top-left-radius: 10px;
border-top-right-radius: 10px
`;

const RapidAccess = styled.button`
  position: absolute;
  top: -44px;
  left: 200px;
  height: 46px;
  width: 46px;
  border: 1px solid #ffd200;
  border-bottom: none;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: #ffd200;
  color: #1c1c1c;
  font-size: 1.2rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  padding: 10px;

  &:hover {
    & svg {
      transform: scale(1.1);
      fill: #1c1c1c;
    }
  }

  &:active {
    & svg {
      transform: scale(0.9);
    }
  }
`;

const Inner = styled.div` 
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid #414141A0;
  background-color: #1c1c1c;
  border-radius: 10px;
  padding: 15px;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #1c1c1c;
  }

  &::-webkit-scrollbar-thumb {
    background: #5c5c5c;
    border-radius: 10px;
  }
`;

const Link = styled.a`
  border-bottom: 1px solid #414141A0;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #ffd200;
    background-color: #414141;
  }

  &:active {
    color: #ffd200;
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
    border-color: #ffd200;
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
      fill: #ffd200;
    }

    border-color: #ffd200;
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
    background: #ffd20080;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ffd200;
  }

`;

const AIText = styled.p`
  position: relative;
  width: fit-content;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: #ffd200;
  color: #1c1c1c;
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
