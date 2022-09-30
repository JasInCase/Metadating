import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import { Avatar, ListItem, ListItemAvatar, Typography } from '@mui/material';
// import '../index.css';

const callMessageAPI = async (userMessage: string) => {
    const response = await axios.post('/api/v1/message/', {
        userMessage: userMessage
    });
    return response.data.apiMessage;
}

const ConversationPage = () => {
    
    const [userMessage, setUserMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    // const listMessages = messages.map(message => <p>{message}</p>)

    // This function is called when the user is typing changes
    const userMessageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUserMessage = event.target.value;
        setUserMessage(enteredUserMessage);
    };

    const sendMessage = () => {

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
    };
    
    return (

        <div>
            <div>
                <Container maxWidth="md" fixed={true} >

                    <Typography variant="h3" component="h3" align="center"> Conversation Feed </Typography>
                    
                    <List sx={{ width : '100%'}}>

                        { messages.map((message: string, index : number) => (
                        
                            <div className='outline-1 outline m-10 rounded-3xl'>

                                {index % 2 === 0 && 


                                    <ListItem className="bg-blue-200 rounded-3xl" style={{display:'flex', justifyContent:'flex-end'}}>
                                        <Typography> {message} </Typography>
                                        <ListItemAvatar className='m-2'>
                                            <Avatar alt="user1" src="https://avatars.dicebear.com/api/male/boy3.svg"/>
                                        </ListItemAvatar>
                                    </ListItem>
                                }

                                {index % 2 === 1 && 


                                    <ListItem className="bg-pink-200 rounded-3xl">
                                        <ListItemAvatar className='m-2'>
                                            <Avatar alt="user2" src="https://avatars.dicebear.com/api/female/girl12.svg"/>
                                        </ListItemAvatar>
                                        <Typography> {message} </Typography>
                                    </ListItem>
                                }

                            </div>

                        ))}

                    </List>
                    
                    <input
                        value={userMessage}
                        onChange={userMessageInputHandler}
                        placeholder="Message"
                        className="input" 
                        />

                    <button onClick={sendMessage}>
                        Send Message
                    </button>

                </Container>
                
            </div>
        </div>

    )
};

export default ConversationPage;
