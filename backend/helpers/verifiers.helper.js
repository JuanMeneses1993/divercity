const hasSpaces = (user)=>{
    //Si tiene espacios devuelve un error
    if (/\s/.test(user)) {
        throw new Error('El usuario no puede contener espacios')
    }
}

const isPassFormatCorrect = (pass)=>{
    //El password debe de contener almenos 8caracteres
    //Pendiente cambiar por REgex

    if (pass.length < 8){
        throw new Error('La clave debe de contener por lo menos 8 caracteres')
    }
};

const isPasswordsMatch = (password, passwordRepeat)=>{
    if (password !== passwordRepeat){
        throw new Error ('Las claves no son iguales')
    }
}
    
export const verifiers = {
    isPassFormatCorrect,
    hasSpaces,
    isPasswordsMatch
}