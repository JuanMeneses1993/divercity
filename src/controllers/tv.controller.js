import { json } from "body-parser";
import { response } from "express";
import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";
import {timeHelper} from "./../helpers/time.helper";
import {tvDbHelper} from "../helpers/tv.db.helper";
import { parse } from "dotenv";
import { tvHelper } from "../helpers/tv.helper";
import { clientDbHelper } from "../helpers/client.db.helper";
import { historyDbHelper } from "../helpers/history.db.helper";

const activateTv = async (req, res)=>{

    try {
        //extraer datos
        let {activateTvNumber, activateTvHours, activateTvMinutes, activateTvUser, activateTvPass} = req.body;
        if (!activateTvHours && !activateTvMinutes){
            res.send('Ingrese Tiempo')
            return
        }

        //consultar si el televisor esta ocupado
        await tvDbHelper.isTvActive(activateTvNumber);  

        //Consultar si el usuario ya esta activo
        await tvDbHelper.isUserActive(activateTvUser);
        
        const getMinutes = async()=>{
            //caso de ser unlimited 
            if (activateTvHours === 'unlimited' && activateTvUser != 'none'){
                //Pone un limite del tiempo que tenga el usuario disponible en su cuenta
                return await clientDbHelper.getClientLeftMinutes(activateTvUser)
            }
            else if(activateTvHours === 'unlimited'){
                //Si se activa sin usuario y sin tiempo limite se pone un limite de 8 horas.
                const MINUTES_IN_EIGHT_HOURS = 480;
                return MINUTES_IN_EIGHT_HOURS
            }
            else return (Number(activateTvHours)*60) + Number(activateTvMinutes);
        }
        
        const getState = ()=>{
            if (activateTvHours === 'unlimited') return 'unlimited'
            else return 'active';
        }
        
        const mode = getState()
        const totalMinutes = await getMinutes()
        const currentEmployee = req.session.user

        //verifica user y pass, si no responde con un error 
        const user = await clientDbHelper.consultUserPass(activateTvUser, activateTvPass);

        //El usuario tiene tiempo suficiente?
        await clientDbHelper.haveEnoughtTime(totalMinutes, user);
      
        //RESTAR TIEMPO AL USUARIO
        //await clientDbHelper.substractMinutesToClient(user, totalMinutes, mode);

   
        //Escribir datos en la base de datos
        await tvDbHelper.writeTvDb(activateTvNumber, totalMinutes, user, mode, currentEmployee);
        
        //Prender el televisor
        tvHelper.activateTv(activateTvNumber);
        res.send(`Equipo ${(activateTvNumber)} activado`);

    } catch (error) {
        res.send(String(error));
    };

};

const deactivateTv = async (req, res)=>{
    try {
        await historyDbHelper.createHistoryRow(req.params['tvNumber'])
        await tvDbHelper.resetTvDb(req.params['tvNumber']);
        tvHelper.deactivateTv(req.params['tvNumber']);
        res.sendStatus(200);
        
    } catch (error) {
        res.send("Error al desactivar Tv")
    }
};

const getTvsInfo = async (req, res)=>{
//Devuelve todos las propiedades actuales de Todos los TVs
    
    //consulta a la base de datos
    const dbResponse = await tvDbHelper.getTvsInfo();
    res.json(dbResponse);
};

export const tvController = {
    activateTv,
    deactivateTv,
    getTvsInfo,
}
