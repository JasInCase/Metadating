import React, { useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  IconButton,
  styled,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from "@mui/icons-material/Twitter";
import CompanyTag from "../CommonComponents/CompanyTag";
import MetadatingHeader from "../CommonComponents/MetadatingHeader";

export async function getMessageFromAPI() {
    const response = await axios.get('/api/v1/hello/');

    return response.data.string;
}


const sendLoginToAPI = async (username: string, password: string) => {
    const response = await axios.post('/api/v1/accounts/',
        {
            username: username,
            password: password,
            operation: "login"
        },
        {
            headers: {
                'content-type': 'application/json',
            }
        }
    );

    return response;
}

const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [errorTextUsername, setErrorTextUsername] = useState('');
    const [errorTextPassword, setErrorTextPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredUsername = event.target.value;
        setUsername(enteredUsername);

        // Validate input
        if (!validUsername && event.target.value !== '') {
            setValidUsername(true);
            setErrorTextUsername('');
        }
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredPassword = event.target.value;
        setPassword(enteredPassword);

        // Validate input
        if (!validPassword && event.target.value !== '') {
            setValidPassword(true);
            setErrorTextUsername('');
        }
    }

    const submitLogIn = (event: any) => {
        if (event) {
            event.preventDefault();
        }

        // Check for empty fields
        let emptyFields = false;
        if (!username || !username.trim()) {
            setValidUsername(false);
            setErrorTextUsername('Please input a valid username.');
            emptyFields = true;
        }
        if (!password || !password.trim()) {
            setValidPassword(false);
            setErrorTextPassword('Please input a valid password.');
            emptyFields = true;
        }
        if (emptyFields) {
            return;
        }

        // Show loading icon and check login
        setIsLoading(true);

        sendLoginToAPI(username, password).then((res) => {
            // console.log(res)
            window.localStorage.setItem("username", res.data.username);
            window.localStorage.setItem("userId", res.data.userId);
            window.location.assign('/home');

        })
            .catch(err => {
                setInvalidCredentials(true);
                setIsLoading(false);
                console.error(err);
            });
    }

    const navigateToSignUpPage = () => {
        window.location.assign('/signup');
    }

    return (
      <div className="p-5">
        <Container
          maxWidth="md"
          fixed={true}
          className="shadow-2xl rounded-3xl bg-purple-200"
        >
          <MetadatingHeader prefixText="Log in to" />

          <div className="pt-3 pb-2">
            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="username"> Username </InputLabel>
                <OutlinedInput
                  error={!validUsername}
                  fullWidth
                  id="username"
                  label="Username"
                  value={username}
                  onChange={onUsernameChange}
                />
                {!validUsername && (
                  <FormHelperText>{errorTextUsername}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="p-2">
              <form onSubmit={submitLogIn}>
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="name"> Password </InputLabel>
                  <OutlinedInput
                    error={!validPassword}
                    fullWidth
                    id="name"
                    type="password"
                    label="Password"
                    autoComplete="on"
                    value={password}
                    onChange={onPasswordChange}
                  />
                  {!validPassword && (
                    <FormHelperText>{errorTextPassword}</FormHelperText>
                  )}
                </FormControl>
              </form>
            </div>

            {invalidCredentials && (
              <div className="p-2">
                <Alert severity="error" variant="filled">
                  Provided an invalid username or password
                </Alert>
              </div>
            )}
          </div>

          <div className="pb-4">
            {isLoading && (
              <div
                className="pb-4"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </div>
            )}

            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                container
                spacing={0}
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Grid>
                  <IconButton>
                    <FacebookIcon></FacebookIcon>
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton>
                    <GoogleIcon></GoogleIcon>
                  </IconButton>
                </Grid>
                <Grid>
                  <IconButton>
                    <TwitterIcon></TwitterIcon>
                  </IconButton>
                </Grid>
              </Grid>

              <Grid item xs={2} style={{ textAlign: "center" }}>
                <Button
                  onClick={submitLogIn}
                  variant="contained"
                  className="center"
                >
                  Log In
                </Button>
              </Grid>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <Button onClick={navigateToSignUpPage} className="center">
                  Do not have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </div>
          
          <CompanyTag />
        </Container>
      </div>
    );
};

export default LoginPage;