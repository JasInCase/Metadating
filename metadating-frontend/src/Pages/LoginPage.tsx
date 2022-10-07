import React, { useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, FormControl, InputLabel, OutlinedInput, styled } from '@mui/material';

export async function getMessageFromAPI() {

    // const response = await fetch ('/api/v1/hello/');
    // console.log(response);
    // return response.json;
    const response = await axios.get('/api/v1/hello/');
    // console.log(response);
    return response.data.string;


}

const TailwindButton = styled(Button)({
    textTransform: 'none',
    fontSize: 16,
    padding: '13px 50px',
    backgroundColor: "white",
    color: "black",
    "&:hover": {
      backgroundColor: "rgb(191 219 254)",
      borderColor: "#0062cc",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });


const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const enteredUsername = event.target.value;
        setUsername(enteredUsername);

    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const enteredPassword = event.target.value;
        setPassword(enteredPassword);

    }

    return (

        <div className='p-5'>

            <Container
                maxWidth="md"
                fixed={true}
                className="shadow-2xl rounded-3xl bg-blue-200">


                <Typography
                    className="pt-3 pb-1"
                    variant="h3"
                    component="h3"
                    align="center"
                >
                    Login or Sign Up
                </Typography>

                <div className="pb-7 pt-3">

                    <div className="p-2">

                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="name"> Username </InputLabel>
                            <OutlinedInput
                            // className="input"
                            fullWidth
                            id="name"
                            label="Username"
                            value={username}
                            onChange={onUsernameChange}
                            placeholder="Username"
                            />
                        </FormControl>


                    </div>

                    <div className="p-2">

                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="name"> Password </InputLabel>
                            <OutlinedInput
                            // className="input"
                            fullWidth
                            id="name"
                            label="Password"
                            value={password}
                            onChange={onPasswordChange}
                            placeholder="Password"
                            />
                        </FormControl>


                    </div>

                </div>

                <div className='pb-4'>
                    <Grid container spacing={0} direction="row" alignItems="center" justifyContent="center">

                        <Grid item xs={2} style={{textAlign: "center"}}>

                            <Button
                            // onClick={submit}
                            variant="contained"
                            className="center"
                            >
                            Log In
                            </Button>

                        </Grid>
                        <Grid item xs={2} style={{textAlign: "center"}}>


                            <Button
                            // onClick={submit}
                            variant="contained"
                            className="center"
                            >
                            Sign Up
                            </Button>

                        </Grid>

                    </Grid>

                </div>

            </Container>

        </div>

    )
};

export default LoginPage;