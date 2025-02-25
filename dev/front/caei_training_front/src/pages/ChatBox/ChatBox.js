import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import './ChatBox.css'

export default function ChatBox({ room, userName, messageList, currentMessage, setCurrentMessage, sendMessage }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    return (
        <div className="chat-container">
            <div className="chat-header">Room: {room}</div>
            <div className="chat-box">
                {messageList.map((messageContent, index) => (
                    <div
                        key={index}
                        className={`message ${messageContent.author === userName ? "my-message" : "other-message"}`}
                    >
                        <div className="message-header">
                            <strong>{messageContent.author}</strong> <span>{messageContent.time}</span>
                        </div>
                        <div className="message-body">{messageContent.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    className="input-field"
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <div className="button-group">
                <button className=" btn btn-success" onClick={sendMessage}>
                    <Send size={20} strokeWidth={2} />
                </button>
                </div>

            </div>
        </div>
    );
}
