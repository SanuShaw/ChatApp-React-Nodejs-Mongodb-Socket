import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat, newUnreadMsg, setnewUnreadMsg }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  const changeCurrentChat = async (index, contact) => {
    const openNewChatflag = currentSelected != index;
    await setCurrentSelected(openNewChatflag ? index : undefined);
    changeChat(openNewChatflag ? contact : undefined);
    //updated unread chat arr
    if (openNewChatflag) {
      setnewUnreadMsg(await newUnreadMsg.filter(data => data.from != contact._id));
    }
  };
  console.log("currentSelected: ", currentSelected);
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              let newMsgCount = newUnreadMsg?.filter(data => data.from == contact._id)?.length
              // console.log(contact.onlineStatus);
              return (
                <div key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="contactinfo">
                    <div className="avatar">
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt=""
                      />
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    </div>
                    {newMsgCount > 0 && <p>{newMsgCount}</p>}
                  </div>
                  {contact.onlineStatus && <div className="online">online</div>}
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      justify-content:space-between;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .contactinfo{
        display: flex;
        align-items: center;
        justify-content:center;
        gap: 1rem;
        font-size: initial;
        .avatar {
          img {
            height: 3rem;
          }
        }
        .username {
          h3 {
            color: white;
          }
        }
        p{
          background-color: #9a86f3;
          padding: 2px 5px;
          border-radius: 28%;
          color: white;
          min-width: 15px;
          font-size: 1.2rem;
        }
      }
      .online{
        color:#88e088;
        font-size:1rem;     
        margin-top: auto;
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
