import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatBox from "../ChatBox/ChatBox";

const socket = io("http://localhost:5000");

export default function Agent() {
    const [clients, setClients] = useState({});
    const [room, setRoom] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        socket.emit("join as agent");

        const updateClients = (data) => {
            const activeRooms = Object.fromEntries(
                Object.entries(data).filter(([_, users]) => users.length > 0)
            );
            setClients(activeRooms);
        };

        const handleClientLeft = (roomId) => {
            setClients((prevClients) => {
                const updatedClients = { ...prevClients };
                delete updatedClients[roomId];
                return updatedClients;
            });
        };

        const receiveMessage = (data) => {
            setMessageList((prev) => {
                if (!prev.some(msg => msg.author === data.author && msg.message === data.message && msg.time === data.time)) {
                    return [...prev, data];
                }
                return prev;
            });
        };

        socket.on("update_clients", updateClients);
        socket.on("client_left", handleClientLeft);
        socket.on("receive_message", receiveMessage);

        return () => {
            socket.off("update_clients", updateClients);
            socket.off("client_left", handleClientLeft);
            socket.off("receive_message", receiveMessage);
        };
    }, []);

    const joinRoomAsAgent = (room) => {
        socket.emit("join room", { userName: "Agent", room });
        setRoom(room);
    };

    const sendMessage = () => {
        if (currentMessage.trim()) {
            const messageData = {
                room,
                author: "Agent",
                message: currentMessage,
                time: new Date().toLocaleTimeString(),
            };
            socket.emit("sending", messageData);
            setMessageList((prev) => [...prev, messageData]);
            setCurrentMessage("");
        }
    };

    return (
        <div className="container mt-4">
            {room ? (
                <ChatBox
                    room={room}
                    userName="Agent"
                    messageList={messageList}
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    sendMessage={sendMessage}
                />
            ) : (
                <div className="list-group mt-3">
                    {Object.entries(clients).map(([room, users]) => (
                        <div key={room} className="card p-3 mb-3">
                            <h5>Room: {room}</h5>
                            {users.map((user, index) => (
                                <button
                                    key={index}
                                    className="btn btn-success mt-2"
                                    onClick={() => joinRoomAsAgent(room)}
                                >
                                    Join {user.userName}'s Chat
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
