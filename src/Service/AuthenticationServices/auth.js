import axios from "axios"

export const loginService = async (passingPayload) => {
    let result = await axios
        .post("auth/login", passingPayload)
        .then(async (res) => {
            if (res.status === 200) {
                let successMSG = {
                    status: true,
                    response: res.data
                }
                return successMSG
            }
        })
        .catch((error) => {
            console.log("error :>> ", error);
            let errorMSG = {
                status: false,
                response: error.response.data.errors[0]
            }
            return errorMSG

        });

    return result;

}
export const registerService = async (passingPayload) => {
    var lowerconversion = {
        ...passingPayload, email: passingPayload.email.toLowerCase()
        
    }
  let result= await axios
      .post("auth/signup", lowerconversion)
        .then(async (res) => {
            if (res.status === 200) {
                let successMSG = {
                    status: true,
                    response: res.data
                }
                return successMSG
            } 
        })
       .catch((error) => {
           console.log("error :>> ", error);
           let errorMSG = {
               status: false,
               response: error.response.data.errors[0]
           }
           return errorMSG
           
        });

    return result;

}

export const forgetPassword = async (passingPayload) => {
    var lowerconversion = {
        email: passingPayload.email.toLowerCase()

    }
  var resultService = await  axios
      .post("auth/resetpassword", lowerconversion)
        .then(async (res) => {
            if (res.status === 200) {
                let successMSG = {
                    status: true,
                    response: res.data
                }
                return successMSG
            } 
        })
        .catch((error) => {
            console.log("error :>> ", error);
            let errorMSG = {
                status: false,
                response: error.response.data.errors[0]
            }
            return errorMSG
        });

    return resultService;

}

export const otpVerified = async (passingPayload) => {
    var lowerconversion = {
        ...passingPayload,
        email: passingPayload.email.toLowerCase()

    }
    var resultService = await axios
        .post("auth/validateOTP", lowerconversion)
        .then(async (res) => {
            if (res.status === 200) {
                let successMSG = {
                    status: true,
                    response: res.data
                }
                return successMSG
            }
        })
        .catch((error) => {
            console.log("error :>> ", error);
            let errorMSG = {
                status: false,
                response: error.response.data.errors[0]
            }
            return errorMSG
        });

    return resultService;

}

export const changePassword = async (passingPayload) => {
    var lowerconversion = {
        ...passingPayload,
        email: passingPayload.email.toLowerCase()

    }
    var resultService = await axios
        .post("auth/changepassword", lowerconversion)
        .then(async (res) => {
            if (res.status === 200) {
                let successMSG = {
                    status: true,
                    response: res.data
                }
                return successMSG
            }
        })
        .catch((error) => {
            console.log("error :>> ", error);
            let errorMSG = {
                status: false,
                response: error.response.data.errors[0]
            }
            return errorMSG
        });

    return resultService;

}




// export function getService(self) {
//     axios
//         .get("flags")
//         .then((res) => {
           
//         })
//         .catch((error) => {
           
//         });

// }