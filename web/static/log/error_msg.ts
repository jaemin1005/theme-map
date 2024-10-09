export enum ERROR_MSG {
    // gps에 관련된 
    GEOLOCATION_GETTING_FAIL = "Error Getting Loaction: ",
    GEOLOCATION_NOT_AVAILABLE = "Geolocation is not available in your browser",
    GEOLOCATION_PERMISSION_DENIED = "User denied the request for Geolocation",
    GEOLOCATION_POSITION_UNAVAILABLE = "Location information is unavailable",
    GEOLOCATION_TIMEOUT = "The request to get user location timed out",

    //api
    NO_REFRESH_TOKEN = "Don't have refresh token",


    INTERNAL_SERVER_ERROR = "Internal Server Error",
    UNAVAILABLE_HTTP_METHOD = "Unavailable Http Method",
    REGISTER_VALIDATE_FAIL = "Register Validate Fail",

    LOGOUT_FAIL = "Logout fail",
}