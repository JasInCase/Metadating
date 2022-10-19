import React, { useState } from 'react'
import axios from 'axios'
import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  Button,
  Link,
  styled,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

export async function getMessageFromAPI() {

    const response = await axios.get('/api/v1/hello/');

    return response.data.string;

}

export async function sendMessageToAPI(name: string, age: string, gender: string, interests: string) {

    let data = [name, age, gender, interests]

    const response = await axios.post('/api/v1/form', {
      name: name,
      age: age,
      gender: gender,
      interests: interests,
    }, { headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        'content-type': 'application/json'
    }});
    
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

const FormPage = () => {

    const [message, setMessage] = useState("");
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [interests, setInterests] = useState('');

    // This function is called when the input changes
    const nameInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredName = event.target.value;
        setName(enteredName);
    };
    const ageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredAge = event.target.value;
        setAge(enteredAge);
    };
    const genderInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredGender = event.target.value;
        setGender(enteredGender);
    };
    const interestsInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredInterests = event.target.value;
        setInterests(enteredInterests);
    };

    // This function is triggered when the Submit buttion is clicked
    const submit = () => {

        if (!/[0-9]/.test(age)) {
        //   console.log("Its not a number!! ERROR!!");
          return;
        }
        // if (/[0-9]/.test(age)) {
        //   console.log("It is a number");
        // }

        if (name === "") {
            // console.log("Need to add name");
            return;
        }
        if (age === "") {
            // console.log("Need to add age");
            return;
        }
        if (gender === "") {
            // console.log("Need to add gender");
            return;
        }
        if (interests === "") {
        //   console.log("Need to add interests");
          return;
        }

        sendMessageToAPI(name, age, gender, interests).then((apiMessage) => {

            if (apiMessage === "") {
                console.log("An error occurred when sending to the api");
                return "Error sending to api";
            } else {
                return apiMessage;
            }

        }).then((apiMessage) => {

            console.log(apiMessage);
            window.localStorage.setItem("matchId", apiMessage);
            window.location.assign("/conversation")
            
        });

    };

    return (
      // https://mui.com/material-ui/getting-started/usage/
      // https://mui.com/material-ui/react-grid/
      <div className="p-5">
        {/* <h2>Form Page</h2> */}

        {/* <ImageList sx={{ width: 150, height: 150 }} cols={1} rowHeight={100}>
            <ImageListItem key={"img-logo"}>
                <img
                  src={'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png'}
                  alt="logo"
                  // loading="lazy"
                />
            </ImageListItem>
          </ImageList> */}

        <Container
          maxWidth="md"
          fixed={true}
          className="shadow-2xl rounded-3xl bg-blue-200"
        >

          <Typography
            className="pt-3 pb-1"
            variant="h3"
            component="h3"
            align="center"
          >
            {" "}
            Input a Profile{" "}
          </Typography>

          <div className="pb-7 pt-3">
            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="name"> Name </InputLabel>
                <OutlinedInput
                  // className="input"
                  fullWidth
                  id="name"
                  label="Name"
                  value={name}
                  onChange={nameInputHandler}
                  placeholder="Name"
                />
              </FormControl>
            </div>

            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="age"> Age </InputLabel>
                <OutlinedInput
                  // className="input"
                  id="age"
                  fullWidth
                  label="Age"
                  value={age}
                  onChange={ageInputHandler}
                  placeholder="Age"
                />
              </FormControl>
            </div>

            <div className="p-2">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="gender"> Gender </InputLabel>
                <OutlinedInput
                  // className="input"
                  id="gender"
                  fullWidth
                  label="Gender"
                  value={gender}
                  onChange={genderInputHandler}
                  placeholder="Gender"
                />
              </FormControl>
            </div>

            <div className="p-2 pb-16">
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="interests"> Interests </InputLabel>
                <OutlinedInput
                  // className="input"
                  id="interests"
                  fullWidth
                  label="Interests"
                  value={interests}
                  onChange={interestsInputHandler}
                  placeholder="Interests"
                />
              </FormControl>
            </div>

            <Grid container direction="column" alignItems="center" justifyContent="center">

              <div>
                {/* <Link
                  href="/conversation"
                  className="align-middle justify-center"
                  underline="none"
                > */}
                  <TailwindButton
                    onClick={submit}
                    variant="contained"
                    className="center"
                  >
                    Submit
                  </TailwindButton>
                  
                {/* </Link> */}
              
              </div>
            </Grid>
          </div>
        </Container>
      </div>
    );
};

export default FormPage;