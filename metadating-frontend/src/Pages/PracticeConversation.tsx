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


const sendMessage = async (conversationId: string, message: string) => {
    const response = await axios.post(`/api/v1/practice-conversation/${conversationId}/message/`, {
        message: message,
        is_user: true,
    }, {
        headers: {
            // 'application/json' is the modern content-type for JSON, but some
            // older servers may use 'text/json'.
            'content-type': 'application/json'
        }
    });

    // return response.data.apiMessage;
    return response;
}

const getExistingMessages = async (id: string) => {
    // NEED TO WRITE GET REQUEST HERE

    const response = await axios.get(`/api/v1/practice-conversation/${id}/`,
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    );

    console.log("Practice Conversation Response:")
    console.log(response)
    // console.log(response.data.practiceConversation.messages)
    return {
        messages: response.data.practiceConversation.messages,
        matchName: response.data.matchName,
        index_of_practice_start: response.data.practiceConversation.number_of_messages_in_real_conversation
    }

    return {
        messages: [
            {
                text: "KING JULIAN! KING JULIAN!",
                is_user: true
            },
            {
                text: "What, Mort?",
                is_user: false
            },
            {
                text: "Can I touch your feeeeeeeeeet?",
                is_user: true
            },
            {
                text: "PLEEEEEEEASE?!!!",
                is_user: true
            },
            {
                text: "why am i friends with you",
                is_user: false
            }
        ],
        index_of_practice_start: 2
    };
}


const PracticeConversationPage = () => {

    type ConvoParams = {
        id: string;
    };
    const { id } = useParams<ConvoParams>();

    const [matchName, setMatchName] = useState("");
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string, is_user: boolean }[]>([]);
    const [firstPracticeIndex, setFirstPracticeIndex] = useState(-1);
    const [disableInput, setDisableInput] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {

        if (id) {
            getExistingMessages(id).then((response : any) => {
                setMatchName(response.matchName);
                setMessages(response.messages);
                setFirstPracticeIndex(response.index_of_practice_start);
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

    const submitUserMessage = (event: React.FormEvent<HTMLFormElement>) => {
        if (event) { // Stops the page from reloading on submit
            event.preventDefault();
        }

        if (disableInput) {
            return;
        }


        if (userMessage === "") { // Prevents empty string send
            return;
        }

        setDisableInput(true);
        const newMessage = {
            text: userMessage,
            is_user: true
        };

        let newMessageList = [...messages, newMessage];
        // console.log("Messages with user Message: ")
        // console.log(messagesWithUserMessage)
        setMessages(newMessageList);

        if (id) {
            sendMessage(id, newMessage.text).then(response => {
                console.log("Response:");
                console.log(response);
                if (response.status === 200) {
                    return response.data;
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(data => {
                const responseMessage = {
                    text: data.aiMessage,
                    is_user: false
                };
                newMessageList = [...newMessageList, responseMessage];
                setMessages(newMessageList);
                setDisableInput(false);
            })
            .catch(error => {
                console.error(error);
                setDisableInput(false);
            });
        }

        setUserMessage("");
    };


    return (

        <div>
            <div className='p-5'>

                <UserBadgeUpdated/>

                <Container maxWidth="md" fixed={true} className="shadow-2xl rounded-3xl bg-pink-200">

                    <Typography className="pt-3 pb-1" variant="h3" component="h3" align="center"> Practice Conversation Feed </Typography>
                    <Typography className="" variant="body1" component="h1" align="center">with {matchName}</Typography>

                    <List sx={{ width: '100%' }}>
                        
                        {messages.map((message: any, index: number) => (
                            <div key={index}>

                                {index === firstPracticeIndex && 
                                    <div className='m-1 rounded-3xl shadow-lg bg-black'>
                                        <ListItem className='bg-black-500'>
                                        </ListItem>
                                    </div>
                                }

                                <div key={index} className='m-10 rounded-3xl shadow-lg'>
                                    {/* {(index == firstPracticeIndex) & <hr></hr>} */}
                                    <MessageObject message={message.text} is_user={message.is_user} is_practice={index >= firstPracticeIndex} />
                                </div>

                            </div>
                        ))}

                    </List>
                    
                    <div className='flex'>

                        <div className='pb-7 pl-1 pt-3 w-full'>
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

export default PracticeConversationPage;
