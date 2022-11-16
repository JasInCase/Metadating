import React, { useState } from 'react'
import axios from 'axios'
import { Avatar, IconButton, ListItem, ListItemAvatar, Typography } from "@mui/material";


const MessageObject = (props: MessageData) => {
    
    const {message, is_user, is_practice} = props;

	return (
		
		<>
		{is_user &&

			<ListItem /*onMouseOver={() => handleMouseOver(index)} onMouseOut={handleMouseOut}*/ className={`${is_practice ? "bg-red-400" : "bg-blue-400"} animate-ping-once rounded-3xl`} style={{ display: 'flex', justifyContent: 'flex-end' }}>

				<Typography className="py-2" sx={{ maxWidth: '55%', wordWrap: 'break-word' }} > {message} </Typography>
				<ListItemAvatar className='m-2 hover:shadow-2xl'>
					<Avatar alt="user1" src="https://avatars.dicebear.com/api/male/boy3.svg" />
				</ListItemAvatar>
				{/* {isHovering && hoveringIndex == index && (
					<IconButton>
						<DeleteIcon></DeleteIcon>
					</IconButton>
				)} */}

			</ListItem>
		}

		{!is_user &&


			<ListItem key={message} className={`${is_practice ? "bg-green-400" : "bg-slate-200"} rounded-3xl animate-ping-once`}>
				<ListItemAvatar className='m-2 hover:shadow-2xl'>
					<Avatar alt="user2" src="https://avatars.dicebear.com/api/female/girl12.svg" />
				</ListItemAvatar>
				<Typography className="py-2" sx={{ maxWidth: '55%', wordWrap: 'break-word' }} > {message} </Typography>
			</ListItem>
		}
		</>

	)
}

MessageObject.defaultProps = {
	is_practice: false
}

export type MessageData = {
	message: string;
	is_user: boolean;
	is_practice: boolean;
};

export default MessageObject;