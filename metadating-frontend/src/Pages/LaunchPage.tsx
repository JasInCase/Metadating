import React from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Button,
} from "@mui/material";

const navigateToSignUpPage = () => {
    window.location.assign('/signup');
}

const navigateToLoginPage = () => {
    window.location.assign('/login');
}

const LaunchPage = () => {
  return (
    <div className="p-5">
      <Container
        maxWidth="md"
        fixed={true}
        className="shadow-2xl rounded-3xl bg-purple-200"
      >
        <Typography
          className="pt-3 pb-1"
          variant="h3"
          component="h3"
          align="center"
        >
          Welcome to Metadating!!
        </Typography>

        <div className="pb-4">
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
                <Button
                  onClick={navigateToLoginPage}
                  variant="contained"
                  className="center"
                >
                  Login
                </Button>
              </Grid>
              <Grid>
                <Button
                  onClick={navigateToSignUpPage}
                  variant="contained"
                  className="center"
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default LaunchPage;
