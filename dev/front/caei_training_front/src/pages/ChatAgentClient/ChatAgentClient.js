import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatBox from "../ChatBox/ChatBox";
import "./ChatAgentClient.css";
import "../Register/Register.css";

const socket = io("http://localhost:5000");

export default function ChatAgentClient() {
    const [userName, setUserName] = useState("");
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        const receiveMessage = (data) => {
            setMessageList((prev) => {
                if (!prev.some(msg => msg.author === data.author && msg.message === data.message && msg.time === data.time)) {
                    return [...prev, data];
                }
                return prev;
            });
        };

        socket.on("receive_message", receiveMessage);
    
        return () => socket.off("receive_message", receiveMessage);
    }, []);

    const joinRoom = () => {
        if (userName.trim() && room.trim()) {
            socket.emit("join room", { userName, room });
            setJoined(true);
        }
    };

    const sendMessage = () => {
        if (currentMessage.trim()) {
            const messageData = {
                room,
                author: userName,
                message: currentMessage,
                time: new Date().toLocaleTimeString(),
            };
            socket.emit("sending", messageData);
            setMessageList((prev) => [...prev, messageData]);
            setCurrentMessage("");
        }
    };

    return !joined ? (
        <div className="register-container">
            <div className="register-form-container">
                <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                    <h2 className="form-title">Join Chat Room</h2>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter room ID"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            required
                        />
                    </div>

                    <button onClick={joinRoom} className="btn btn-success">
                        Join Room
                    </button>
                </form>
            </div>
        </div>
    ) : (
        <ChatBox
            room={room}
            userName={userName}
            messageList={messageList}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
        />
    );
}
