import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";
import {timeHelper} from "./time.helper";
import { tvHelper } from "./tv.helper";
import { historyDbHelper } from "./history.db.helper";
import { clientDbHelper } from "./client.db.helper";


const resetTvs = async()=>{
    //apagar el puerto hdmi de los televisores que esten activados con usuario
    // si han pasado mas de 3 minutos desactiva los tvs con usuario

    
}


const updateTimeEnlapsepTv = async(startTime, tvNumber)=>{
    try {
        
        
        if (startTime === 'null'){return};
        
        const tvNumberFormated = String(tvNumber)
  

        const currentTimeEnlapsed = timeHelper.getTimeEnlapsed(startTime);
        const   tvDbTimeEnlapsed = await getTimeEnlapsedTv(tvNumberFormated);

        const currentTimeEnlapsedMinutes = currentTimeEnlapsed.slice(3, 5)
        const tvDbTimeEnlapsedMinutes = tvDbTimeEnlapsed['enlapsedTime'];
        
        
        if (currentTimeEnlapsedMinutes > tvDbTimeEnlapsedMinutes){
            
            //actualizar bd tvs
            const connection = await getConnection();

            const result = await connection.query(`UPDATE tvs SET enlapsedTime = '${currentTimeEnlapsedMinutes}' WHERE tvNumber = '${tvNumberFormated}' `);
            //actualizar tiempo de usuario
            const totalToSubstract = Number(currentTimeEnlapsedMinutes) - Number(tvDbTimeEnlapsedMinutes)
            console.log(totalToSubstract)
            const tv = await getTv(tvNumber);
            await clientDbHelper.substractMinutesToClient(tv.currentUser, totalToSubstract, tv.tvNumber);
            return 'reset'
        }
    } catch (error) {
        console.log(error)
        return
        throw new Error("Error Actualizando time enlapse en la base de datos")
    }
};

const getTimeEnlapsedTv = async(tvNumber)=>{
    //Devuelve el tiempo transcurrido escrito en la base de datos tvs
    try {
        const connection = await getConnection();
        const dbResponse = await connection.query(`SELECT enlapsedTime FROM tvs WHERE tvNumber = ${tvNumber}` );
        
        return dbResponse[0];    
    } catch (error) {
        throw new Error('Error obteniendo el tiempo tranascurrido en la tv')
    }

}

const dbChecker = async ()=>{

    try {
        const totalRows = await countTvRows();
        
        let tvNumber = 1;
        while (tvNumber <= totalRows){
            const tv = await getTv(tvNumber);
            if (await updateTimeEnlapsepTv( tv.startTime, tv.tvNumber) === 'reset'){ return}
            if (tv.state === 'inactive'){
                tvNumber++;
                continue;
            };

            const timeLeft = timeHelper.getTimeLeft(tv.endTime);
            const timeLeftMinusFiveMin = timeHelper.getTimeLeft(tv.endTimeMinusFiveMin);

            //Verificar si el tiempo ya esta vencido
            if (timeLeft === 'completado'){
                await historyDbHelper.createHistoryRow(tv.tvNumber);
                await tvDbHelper.resetTvDb(tv.tvNumber);
                tvHelper.deactivateTv(tv.tvNumber);
                return;
            }

            //Verificar si tiene que mostrar el anuncio de 5 min
            else if (timeLeftMinusFiveMin === 'completado' && tv.endTimeMinusFiveMin !== 'completado'){
                await setTimeEndMinusFiveToComplete(tv.tvNumber);
                tvHelper.showFiveMinAd(tv.tvNumber);
                return;
            };

            tvNumber++;
        }
        

    } catch (error) {
        console.log(error)
        throw new Error ('Error en el autoChecker de la base de datos')
    };
};

const setTimeEndMinusFiveToComplete = async (tvNumber)=>{
    //Resetea a null el endTime y pone en inactive el numero de tvNumber que le pasemos
    try {
        const tv = {'endTimeMinusFiveMin' : 'completado'}
        const connection = await getConnection();
        const result = await connection.query("UPDATE tvs SET ? WHERE tvNumber = ?", [tv, tvNumber]);

    } catch (error) {
        return error;
    };
};

const isTvActive = async (tvNumber_form)=> {
    //Devuelve un error si el equipo esta en uso
    try {
        const connection = await getConnection();
        const respuestaDB = await connection.query(`SELECT state FROM tvs WHERE tvNumber = ${tvNumber_form}`)
            .then(DBResponse =>{
                if (DBResponse[0].state === 'active'){
                    throw new Error('El equipo esta en uso');
                };
            });
            
    } catch (error) {
        throw new Error(error);
    }

};

const isUserActive = async(user)=>{
    const tvMaxNumber =  await countTvRows();

    for (let tvNumber = 1; tvNumber <= tvMaxNumber; tvNumber++){
        const tv = await getTv(tvNumber);

        if (tv.currentUser === user){
            throw new Error('El usuario Ya esta activo')
        }
    }

}

