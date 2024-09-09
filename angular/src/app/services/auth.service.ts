import { Injectable } from '@angular/core';
import * as moment from "moment";


//This is the body of the respnse that we are expecting from the server
// {
//     "success": true,
//     "user": {
//         "_id": "66daf0694abf655b808c02a0",
//         "username": "test1",
//         "hash": "a02c6ca06a2e0d717f3fd83c10faa00d913c3b62dae481229fc94b1e945a592e232fbf4992d11fcd3c78e781603927b96c2c2de0f53039269123dba9306893ec",
//         "salt": "c50c04274e9ef3d8499428f5cc2b217a5a0c26ba6b52feddf2db831ca459e04e",
//         "__v": 0
//     },
//     "token": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmRhZjA2OTRhYmY2NTViODA4YzAyYTAiLCJpYXQiOjE3MjU2MjQ0MjU2MTgsImV4cCI6MTcyNTYyNDUxMjAxOH0.sf3aEcCBZ5PQrv62UdzWtNrhRGMvu_YQePiJ6Bx33Cr2sOSI8uazbE5101TBO69tMLswmbUqb7GnKdpTvFTdkxqamI0nXMdN1y-dozxiwwDpv3AIxP4eQxiuhM7_NaxUDV7FAcmSah_RGUJ-4qakKtntaFKtIwPvzkSe2VlR_mPgRXqq1oVYSRjCVMzZao9Gjovx39fMQUBnt_EyT7dBrq3A2xeBSoOBvT8a9wlz60MtE01W0kjhZaubtnbBQh7c55X64kzbhi4QXZFLxX1qFpogcTLyOzucSV7PaI7DjWqV6R0B4FnFNmzWKeROzNjMDXBN1A6WmeeNZ0LcRJukujAEYni6zngDZ0llYWoUy_dPloF3uaqs5L35_dOchfaQRhh9l1NI2xBwK4nREh-I6-fLyBUVL06OdGYWKMOySEHNdNwLGzXDwP69AJyJqoH-vabuCE4v79zIfhC9StxGy9_J33sJaL89w0z_LHHRpUjiOAR4TZZMY-se-3HR-eI1g9XbWTrHaAR_7Im9YcRUFJjk7-2Yq2jj9QXsA5bcFKtFWn6SPUq53hNMxpW9f6m7u0AsAr3U5Vf6xhzB4a57kaH413iXb4r8AY4DyV8FaR6KOCCGEkMMGIwNs_902sEXol6wytaqxQV8ne1j8i_L7IOrU0W2geS9w-oNhvQkbFk",
//     "expiresIn": "1d"
// }


@Injectable()
export class AuthService {

    constructor() {}
          
    setLocalStorage(responseObj) {
        //this just changes the expiresIn property of the response object from 1d, to an actual date. 
        const expires = moment().add(responseObj.expiresIn);
        
        //This stores the token and expiry date in local storage. Will need to think about how to do this in react. 
        localStorage.setItem('token', responseObj.token);
        localStorage.setItem('expires', JSON.stringify(expires.valueOf()));

    }          

    logout() {
        //this just delates stuff in local storage. 
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
    }

    isLoggedIn() {
        //this checks if the expiration date on the jws has passed or not. If returns true, jwt is valid and we are logged in.
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        //this just checks the expiration date of our jwt object. 
        const expiration = localStorage.getItem('expires');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    
}