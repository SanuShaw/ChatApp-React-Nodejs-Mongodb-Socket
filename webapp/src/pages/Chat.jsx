import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logout from "../components/Logout";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [newUnreadMsg, setnewUnreadMsg] = useState([]);


  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(async () => {
    if (currentUser) {
      socket.current = await io(host);
      socket.current.emit("add-user", currentUser._id);
      //when receive a message
      socket.current.on("msg-recieve", (msgData) => {
        console.log("msg come", msgData);
        setnewUnreadMsg((prev) => [...prev, msgData]);
      });
    }
  }, [currentUser]);

  console.log(newUnreadMsg);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange}
            newUnreadMsg={newUnreadMsg}
            setnewUnreadMsg={(data) => setnewUnreadMsg(data)}
          />
          <Logout />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket}
              newMsg={newUnreadMsg.filter(data => data.from == currentChat._id)}
              setnewUnreadMsg={() => setnewUnreadMsg(prevData => prevData.filter(data => data.from != currentChat?._id))}
            // setnewUnreadMsgWhenOpen={(data) => setnewUnreadMsg((prev) => [...prev, data])}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
