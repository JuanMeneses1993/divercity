import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";

const getUserRole = async (user)=>{
    //devuelve un error si el usuario ya esta registrado
    
    try {
        const connection = await getConnection();
        const dbResponse= await connection.query("SELECT role FROM users WHERE user = ?", user)
        
        return dbResponse[0]['role']

    } catch (error) {
        throw new Error('Error al buscar el role')
    }
};

const consultUserPass = async(user, pass)=>{
    //devuelve el ok si el user y el pass son correctos

    try {
        //formatear usuario(en minusculas y sin espacios ni saltos de linea)


        //consulta a la base de datos
        const connection = await getConnection();
        const userResponse = await connection.query("SELECT user, pass FROM users WHERE user = ?", user)
            .then(DBResponse=>{
                //verifica si la clave coincide
                if (DBResponse[0].pass === pass){
                    return user;
                }
                else{
                    throw new Error('Invalid User Pass')
                };
            })
    
        return userResponse
        
    } catch (error) {
        throw new Error("Invalid User Pass")
    }
    


};

const getNames = async ()=>{
    try {
        const connection = await getConnection();
        const dbResponse = await connection.query(`SELECT user FROM users`);
        const users =  dbResponse.map(user =>{return user.user});

        return users
        
    } catch (error) {
        console.log(error)
        throw new Error('Error consiguiendo nombre de los empleados')
    }
};

const createUser = async (user, pass)=>{

    try {
        
        const userRow = { user, pass, role:'employee'};
        const connection = await getConnection();
        await connection.query(`INSERT INTO users SET ?`, userRow);

    } catch (error) {
        throw new Error('Error creando empleado')
    }
}
const deleteUser = async (user)=>{
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM users WHERE user = '${user}'`);

    } catch (error) {
        throw new Error('Error borrando empleado')
    }
}

export const userDbHelper ={
    consultUserPass,
    getUserRole,
    getNames,
    createUser,
    deleteUser

}


/* 
Pasos para la creacion de las estadisticas

obtener los usuarios totales de la base de datos

por cada uno de los usuarios buscar en la base de datos todos los registros de historial con ese usuario

filtar esos registros con la suma total de horas en un mes semana y dia.



*/