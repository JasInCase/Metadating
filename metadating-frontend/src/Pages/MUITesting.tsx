import React, { useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export async function getMessageFromAPI() {

    // const response = await fetch ('/api/v1/hello/');
    // console.log(response);
    // return response.json;
    const response = await axios.get('/api/v1/hello/');
    // console.log(response);
    return response.data.string;


}



const MUITesting = () => {

    const [name, setName] = React.useState('');

    const onNameChange = () => {


    }

    return (

        <div>
        <Container maxWidth="md" fixed={true}>
                <Grid container spacing={2} alignItems="center" justifyContent="center" >
                    <Grid item xs={12}> {/* Takes up the whole page*/}
                        <Typography variant="h2" component="h2" align='center'>
                            Material UI Form Page
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="name-field"
                            label="Name"
                            fullWidth
                            // maxRows={4}
                            placeholder='Bob'
                            value={name}
                            onChange={onNameChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                        fullWidth
                            id="age-field"
                            label="Age"
                            // maxRows={4}
                            // value={name}
                            // onChange={onNameChange}
                        />
                    </Grid>
                    {/* <Grid item xs={8}> 
                        hello
                    </Grid> */}
                </Grid>
            </Container>
        </div>

    )
};

export default MUITesting;