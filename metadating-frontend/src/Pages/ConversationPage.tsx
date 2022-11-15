import React, { useRef, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { Avatar, FormControl, Icon, IconButton, InputAdornment, InputLabel, ListItem, ListItemAvatar, OutlinedInput, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import UserBadgeUpdated from '../CommonComponents/UserBadgeUpdated';
// import { setTimeout } from 'timers/promises';

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

const sendLogoutToAPI = async () => {
    const response = await axios.post('/api/v1/accounts/',
        {
            operation: "logout"
        },
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    );

    return response;
}

const ConversationPage = () => {

    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [disableInput, setDisableInput] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    // const messageRef = useRef(null);
    const [username, setUsername] = useState('');

    React.useEffect(() => { // display username in top right

        let name = window.localStorage.getItem("username");
        if (name !== null) {
            setUsername(name);
        }

    }, [username])

    const logout = () => {

        sendLogoutToAPI().then((response) => {

            window.localStorage.removeItem("username");
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("matchId")
            window.location.assign('/');

        });

    }

    React.useEffect(() => { // Scroll to the bottom of the page when new message appears
        if (messageRef != null) {
            if (messageRef.current != null) {
                messageRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [messages])

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

    // React.useEffect(() => {
    //     window.localStorage.setItem('messages', messages);
    // }, [messages]);


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

        /* if (messageRef != null) { // Scroll to the bottom of the page
            if (messageRef.current != null){
                messageRef.current.scrollIntoView({behavior: "auto"});
            }
        }*/
    };

    return (

        <div>
            <div className='p-5'>



                <UserBadgeUpdated/>

                <Container maxWidth="md" fixed={true} className="shadow-2xl rounded-3xl bg-pink-200">

                    <Typography className="pt-3 pb-1" variant="h3" component="h3" align="center"> Conversation Feed </Typography>

                    <List sx={{ width: '100%' }}>

                        {messages.map((message: string, index: number) => (

                            <div className='m-10 rounded-3xl shadow-lg'>

                                {index % 2 === 0 &&


                                    <ListItem onMouseOver={() => handleMouseOver(index)} onMouseOut={handleMouseOut} key={message} className="bg-blue-400 animate-ping-once rounded-3xl" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                        <Typography className="py-2" sx={{ maxWidth: '55%', wordWrap: 'break-word' }} > {message} </Typography>
                                        <ListItemAvatar className='m-2 hover:shadow-2xl'>
                                            <Avatar alt="user1" src="https://avatars.dicebear.com/api/male/boy3.svg" />
                                            {/* <Avatar alt="user1" src="https://avatars.dicebear.com/api/avataaars/b.svg"/> */}
                                        </ListItemAvatar>
                                        {isHovering && hoveringIndex == index && (
                                            <IconButton>
                                                <DeleteIcon></DeleteIcon>
                                            </IconButton>
                                        )}

                                    </ListItem>
                                }

                                {index % 2 === 1 &&


                                    <ListItem key={message} className="bg-slate-200 rounded-3xl animate-ping-once">
                                        <ListItemAvatar className='m-2 hover:shadow-2xl'>
                                            <Avatar alt="user2" src="https://avatars.dicebear.com/api/female/girl12.svg" />
                                            {/* <Avatar alt="user2" src="https://avatars.dicebear.com/api/avataaars/a.svg"/> */}
                                        </ListItemAvatar>
                                        <Typography className="py-2" sx={{ maxWidth: '55%', wordWrap: 'break-word' }} > {message} </Typography>
                                    </ListItem>
                                }

                            </div>

                        ))}

                    </List>

                    <div className='pb-7 pt-3'>

                        <form onSubmit={sendMessage}>

                            <FormControl fullWidth>
                                <InputLabel htmlFor="message-input">Message</InputLabel>
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

                </Container>

            </div>
            <div ref={messageRef}></div>
        </div>

    )
};

export default ConversationPage;
