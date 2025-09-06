import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../hooks/useAuth";
//import { loginService } from "../../Service/AuthenticationServices/auth"
export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = React.useState(false);// eslint-disable-next-line 
    const [errormsg, setErrorMsg] = React.useState("Something Went Wrong!");
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleFormSubmit = async (values) => {
        setError(false);
        var resultfromHook = await login({
            email: values.email.toLowerCase(),
            password: values.password
        });
        if (resultfromHook.status === false) {
            setError(true);
            setErrorMsg(resultfromHook.response.msg)
        }
        else{
            navigate("/home", { replace: true });
        }

        //await loginService(values, this)
    };
    // eslint-disable-next-line
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        login({
            email: data.get("email"),
            password: data.get("password")
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            {error && <Alert severity="error" onClose={() => { setError(false) }}>{errormsg}</Alert>}

            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
                <Box display="flex" justifyContent="center" mt="20px" mb="20px">
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={checkoutSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                        }) => (<>
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? "span 18" : "span 12" },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        label="Email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={!!touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        sx={{ gridColumn: "span 8" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        type="password"
                                        label="Password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        error={!!touched.password && !!errors.password}
                                        helperText={touched.password && errors.password}
                                        sx={{ gridColumn: "span 8" }}
                                    />

                                </Box>
                                <Box display="flex" justifyContent="space-between" mt="20px">
                                    <Button type="submit" color="primary" variant="contained">
                                        Sign In
                                    </Button>
                                    <Grid item>
                                        <RouterLink to="/forgetpassword">
                                            <Link href="#" variant="body2">
                                                {"Forget Password?"}
                                            </Link>
                                        </RouterLink>
                                    </Grid>
                                </Box>
                                <Box display="flex" justifyContent="start" mt="20px">

                                    <Grid item>
                                        <RouterLink to="/register">
                                            <Link href="#" variant="body2">
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </RouterLink>
                                    </Grid>
                                </Box>
                            </form>


                        </>
                        )}
                    </Formik>

                </Box>




                {/* </Box> */}
            </Box>
        </Container>
    );
};

// eslint-disable-next-line
const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    password: yup.string().required('Please Enter your password')
        .matches(// eslint-disable-next-line
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must be 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character"
        ),
    email: yup.string().email("invalid email").required("Email Is Mandatory"),

});
const initialValues = {
    password: "",
    email: ""

};

