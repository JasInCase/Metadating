import React, { useRef, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { Avatar, FormControl, IconButton, InputAdornment, InputLabel, ListItem, ListItemAvatar, OutlinedInput, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const callMessageAPI = async (userMessage: string) => {
    const response = await axios.post('/api/v1/message/', {
        userMessage: userMessage
    });
    return response.data.apiMessage;
}

const ConversationPage = () => {
    
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    // const messageRef = useRef(null);
    // const listMessages = messages.map(message => <p>{message}</p>)

    // This function is called when the user is typing changes
    const userMessageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUserMessage = event.target.value;
        setUserMessage(enteredUserMessage);
    };

    const sendMessage = (event : React.FormEvent<HTMLFormElement>) => {
        if (event) { // Stops the page from reloading on submit
            event.preventDefault(); 
        }

        if (userMessage === "") { // Prevents empty string send
            return
        }
        
        let messagesWithUserMessage = [...messages, userMessage];
        setMessages(messagesWithUserMessage);

        callMessageAPI(userMessage).then((apiMessage) => {
            if (apiMessage === "") {
                console.log("An error occurred when reaching the api");
                return "Error reaching api";
            } else {
                return apiMessage;
            }
    
            }).then((apiMessage) => {
                setMessages([...messagesWithUserMessage, apiMessage]);
            });
            
            setUserMessage("");
            // if (messageRef != null) {
            //     messageRef.current!.scrollIntoView({behavior: 'smooth'});
            // }
    };
    
    return (

        <div>
            <div className='p-5'>

                <Container maxWidth="md" fixed={true} className="shadow-2xl rounded-3xl bg-pink-200">

                    <Typography className="pt-3 pb-1" variant="h3" component="h3" align="center"> Conversation Feed </Typography>
                    
                    <List sx={{ width : '100%'}}>

                        { messages.map((message: string, index : number) => (
                        
                            <div className='m-10 rounded-3xl shadow-lg'>

                                {index % 2 === 0 && 


                                    <ListItem className="bg-blue-400 rounded-3xl" style={{display:'flex', justifyContent:'flex-end'}}>
                                        
                                        <Typography className="py-2" sx={{maxWidth: '55%', wordWrap:'break-word' }} > {message} </Typography> 
                                        <ListItemAvatar className='m-2 hover:shadow-2xl'>
                                            <Avatar alt="user1" src="https://avatars.dicebear.com/api/male/boy3.svg"/>
                                        </ListItemAvatar>

                                    </ListItem>
                                }

                                {index % 2 === 1 && 


                                    <ListItem className="bg-slate-200 rounded-3xl">
                                        <ListItemAvatar className='m-2 hover:shadow-2xl'>
                                            <Avatar alt="user2" src="https://avatars.dicebear.com/api/female/girl12.svg"/>
                                        </ListItemAvatar>
                                        <Typography className="py-2" sx={{maxWidth: '55%', wordWrap:'break-word' }} > {message} </Typography>
                                    </ListItem>
                                }

                            </div>

                        ))}

                    </List>

                        <div className='pb-7 pt-3'>

                            <form onSubmit={sendMessage}>

                                <FormControl fullWidth>
                                    {/* <InputLabel htmlFor="component-outlined">Name</InputLabel> */}
                                    <InputLabel htmlFor="message-input">Message</InputLabel>
                                    <OutlinedInput className='input' 
                                    id="message-input"
                                    fullWidth
                                    label="Message"
                                    value={userMessage}
                                    onChange={userMessageInputHandler}
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
                                        >
                                        <SendIcon color="primary"></SendIcon>
                                        </IconButton>
                                        </InputAdornment>
                                    }/>

                                </FormControl>
                            </form>
                        </div>
                        {/* <div ref={messageRef}></div> */}

                        {/* <input
                            value={userMessage}
                            onChange={userMessageInputHandler}
                            placeholder="Message"
                            className="input" 
                            />

                        <button onClick={sendMessage}>
                            Send Message
                        </button> */}

                </Container>
                
            </div>
        </div>

    )
};

export default ConversationPage;
