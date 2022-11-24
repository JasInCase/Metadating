import React, { useState } from 'react'
import axios from 'axios'
import { Avatar, Typography } from "@mui/material";

const UsernameIcon = (name: string) => {

    return (

        <div className='user-icon group'>
            {/* <Avatar alt={IconProps.username} src={IconProps.url} /> */}
            {/* <img className="m-1" src={url}></img> */}
            <Typography
                variant="h6"
                align="center">
                {name.charAt(0).toUpperCase()}
            </Typography>
        
        </div>

    )

}

export default UsernameIcon;