const getTvsInfo= async ()=>{
//Devuelve todos las propiedades actuales de Todos los TVs
    
    try {
        //consulta a la base de datos
        const connection = await getConnection();
        const dbResponse = await connection.query("SELECT tvNumber, currentUser, state, minutesBrough, startTime, endTime, endTimeMinusFiveMin FROM tvs");
    
        const response = dbResponse.map((element, index) => {
            
            const endTime = dbResponse[index].endTime;

            const time = ()=>{

                if (dbResponse[index].state === 'unlimited'){
                    return timeHelper.getTimeEnlapsed(dbResponse[index].startTime);
                }
    
                else if (dbResponse[index].endTime === 'null'){
                    return "-- : -- : --";
                }
                else{
                    return timeHelper.getTimeLeft(dbResponse[index].endTime);
                };
            };
            let leftTime = time();

            //extraer datos
            const {state, tvNumber, endTimeMinusFiveMin} = dbResponse[index];

            //devolver datos
            return {tvNumber, state, leftTime, endTimeMinusFiveMin};
        });
        //Devuelve todos los tvs en un array
        return response;
        
    } catch (error) {
        return error;
    };

};

const getTv= async (tvNumber)=>{
    
    try {
        //consulta a la base de datos
        const connection = await getConnection();
        const dbResponse = await connection.query(`SELECT tvNumber, currentUser, state, minutesBrough, startTime, endTime, endTimeMinusFiveMin, employeeName FROM tvs WHERE tvNumber = ${tvNumber}`);
        
        return dbResponse[0]
        
    } catch (error) {
        return error;
    };

};

const writeTvDb = async (tvNumber, minutesBrough, user, state, employeeName)=>{
    
    try {

        const startTime = timeHelper.formatDate(timeHelper.getCurrentDate());

        const endTime = timeHelper.calculateEndingTime(Number(minutesBrough));
        const endTimeMinusFiveMin = timeHelper.calculateEndingTime(Number(minutesBrough) - 5);

        const currentUser = user;
        const enlapsedTime = '00'
        const tv = { startTime, endTime, state, currentUser, minutesBrough, endTimeMinusFiveMin, employeeName, enlapsedTime };
        const connection = await getConnection();
        const result = await connection.query("UPDATE tvs SET ? WHERE tvNumber = ?", [tv, tvNumber]);
        
    } catch (error) {
        console.log(error)
        throw new Error('Error escribiendo base de datos')
    };
};

const resetTvDb = async (tvNumber)=>{
    //resetea todos los campos de la tv que se le pase como parametro

    try {

        const {state, currentUser, startTime} = await getTv(tvNumber);

        //En caso de estar en modo unlimited restar al usuario el tiempo
        if (state === 'unlimited'){
            const enlapsedTime = timeHelper.getTimeEnlapsed(startTime);
            const minutes = timeHelper.timerToMinutes(enlapsedTime);
            await clientDbHelper.substractMinutesToClient(currentUser, minutes, ' ');
        }

        const tv = { 'startTime': 'null', 'endTime': 'null', 'state': 'inactive', 'currentUser': 'noUserDueTvInactivity', 'minutesBrough': '0', 'endTimeMinusFiveMin': 'null', 'currentUser': 'null', 'enlapsedTime': 'null'};
        const connection = await getConnection();
        const result = await connection.query("UPDATE tvs SET ? WHERE tvNumber = ?", [tv, tvNumber]);

    } catch (error) {
        throw new Error('Error reseteando la base de datos tvs')
    }
};

const countTvRows = async ()=>{
    const connection = await getConnection();
    const totalRowsDb = await connection.query('SELECT COUNT(*) FROM tvs');
    const totalRows = totalRowsDb[0]['COUNT(*)'];
    return totalRows;
};

export const tvDbHelper = {
    dbChecker,
    getTvsInfo,
    getTv,
    isTvActive,
    writeTvDb,
    resetTvDb,
    isUserActive
}
// Requerimientos para la funcion auto check


// Debe de revisar si alguno de lo tvs que estan encendidos tiene el tiempo vencido
// En caso de estarlo crear una fila en el historial, resetear los campos de la tv y apagar la tv

// Debe de añadir a las tvs que el usuario sea distinto a anonimous en caso de que halla una diferencia
//de mas de un minuto entre el tiempo transcurrido escrito en la celda timeEnlapsed y el tiempo transcurrido
//calculado en ese momento.

// En caso de que halla una diferencia de mas de 3min entre la celda timeEnlapsed escrita en la base de datos
//y el calculo del tiempo transcurrido actualmente RESETEAR las tvs, lo cual implica que las tvs que esten
// encendidas con usuarios registrados deben de ser apagadas. 



//const timeChecker = ()=>{

// const checkTimeExpired = ()=>{}

//const resetTvsWithUser = ()=>{}

//const updateTimeEnlapsed = ()=>{}


//}

