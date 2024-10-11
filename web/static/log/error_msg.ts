export enum ERROR_MSG {

    FAILED_ENV_SETUP = "Failed env setup",

    // gps에 관련된 
    GEOLOCATION_GETTING_FAIL = "Error Getting Loaction: ",
    GEOLOCATION_NOT_AVAILABLE = "Geolocation is not available in your browser",
    GEOLOCATION_PERMISSION_DENIED = "User denied the request for Geolocation",
    GEOLOCATION_POSITION_UNAVAILABLE = "Location information is unavailable",
    GEOLOCATION_TIMEOUT = "The request to get user location timed out",

    //api
    NONE_REFRESH_TOKEN = "Don't have refresh token",
    NONE_ACCESS_TOKEN = "Don't have access token",
    FAILED_VALIDATE_BODY = "Failed validate body",

    INTERNAL_SERVER_ERROR = "Internal Server Error",
    UNAVAILABLE_HTTP_METHOD = "Unavailable Http Method",
    REGISTER_VALIDATE_FAIL = "Register Validate Fail",

    LOGOUT_FAIL = "Logout fail",
    FAILED_GET_USER_INFO = "Failed get uesr info",
}