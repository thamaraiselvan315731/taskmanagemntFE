import * as React from "react";// eslint-disable-next-line
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from 'react-router-dom';
import Alert from "@mui/material/Alert";// eslint-disable-next-line
import TextField from "@mui/material/TextField";// eslint-disable-next-line
import FormHelperText from '@mui/material/FormHelperText';// eslint-disable-next-line
import IconButton from '@mui/material/IconButton';// eslint-disable-next-line
import OutlinedInput from '@mui/material/OutlinedInput';// eslint-disable-next-line
import InputLabel from '@mui/material/InputLabel';// eslint-disable-next-line
import InputAdornment from '@mui/material/InputAdornment';// eslint-disable-next-line
import FormControl from '@mui/material/FormControl';// eslint-disable-next-line
import Visibility from '@mui/icons-material/Visibility';// eslint-disable-next-line
import VisibilityOff from '@mui/icons-material/VisibilityOff';// eslint-disable-next-line
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";// eslint-disable-next-line
import Typography from "@mui/material/Typography";// eslint-disable-next-line
import Container from "@mui/material/Container";
import Header from "../../components/Header";
import { changePassword } from "../../Service/AuthenticationServices/auth"
// eslint-disable-next-line
let intervalid;
export const ResetPassword = (props) => {

    const [values, setValues] = React.useState({
        atleast: false,
        password: '',
        error: false,
        showPassword: false,
    });
    const navigate = useNavigate();
    const [errorRules, setErrorRules] = React.useState(false);
    const [error, setError] = React.useState(false);// eslint-disable-next-line 
    const [success, setSuccess] = React.useState(false);// eslint-disable-next-line 
    const [errormsg, setErrorMsg] = React.useState("Something Went Wrong!");



    const handleSubmit = async (event) => {
        event.preventDefault();

        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        var valid = re.test(values.password);
        if (valid) {
            setValues({
                ...values,
                error: false,
            });
            setErrorRules(false)
            var result = await changePassword({ email: props.email.email, password: values.password })

            if (!result.status) {
                setError(true);
                setErrorMsg(result.response.msg)
            }
            else {
                setSuccess(true);
                setValues({
                    ...values,
                    password: "",
                });
                setTimeout(() => {
                    navigate('/')
                }, 4000)
            }

        }
        else {
            setValues({
                ...values,
                atleast: true,
                error: true,
            });
            setErrorRules(true)

        }
        // login({
        //     email: data.get("email"),
        //     password: data.get("password")
        // });
    };
    // eslint-disable-next-line
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    // eslint-disable-next-line
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    // eslint-disable-next-line

    const checkValid = async (valuesCheck) => {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        var valid = re.test(valuesCheck);

        if (!valid && values.atleast) {
            setErrorRules(true);
        }
        else {
            setErrorRules(false);
        }


    }

    const handleChange = (prop) => async (event) => {

        setValues({ ...values, [prop]: event.target.value });

        if (values.atleast) {
            await checkValid(event.target.value)
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <Header title="Reset Password" subtitle="" />

            {error && <Alert severity="error" onClose={() => { setError(false) }}>{errormsg}</Alert>}

            {success && <Alert onClose={() => { setSuccess(false) }}>Updated Successfully!</Alert>}

            <Box sx={{

                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {/* <Formik
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
                                    Reset
                                </Button>

                            </Box>

                        </form>


                    </>
                    )}
                </Formik> */}

                <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        error={errorRules === true}
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                    {errorRules === true && (
                        <FormHelperText error id="accountId-error">
                            {"This password must contains 8 character, one uppercase letter, one lowercase letter, one number and one special character"}
                        </FormHelperText>
                    )}


                </FormControl>


                <Button
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Reset Password
                </Button>

            </Box>

        </Container>
    );
};
