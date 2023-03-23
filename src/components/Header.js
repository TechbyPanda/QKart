import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const username = localStorage.getItem("username");

  const handleLogoutClick = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      <div>
        {
        (username && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar alt={username} src="./public/avatar.png" />
              <Typography variant="subtitle1">{username}</Typography>
              <Button variant="text" onClick={handleLogoutClick}>
                Logout
              </Button>
            </Stack>
          </>
        )) ||
        (!hasHiddenAuthButtons && (
          <>
            <Button variant="text" onClick={() => history.push('/login')}>Login</Button>
            <Button variant="contained"onClick={() => history.push('/register')}>Register</Button>
          </>
        )) ||
        (
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => history.push('/')}
          >
            back to explore
          </Button>
        )
        }
      </div>
    </Box>
  );
};

export default Header;
