import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";
import { tvDbHelper } from "./tv.db.helper";
import { tvHelper } from "./tv.helper";

const isUserExist = async (userName)=>{
    //devuelve un error si el usuario ya esta registrado

    try {
        const connection = await getConnection();
        const dbResponse= await connection.query("SELECT user FROM clientes WHERE user = ?", userName)
        

        if (Object.values(dbResponse).length > 0){
            throw new Error('El usuario ya existe')
        }

    } catch (error) {
        throw new Error(error)
    }
};

const createNewClient = async (userName, pass)=>{
    try {
        
        const userFormated =  userName.replace(/\s+/g, '').toLowerCase();
        const leftMinutes = '0'
        const client = {'user':userFormated, pass, leftMinutes};
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO clientes SET ?", client);
        
    } catch (error) {
        console.error(error)
        throw new Error('Error al agregar cliente')
    }

};

const getClientLeftMinutes = async (userName)=>{
    try {
        if (userName === 'none'){
            return 'unlimited'
        };

        const userFormated =  userName.replace(/\s+/g, '').toLowerCase();
        const connection = await getConnection();
        const dbResponse= await connection.query("SELECT leftMinutes FROM clientes WHERE user = ?", userFormated)

        return dbResponse[0]['leftMinutes']
        
    } catch (error) {
        throw new Error('Usuario no encontrado')
    }

};

const addMinutesToClient = async (userName, hours, minutes)=>{
    try {
        if (userName === 'none'){
            throw new Error('Usuario no valido')
        }

        //eliminar espacios y poner en minusculas
        const userFormated = userName.replace(/\s+/g, '').toLowerCase();

        //obtener los minutos actuales de ese usuario
        const dataBaseLeftMinutes = await clientDbHelper.getClientLeftMinutes(userFormated)

        //convertir a minutos
        const totalMinutes = (Number(hours) * 60) + Number(minutes)
        
        //sumar con los minutos de la base de datos
        const leftMinutesUpdated =  Number(dataBaseLeftMinutes) + totalMinutes;
        
        //Actualizar la base de datos
        const connection = await getConnection();
        const result = await connection.query(`UPDATE clientes SET leftMinutes = ${leftMinutesUpdated} WHERE user = ?`,userFormated);
        
    } catch (error) {
        throw new Error ('Usuario no valido')
    }
};

const substractMinutesToClient = async (userName, minutes, tvNumber)=>{
    try {
        //Sale si el usuario es anonimo o se activo por tiempo libre
        if (userName === 'Anonymous'){
            return
        };
        
        const userFormated =  userName.replace(/\s+/g, '').toLowerCase();

        //consulta a la base de datos
        const connection = await getConnection();
        const leftMinutesUpdated = await connection.query(`SELECT leftMinutes FROM clientes WHERE user = ?`, userFormated)
            .then(DBResponse=>{
                if (DBResponse[0].leftMinutes === "0"){
                    return 'noTime'
                }
                return((Number(DBResponse[0].leftMinutes)) - (Number(minutes)));
            });

        
        if (leftMinutesUpdated === 'noTime'){
            await historyDbHelper.createHistoryRow(tvNumber)
            await tvDbHelper.resetTvDb(tvNumber);
            tvHelper.deactivateTv(tvNumber);
            return
        }
        //actualizar los datos
        const result = await connection.query(`UPDATE clientes SET leftMinutes = ${leftMinutesUpdated} WHERE user = ?`,userFormated);

    } catch (error) {
        throw new Error(error)
    }
};

const haveEnoughtTime = async (minutesLeft, userName)=>{
    //Revisa en la base de datos el tiempo que le queda al usuario
    //si el tiempo solicitado es mayor al disponible devuelve un error
    try {
        //Sale si el usuario es anonimo o se activo por tiempo libre
        if (userName === 'Anonymous' || userName === 'unlimited'){
            return
        };

        const userFormated =  userName.replace(/\s+/g, '').toLowerCase();

        //consulta la base de datos
        const connection = await getConnection();
        const leftMinutesDB = await connection.query("SELECT leftMinutes FROM clientes WHERE user = ?", userFormated)
        
        //comparar si tiene tiempo suficiente
        if ( Number(Number(leftMinutesDB[0].leftMinutes)) < minutesLeft) {
            throw new Error('Usuario no posee tiempo suficiente.');
        };
        
    } catch(error){
        throw new Error (error)
    }
};

const consultUserPass = async(user, pass)=>{
    //devuelve el ok si el user y el pass son correctos

    try {
        //verificar la maquina sera activada sin usuario
        if (user === 'none' || pass === 'none'){     
            return 'Anonymous';
        };
        
        //formatear usuario(en minusculas y sin espacios ni saltos de linea)
        const userFormated = user.replace(/\s+/g, '').toLowerCase();
        
        //consulta a la base de datos
        const connection = await getConnection();
        const userResponse = await connection.query("SELECT user, pass FROM clientes WHERE user = ?", userFormated)
            .then(DBResponse=>{
                //verifica si la clave coincide
                if (DBResponse[0].pass === pass){
                    return userFormated;
                }
                else{
                    throw new Error('Invalid User Pass')
                };
            })
    
        return userResponse
        
    } catch (error) {
        throw new Error('Invalid User Pass')
    }
    

};

export const clientDbHelper ={
    isUserExist,
    createNewClient,
    getClientLeftMinutes,
    addMinutesToClient,
    substractMinutesToClient,
    haveEnoughtTime,
    consultUserPass
}