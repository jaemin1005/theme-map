export enum TOAST_MSG {
    LOGIN_FAIL = "Incorrect username or password.",
    LOGIN_ERROR = "An error occurred during login.",
    INVALID_EMAIL = "Enter a valid email.",
    REGISTER_SUCCESS = "Success Signin.",
    REGISTER_FAIL = "Fail Signin.",
    VALIDATE_FAIL = "Validation failed.",

    // 뒤에 문구의 추가가 필요
    LOGIN_SUCCESS = "Welcome ",
    NO_MARKER_INFO = "No marker info",

    MAP_SAVE_SUCCESS = "Success map save",
    MAP_SAVE_FAIL = "Failed map save",
    MAP_SAVE_ERROR = "An error occurred during save",
    MAP_READ_FAIL = "Map read fail",

    NEED_LOGIN = "Need Login using Service",
    MAP_DELETE_FAIL = "Failed delete map",

    INTERNAL_SERVER_ERROR = "Internal Server Error"
}