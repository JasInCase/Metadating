import React, { useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, styled } from '@mui/material';

export async function getMessageFromAPI() {

    // const response = await fetch ('/api/v1/hello/');
    // console.log(response);
    // return response.json;
    const response = await axios.get('/api/v1/hello/');
    // console.log(response);
    return response.data.string;

}

export async function sendLoginToAPI(username : string, password : string) {

    const response = await axios.post('/api/v1/accounts/', {
        username: username,
        password: password,
        operation: "login"
      }, { headers: {
          'content-type': 'application/json'
    }});

    return response;

}

export async function sendSignupToAPI(username: string, password : string) {

    const response = await axios.post('/api/v1/accounts/', {
        username: username,
        password: password,
        operation: "logout"
      }, { headers: {
          'content-type': 'application/json'
    }});

    return response;

}

export function onlySpaces(str : string) {

    return /^\s*$/.test(str);

}



const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [errorTextUsername, setErrorTextUsername] = useState("");
    const [errorTextPassword, setErrorTextPassword] = useState("");

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const enteredUsername = event.target.value;
        setUsername(enteredUsername);
        if (validUsername === false) {
            if (event.target.value != "") {
                setValidUsername(true);
                setErrorTextUsername("");
            }
        }

    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const enteredPassword = event.target.value;
        setPassword(enteredPassword);
        if (validPassword === false) {
            if (event.target.value != "") {
                setValidPassword(true);
                setErrorTextUsername("");
            }
        }


    }

    const submitLogIn = () => {

        if (username === "" || onlySpaces(username)) {
            setValidUsername(false);
            setErrorTextUsername("Please input a valid username.");
        }
        if (password === "" || onlySpaces(password)) {
            setValidPassword(false);
            setErrorTextPassword("Please input a valid password.");
        }
        if (!validUsername || !validPassword) {
            return;
        }

        sendLoginToAPI(username, password);


    }

    const submitSignUp = () => {

        if (username === "" || onlySpaces(username)) {
            setValidUsername(false);
            setErrorTextUsername("Please input a valid username.");
        }
        if (password === "" || onlySpaces(password)) {
            setValidPassword(false);
            setErrorTextPassword("Please input a valid password.");
        }
        if (!validUsername || !validPassword) {
            return;
        }

        sendSignupToAPI(username, password);


    }

    return (

        <div className='p-5'>

            <Container
                maxWidth="md"
                fixed={true}
                className="shadow-2xl rounded-3xl bg-purple-200">


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
                            error={!validUsername}
                            fullWidth
                            id="name"
                            label="Username"
                            value={username}
                            onChange={onUsernameChange}
                            placeholder="Username"
                            />
                            { !validUsername && <FormHelperText>
                                {errorTextUsername}
                            </FormHelperText>
                            }
                        </FormControl>


                    </div>

                    <div className="p-2">

                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="name"> Password </InputLabel>
                            <OutlinedInput
                            // className="input"
                            error={!validPassword}
                            fullWidth
                            id="name"
                            label="Password"
                            value={password}
                            onChange={onPasswordChange}
                            placeholder="Password"
                            />
                            { !validPassword && <FormHelperText>
                                {errorTextPassword}
                            </FormHelperText>
                            }
                        </FormControl>


                    </div>

                </div>

                <div className='pb-4'>
                    <Grid container spacing={0} direction="row" alignItems="center" justifyContent="center">

                        <Grid item xs={2} style={{textAlign: "center"}}>

                            <Button
                            onClick={submitLogIn}
                            variant="contained"
                            className="center"
                            >
                            Log In
                            </Button>

                        </Grid>
                        <Grid item xs={2} style={{textAlign: "center"}}>


                            <Button
                            onClick={submitSignUp}
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