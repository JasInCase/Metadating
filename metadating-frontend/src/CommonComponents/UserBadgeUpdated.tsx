import React, { useState } from 'react'
import axios from 'axios'
import { Avatar, Typography } from "@mui/material";


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


const UserBadgeUpdated = () => {

    const [username, setUsername] = useState('');

	React.useEffect(() => { // display username in top right
        
        let name = window.localStorage.getItem("username");
        if (name !== null) {
            setUsername(name);
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



	return (

        <div className='user-icon-container group'>

           <UsernameIcon username={username} logout={logout}></UsernameIcon>

        </div>
	)


}

type IconProps = {

    // url: string,
    username: string,
    logout: () => void,

}

const UsernameIcon = ({username, logout}  : IconProps) => {

    return (

        <div className='user-icon group'>
            {/* <Avatar alt={IconProps.username} src={IconProps.url} /> */}
            {/* <img className="m-1" src={url}></img> */}
            <Typography
                variant="h6"
                align="center">
                {username.charAt(0).toUpperCase()}
            </Typography>

            <span className="user-tooltip group-hover:delay-[0ms] 
                group-hover:scale-100">
                Hello <span className='text-black'>{username}</span>!
            </span>

            <div className="logout-button group-hover:delay-[0ms] 
                group-hover:scale-100 hover:bg-red-700 hover:delay-100 hover:text-white">
                <button
                    onClick={logout}>
                    Logout
                </button>
            </div>
        
        </div>

    )

}

export default UserBadgeUpdated;