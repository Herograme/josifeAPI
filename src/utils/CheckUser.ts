

export const CheckUser = (Username: string, password: string): boolean => {
    const envUsername = process.env.USERNAME_HOST;
    const envPassword = process.env.PASSWORD;
    //console.log(envUsername, envPassword)
    //console.log(Username, password)

    if (Username === envUsername && password === envPassword) {
        return true;
    }
    return false;
}
