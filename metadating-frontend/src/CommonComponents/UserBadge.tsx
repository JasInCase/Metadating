import React, { useState } from 'react'
import axios from 'axios'
import { Typography } from "@mui/material";


const sendLogoutToAPI = async () => {
    const response = await axios.post('/api/v1/accounts/',
        {
            operation: "logout"
        },
        { headers: {
            'content-type': 'application/json'
        }}
    );

    return response;
}


const UserBadge = () => {
    const [logoutMessage, setLogoutMessage] = useState('');
    const [username, setUsername] = useState('');

	React.useEffect(() => { // display username in top right
        
        let name = window.localStorage.getItem("username");
        if (name !== null) {
            setUsername(name);
            setLogoutMessage("Hello " + name);
        }

    }, [username])

    const logout = () => {

        sendLogoutToAPI().then(() => {

            window.localStorage.removeItem("username");
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("matchId")
            window.location.assign('/'); 

        });

    }

	const hoverLogout = () => {
        setLogoutMessage("LOGOUT");
    };
    const nonHoverLogout = () => {
        setLogoutMessage("Hello " + username);
    };

	return (
		<div className='fixed top-0 right-0 p-2 pr-3 border-l-2 border-pink-400 border-b-2 hover:cursor-pointer'
			onClick={logout}
			onMouseEnter={hoverLogout}
			onMouseLeave={nonHoverLogout}>

			<Typography>
				<span className='text-pink-500'>{logoutMessage}</span>
			</Typography>

        </div>
	)
}

export default UserBadge;