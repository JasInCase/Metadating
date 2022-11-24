import React from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  Button,
} from "@mui/material";
import CompanyTag from "../CommonComponents/CompanyTag";
import MetadatingHeader from "../CommonComponents/MetadatingHeader";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import logo from "../public/logo512.png";
import logo2 from "./jusincase_small-01.png";

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
        <MetadatingHeader prefixText="Welcome to" />

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
                <div className="p-2">
                  <Button
                    onClick={navigateToLoginPage}
                    variant="contained"
                    className="center"
                  >
                    Login
                  </Button>
                </div>
              </Grid>
              <Grid>
                <div className="p-2">
                  <Button
                    onClick={navigateToSignUpPage}
                    variant="contained"
                    className="center"
                  >
                    Sign Up
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <CompanyTag />
      </Container>
    </div>
  );
};

export default LaunchPage;
