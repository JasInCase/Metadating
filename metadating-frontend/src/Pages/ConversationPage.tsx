import React, { useState } from 'react'
import axios from 'axios'

const callMessageAPI = async (userMessage: string) => {
    const response = await axios.post('/api/v1/message/', {
        userMessage: userMessage
    });
    return response.data.apiMessage;
}

const ConversationPage = () => {
    
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const listMessages = messages.map(message => <p>{message}</p>)

    // This function is called when the user is typing changes
    const userMessageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUserMessage = event.target.value;
        setUserMessage(enteredUserMessage);
    };

    const sendMessage = () => {

        let messagesWithUserMessage = [...messages, userMessage];
        setMessages(messagesWithUserMessage);

        callMessageAPI(userMessage).then((apiMessage) => {
            if (apiMessage == "") {
                console.log("An error occurred when reaching the api");
                return "Error reaching api";
            } else {
                return apiMessage;
            }
    
            }).then((apiMessage) => {
                setMessages([...messagesWithUserMessage, apiMessage]);
            });
    };
    
    return (

        <div>
            <div>
            <h2>Conversation Page</h2>
                {listMessages}
                <input
                    value={userMessage}
                    onChange={userMessageInputHandler}
                    placeholder="Message"
                    className="input"
                />
                <button onClick={sendMessage}>
                    Send Message
                </button>
            </div>
        </div>

    )
};

export default ConversationPage;
