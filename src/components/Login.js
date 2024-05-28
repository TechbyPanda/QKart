import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ email: string, password: string }} formData
   *  Object with values of email, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "email": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    setLoading(true);
    try{
      const response = await axios.post(`${config.endpoint}/auth/login`,formData);
      const {user, tokens} = response.data;
      persistLogin(tokens.access.token, user.email, user.walletMoney);
      enqueueSnackbar("logged in", {variant: "alert"});
      history.push('/');
    }catch(error){
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
    setLoading(false);
  };

  const handleFormChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ email: string, password: string }} data
   *  Object with values of email, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that email field is not an empty value - "email is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let errorMessage = "";
    switch(true){
      case !data.email:
        errorMessage = "email is a required field";
        break;
      case !data.password:
        errorMessage = "Password is a required field";
        break;
      default:
        return true;
    }
    enqueueSnackbar(errorMessage, {variant: 'error'});
    return false;
  }

  const handleSubmit = () => {
    if(validateInput(formData))
      login(formData);
  }

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} email
   *    email of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `email` field in localStorage can be used to store the email that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, email, balance) => {
    window.localStorage.setItem("token",token);
    window.localStorage.setItem("email",email);
    window.localStorage.setItem("balance",balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      // minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            name="email"
            placeholder="Enter email"
            fullWidth
            value={formData.email}
            onChange={handleFormChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleFormChange}
          />
           {isLoading ? <CircularProgress style={{margin: '10px auto'}}/>
            :
            <Button className="button" variant="contained" onClick={handleSubmit}>
              LOGIN TO QKART
            </Button>}
          <p className="secondary-action">
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register Now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
