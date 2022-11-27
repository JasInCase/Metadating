import React, { useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Alert, Button, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, styled } from '@mui/material';
import CompanyTag from '../CommonComponents/CompanyTag';
import MetadatingHeader from "../CommonComponents/MetadatingHeader";

export async function getMessageFromAPI() {
    const response = await axios.get('/api/v1/hello/');

    return response.data.string;

}


type signUpData = {
    name: string,
    email: string,
    username: string,
    password: string
};


const sendSignupToAPI = async (data: signUpData) => {
    const dataToSend = {...data, operation: 'create'};
    const response = await axios.post('/api/v1/accounts/',
        dataToSend,
        {
            headers: {
                'content-type': 'application/json'
            }
        }
    );

    return response;
}


const SignUpPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validConfirmPassword, setValidConfirmPassword] = useState(true);
    const [errorTextName, setErrorTextName] = useState('');
    const [errorTextEmail, setErrorTextEmail] = useState('');
    const [errorTextUsername, setErrorTextUsername] = useState('');
    const [errorTextPassword, setErrorTextPassword] = useState('');
    const [errorTextConfirmPassword, setErrorTextConfirmPassword] = useState('');
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const enteredName = event.target.value;
      setName(enteredName);

      // Validate input
      if (!validName && event.target.value !== '') {
          setValidName(true);
          setErrorTextName('');
      }
    }

    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const enteredEmail = event.target.value;
      setEmail(enteredEmail);

      // Validate input
      if (!validEmail && event.target.value !== '') {
          setValidEmail(true);
          setErrorTextEmail('');
      }
    }

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
            setErrorTextPassword('');
        }
    }

    const onConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredConfirmPassword = event.target.value;
        setConfirmPassword(enteredConfirmPassword);

        // Validate input
        if (!validConfirmPassword && event.target.value !== '') {
            setValidConfirmPassword(true);
            setErrorTextConfirmPassword('');
        }
    }

    const submitSignUp = () => {
        // Check for empty fields
        let emptyFields = false;
        if (!name.trim()) {
            setValidName(false);
            setErrorTextName('Plase input a valid name.');
            emptyFields = true;
        }
        if (!email.trim()) {
            setValidEmail(false);
            setErrorTextEmail('Plase input a valid email.');
            emptyFields = true;
        }
        if (!username.trim()) {
            setValidUsername(false);
            setErrorTextUsername('Please input a valid username.');
            emptyFields = true;
        }

        if (!password.trim()) {
            setValidPassword(false);
            setErrorTextPassword('Please input a valid password.');
            emptyFields = true;
        }
        else if (password !== confirmPassword) {
            setValidConfirmPassword(false);
            setErrorTextConfirmPassword('Passwords do not match.');
            emptyFields = true;
        }

        if (emptyFields) {
            return;
        }

        // Show loading icon and sign up
        setIsLoading(true);

        const data: signUpData = {
            name: name,
            email: email,
            username: username,
            password: password
        };

        sendSignupToAPI(data).then((res) => {

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

    const navigateToLoginPage = (event: any) => {
        window.location.assign('/login');
    }

    return (
      <div className="p-5">
        <Container
          maxWidth="md"
          fixed={true}
          className="shadow-2xl rounded-3xl bg-purple-200"
        >
          <MetadatingHeader prefixText="Sign up for" />

          <div className="pt-3 pb-2">
            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="name"> Name </InputLabel>
                <OutlinedInput
                  error={!validName}
                  fullWidth
                  id="name"
                  label="Name"
                  autoComplete="on"
                  value={name}
                  onChange={onNameChange}
                />
                {!validName && (
                  <FormHelperText>{errorTextName}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="email"> Email </InputLabel>
                <OutlinedInput
                  error={!validEmail}
                  fullWidth
                  id="email"
                  label="Email"
                  autoComplete="on"
                  value={email}
                  onChange={onEmailChange}
                />
                {!validEmail && (
                  <FormHelperText>{errorTextEmail}</FormHelperText>
                )}
              </FormControl>
            </div>

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
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="name"> Password </InputLabel>
                <OutlinedInput
                  error={!validPassword}
                  fullWidth
                  id="password"
                  type="password"
                  label="Password"
                  autoComplete="off"
                  value={password}
                  onChange={onPasswordChange}
                />
                {!validPassword && (
                  <FormHelperText>{errorTextPassword}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="username"> Confirm Password </InputLabel>
                <OutlinedInput
                  error={!validConfirmPassword}
                  fullWidth
                  id="confirm-password"
                  type="password"
                  label="Confirm assword"
                  autoComplete="off"
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                />
                {!validConfirmPassword && (
                  <FormHelperText>{errorTextConfirmPassword}</FormHelperText>
                )}
              </FormControl>
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
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <Button
                  onClick={submitSignUp}
                  variant="contained"
                  className="center"
                >
                  Sign Up
                </Button>
              </Grid>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <Button onClick={navigateToLoginPage} className="center">
                  Already have an account? Login
                </Button>
              </Grid>
            </Grid>
          </div>

          <CompanyTag />
        </Container>
      </div>
    );
};

export default SignUpPage;