import React from 'react';// eslint-disable-next-line
import TextField from "@mui/material/TextField";// eslint-disable-next-line
import Typography from "@mui/material/Typography";
import Header from "../../components/Header";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ResetPassword } from "./ResetPassword"
import { otpVerified } from "../../Service/AuthenticationServices/auth"
class OtpInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = { value: '', otp1: "", otp2: "", otp3: "", otp4: "", disable: true, resetpwd: false, error: false, errormsg: "" };
        this.handleChanges = this.handleChanges.bind(this);
        this.handleSubmits = this.handleSubmits.bind(this);
        console.log("props", props.email)
    }

    handleChanges(value1, event) {
        const singlechar2 = String(event.target.value)[0];

        //const typechangetonumber2 = Number(singlechar2)
        this.setState({ [value1]: singlechar2 });

    }// eslint-disable-next-line
    handleSubmit = (event) => {
        event.preventDefault();// eslint-disable-next-line
        const data = new FormData(event.currentTarget);

    };

    async handleSubmits() {

        if (this.state.otp1 && this.state.otp2 && this.state.otp3 && this.state.otp4) {
            let appendString = this.state.otp1 + this.state.otp2 + this.state.otp3 + this.state.otp4;
            this.setState({ value: appendString })
            var results = await otpVerified({ email: this.props.email.email, otp: Number(appendString) })
            console.log(results)
            if (results.status) {
                this.setState({ resetpwd: true, error: false });

            } else {
                this.setState({ error: true, errormsg: results.response.msg });
            }

        }


    }
    handleFormSubmit = (values) => {
        console.log(values);
    };

    inputfocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {

                elmnt.target.form.elements[next].focus()
            }
        }
        else {
            if (elmnt.target.value >= 1 && elmnt.target.value <= 9) {
                const next = elmnt.target.tabIndex;
                if (next < 4) {
                    elmnt.target.form.elements[next].focus()
                }
            }
        }
    }

    render() {

        return (
            <div>
                {this.state.error && <Alert severity="error" onClose={() => { this.setState({ error: false }) }}>{this.state.errormsg}</Alert>}
                {!this.state.resetpwd && <>
                    <Header title="OTP Required" subtitle="Please enter the OTP which received on mail." />
                    <Box
                        xs={6}
                        sx={{
                            "& > :not(style)": { m: 1, width: "25ch" }, marginTop: 2,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        component="form"
                        noValidate
                        autoComplete="off" >

                        <input
                            name="otp1"
                            id="otp1"
                            type="number"
                            // tabindex="1"
                            maxLength="1"
                            pattern="[0-9]{1}"
                            className="otpInput"
                            value={this.state.otp1}
                            onKeyPress={this.keyPressed}
                            onChange={e => this.handleChanges("otp1", e)}
                            tabIndex="1" onKeyUp={e => this.inputfocus(e)}

                        />
                        <input
                            name="otp2"
                            type="number"
                            // tabindex="2"
                            pattern="[0-9]{1}"
                            className="otpInput"
                            value={this.state.otp2}
                            onChange={e => this.handleChanges("otp2", e)}
                            tabIndex="2" maxLength="1" onKeyUp={e => this.inputfocus(e)}

                        />
                        <input
                            name="otp3"
                            type="number"
                            // tabindex="3"
                            pattern="[0-9]{1}"
                            className="otpInput"
                            value={this.state.otp3}
                            onChange={e => this.handleChanges("otp3", e)}
                            max-length="1"
                            maxLength="1"
                            tabIndex="3" onKeyUp={e => this.inputfocus(e)}

                        />
                        <input
                            name="otp4"
                            type="number"
                            //tabindex="4"
                            pattern="[0-9]{1}"
                            className="otpInput"
                            value={this.state.otp4}
                            onChange={e => this.handleChanges("otp4", e)}
                            tabIndex="4" maxLength="1" onKeyUp={e => this.inputfocus(e)}
                        />


                    </Box>
                    <Box sx={{
                        marginTop: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>

                        <Button
                            disabled={!this.state.otp1 || !this.state.otp2 || !this.state.otp3 || !this.state.otp4}

                            variant="contained"
                            sx={{ mt: 3, mb: 2, mr: 16 }}
                            onClick={this.handleSubmits}>
                            Submit
                        </Button>

                    </Box></>}

                {this.state.resetpwd &&
                    <ResetPassword otp={this.state.value} email={this.props.email} />

                }

            </div>
        );
    }
}




export default OtpInput;