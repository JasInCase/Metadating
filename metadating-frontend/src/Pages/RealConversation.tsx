import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { Avatar, FormControl, Icon, IconButton, InputAdornment, InputLabel, ListItem, ListItemAvatar, OutlinedInput, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageObject, { MessageData } from '../CommonComponents/MessageObject';
import UserBadgeUpdated from '../CommonComponents/UserBadgeUpdated';
import { createTheme } from '@mui/material/styles';


const sendMessage = async (conversationId: string, message: string, isUser: boolean) => {
    const response = await axios.post(`/api/v1/real-conversation/${conversationId}/message/`, {
        message: message,
        is_user: isUser,
    }, {
        headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            'content-type': 'application/json'
        }
    });

    return response;
}

const getExistingMessages = async (id: string) => {

    
    const response = await axios.get(`/api/v1/real-conversation/${id}/`,
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    );

    console.log("Real Conversation Response:")
    console.log(response)

    // return response.data.realConversation.messages;
    return response.data;

    // Something like this when the backend is rdy
    // toReturn = response.data.messages;
    // return toReturn;

    
    return [
        {
            message: "hello there",
            is_user: true
        },
        {
            message: "general kenobi",
            is_user: false
        },
        {
            message: "*cough cough*",
            is_user: false
        }
    ];
}


const RealConversationPage = () => {

    type ConvoParams = {
        id: string;
    };
    const { id } = useParams<ConvoParams>();

    const [matchName, setMatchName] = useState("");
    const [userMessage, setUserMessage] = useState("");
    const [matchMessage, setMatchMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string, is_user: boolean }[]>([]);
    const [disableInput, setDisableInput] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

    // Get existing messages
    React.useEffect(() => {

        if (id) {
            getExistingMessages(id).then((messageArray : any) => {
                setMatchName(messageArray.matchName)
                if (messageArray.realConversation.messages !== null) {
                    setMessages(messageArray.realConversation.messages);
                }
            });
        }
        else {
            window.location.assign('/home');
        }

    }, [id]);

    React.useEffect(() => { // Scroll to the bottom of the page when new message appears
        if (messageRef != null) {
            if (messageRef.current != null) {
                messageRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages]);

    // Delete messages button appears on hover
    const [isHovering, setIsHovering] = useState(false);
    const [hoveringIndex, setHoveringIndex] = useState(1);

    const handleMouseOver = (index: number) => {
        setIsHovering(true);
        setHoveringIndex(index)
    };

    const handleMouseOut = () => {
        setIsHovering(false);
        setHoveringIndex(1)
    };

    const userMessageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUserMessage = event.target.value;
        setUserMessage(enteredUserMessage);
    };

    const matchMessageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUserMessage = event.target.value;
        setMatchMessage(enteredUserMessage);
    };

    const submitMessage = (is_user: boolean) => {

        if (disableInput) {
            return;
        }


        if ((is_user && userMessage === "") || (!is_user && matchMessage === "")) { // Prevents empty string send
            return;
        }

        setDisableInput(true);
        const newMessage = {
            text: is_user ? userMessage : matchMessage,
            is_user: is_user
        };

        const newMessageList = [...messages, newMessage];
        // console.log("Messages with user Message: ")
        // console.log(messagesWithUserMessage)
        setMessages(newMessageList);

        if (id) {
            sendMessage(id, newMessage.text, newMessage.is_user).then(apiResponse => {
                if (apiResponse.status === 200) {
                    return apiResponse.data.apiMessage;
                } else {
                    return "Error reaching api";
                }

            });
        }

        setDisableInput(false);
        is_user ? setUserMessage("") : setMatchMessage("");
    };

    const submitUserMessage = (event: React.FormEvent<HTMLFormElement>) => {
        if (event) { // Stops the page from reloading on submit
            event.preventDefault();
        }

        submitMessage(true);
    };

    const submitMatchMessage = (event: React.FormEvent<HTMLFormElement>) => {
        if (event) { // Stops the page from reloading on submit
            event.preventDefault();
        }

        submitMessage(false);
    };

    return (

        <div>
            <div className='p-5'>

                <UserBadgeUpdated/>

                <Container maxWidth="md" fixed={true} className="shadow-2xl rounded-3xl bg-pink-200">

                    <Typography className="pt-3 pb-1" variant="h3" component="h3" align="center"> Real Conversation Feed </Typography>
                    <Typography className="" variant="body1" component="h1" align="center">with {matchName}</Typography>

                    <List sx={{ width: '100%' }}>
                        
                        {messages.map((message: any, index: number) => (

                            <div key={index} className='m-10 rounded-3xl shadow-lg'>
                                <MessageObject message={message.text} is_user={message.is_user} />
                            </div>

                        ))}

                    </List>
                    
                    <div className='flex'>

                        <div className='pb-7 pt-3 pr-1 w-2/4'>

                            <form onSubmit={submitMatchMessage}>

                                <FormControl fullWidth>
                                    <InputLabel htmlFor="message-input">Match's Message</InputLabel>
                                    <OutlinedInput className='input'
                                        id="message-input"
                                        fullWidth
                                        label="Message"
                                        value={matchMessage}
                                        onChange={matchMessageInputHandler}
                                        // disabled={true}
                                        disabled={disableInput}
                                        // placeholder="Send a message"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    type='submit'
                                                    // onClick={submitMessage}
                                                    hidden={userMessage === ""}
                                                    // disabled={userMessage === ""}
                                                    edge="end"
                                                // ref={messageRef}
                                                >
                                                    <SendIcon style={{ color: 'white' }}></SendIcon>
                                                </IconButton>
                                            </InputAdornment>
                                        } />

                                </FormControl>
                            </form>
                        </div>
                        <div className='pb-7 pl-1 pt-3 w-2/4'>
                            <form onSubmit={submitUserMessage}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="message-input">Your Message</InputLabel>
                                    <OutlinedInput className='input'
                                        id="message-input"
                                        fullWidth
                                        label="Message"
                                        value={userMessage}
                                        onChange={userMessageInputHandler}
                                        // disabled={true}
                                        disabled={disableInput}
                                        // placeholder="Send a message"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    type='submit'
                                                    // onClick={submitMessage}
                                                    hidden={userMessage === ""}
                                                    // disabled={userMessage === ""}
                                                    edge="end"
                                                // ref={messageRef}
                                                >
                                                    <SendIcon color="primary"></SendIcon>
                                                </IconButton>
                                            </InputAdornment>
                                        } />

                                </FormControl>
                            </form>
                        </div>
                    </div>

                </Container>

            </div>
            <div ref={messageRef}></div>
        </div>

    )
};

export default RealConversationPage;
