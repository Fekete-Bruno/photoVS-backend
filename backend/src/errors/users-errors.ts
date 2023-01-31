import { ApplicationError } from "../protocols";

export function duplicatedEmailError(): ApplicationError {
    return {
        name: "DuplicatedEmailError",
        message: "There is already an user with given email",
    }
}

export function duplicatedUsernameError(): ApplicationError {
    return {
        name: "DuplicatedUsernameError",
        message: "There is already an user with given username",
    }
}

export function inexistentUserError(): ApplicationError {
    return {
        name: "InexistentUserError",
        message: "User does not exist",
    }
}