import { json } from "body-parser";
import { response } from "express";
import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";
import {timeHelper} from "./../helpers/time.helper";
import {dataBaseHelper} from "../helpers/tv.db.helper";
import { parse } from "dotenv";
import { tvHelper } from "../helpers/tv.helper";
import { clientDbHelper } from "../helpers/client.db.helper";

import { verifiers } from "../helpers/verifiers.helper";


const getUserMinutes = async (req, res)=>{
    try {
        const userName = req.params['userName']
        const leftMinutes = await clientDbHelper.getClientLeftMinutes(userName);
        const hours = Math.floor(Number(leftMinutes) / 60)
        const minutes = (Number(leftMinutes) - (hours*60))
        res.send(`${hours} horas ${minutes} minutos`)
        
    } catch (error) {
        res.status(400).send(String(error))
    }
};

const addMinutesToUser = async (req, res)=>{
    try {
        //extraer los datos
        const {user, hours} = req.body;

        //validar datos
        //verificar si los minutos no son mayores a de 30 y si las horas no son mayores de 8 ni menores a 0
        if (Number(hours) < 0 ||
            Number(hours) > 8 ){
                throw new Error ('Parametros de tiempo invalidos')
            }
        //actualizar los minutos en la base de datos
        await clientDbHelper.addMinutesToClient(user, hours, '0')
        

        res.status(200).send('Tiempo agregado')
    } catch (error) {
        console.error(error)
        res.send(String(error))
    }

};

const createNewUser = async (req, res)=>{
    try {
        //extraer los datos
        const {user, pass, passRepeat} = req.body

        //Verificar que la clave tenga por lo menor 8 caracteres
        verifiers.isPassFormatCorrect(pass)

        //verificar si las contrasenas son iguales
        verifiers.isPasswordsMatch(pass, passRepeat)

        //revisar si el nombre de usuario ya esta en uso
        await clientDbHelper.isUserExist(user)
        
        //agregar el cliente a la base de datos
        await clientDbHelper.createNewClient(user, pass)
        
        res.status(200).send('Usuario creado')
    } catch (error) {
        res.status(400).send(String(error))
    }
};

export const clientController = {
    getUserMinutes,
    addMinutesToUser,
    createNewUser
}
