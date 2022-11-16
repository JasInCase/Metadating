import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { Avatar, FormControl, Icon, IconButton, InputAdornment, InputLabel, ListItem, ListItemAvatar, OutlinedInput, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageObject from '../CommonComponents/MessageObject';
import UserBadgeUpdated from '../CommonComponents/UserBadgeUpdated';
import { createTheme } from '@mui/material/styles';


const callMessageAPI = async (userMessage: string, messages: string[]) => {
    // const response = await axios.post('/api/v1/message/', {
    //     userMessage: userMessage
    // });
    let matchId = window.localStorage.getItem("matchId");
    let userId = window.localStorage.getItem("userId");
    const response = await axios.post('/api/v1/getmsg', {
        userMessage: userMessage,
        msgs: messages,
        matchId: matchId,
        userId: userId
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

    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [disableInput, setDisableInput] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

    const [startingMessages, setStartingMessages] = useState<string[]>([]);

    React.useEffect(() => {

        if (id) {
            getExistingMessages(id).then((messageArray : any) => {
                setMessages(messageArray);
            });
        }
        else {
            window.location.assign('/home');
        }

    }, [startingMessages]);

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

    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {

        if (disableInput) {
            return;
        }

        if (event) { // Stops the page from reloading on submit
            event.preventDefault();
        }

        if (userMessage === "") { // Prevents empty string send
            return;
        }

        setDisableInput(true);
        let messagesWithUserMessage = [...messages, userMessage];
        // console.log("Messages with user Message: ")
        // console.log(messagesWithUserMessage)
        setMessages(messagesWithUserMessage);

        callMessageAPI(userMessage, messagesWithUserMessage).then(apiResponse => {
            if (apiResponse.status === 200) {
                return apiResponse.data.apiMessage;
            } else {
                return "Error reaching api";
            }

        }).then(apiMessage => {
            setMessages([...messagesWithUserMessage, apiMessage]);
        });

        setDisableInput(false);
        setUserMessage("");
    };

    return (

        <div>
            <div className='p-5'>

                <UserBadgeUpdated/>

                <Container maxWidth="md" fixed={true} className="shadow-2xl rounded-3xl bg-pink-200">

                    <Typography className="pt-3 pb-1" variant="h3" component="h3" align="center"> Conversation Feed </Typography>

                    <List sx={{ width: '100%' }}>
                        
                        {messages.map((message: any, index: number) => (

                            <div key={index} className='m-10 rounded-3xl shadow-lg'>
                                <MessageObject message={message.message} is_user={message.is_user} />
                            </div>

                        ))}

                    </List>
                    
                    <div className='flex'>

                        <div className='pb-7 pt-3 pr-1 w-2/4'>

                            <form onSubmit={sendMessage}>

                                <FormControl fullWidth>
                                    <InputLabel htmlFor="message-input">Match's Message</InputLabel>
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
                                                    // onClick={sendMessage}
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
                            <form onSubmit={sendMessage}>
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
                                                    // onClick={sendMessage}
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
