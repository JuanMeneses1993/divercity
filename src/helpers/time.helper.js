
import {isAfter,differenceInSeconds, addMinutes, startOfWeek} from 'date-fns'
import{format, toDate, utcToZonedTime} from 'date-fns-tz'


function getDateStartOfYear(){
    const currentDate = getCurrentDate();
    const currentDateFormated = formatDate(currentDate);
    const date = currentDateFormated.slice(0, 5) + '01-01';
    return date;
};

function getDateStartOfMonth(){
    const currentDate = getCurrentDate();
    const currentDateFormated = formatDate(currentDate);
    const startOfMonthDate = currentDateFormated.slice(0, 8) + '01' + currentDateFormated.slice(10);
    const date = startOfMonthDate.slice(0, 10);
    return date;
};

function getDateStartOfWeek(){

    const dateFormated = formatDate(startOfWeek(getCurrentDate())).slice(0, 10);
    return dateFormated;

};

function getStartDate (filter){

    try {
        if (!filter) return;

        if (filter === 'year') return getDateStartOfYear();
        else if (filter === 'month') return getDateStartOfMonth();
        else if (filter === 'week') return getDateStartOfWeek();
        else if (filter === 'day') return formatDate(getCurrentDate()).slice(0, 10);
    } catch (error) {
        throw new Error('Error en getStartDate')
    }



};


function getCurrentDate(){
//Devuelve la fecha y la hora actual en gmt+0
//Devuelve un objeto de la clase Date
    const parsedDate = toDate(new Date());
    const azoresDate = utcToZonedTime(parsedDate, 'Africa/Abidjan');
    const currentDate = format(azoresDate, 'yyyy-MM-dd HH:mm:ssxxx', { timeZone: 'Africa/Abidjan' });
    const currentDateParsed = parseDate(currentDate);
    
    return currentDateParsed;
    
};

function parseDate(date){
    //Devuelve un objeto Date con la fecha que le pasemos 
    //en el formato 'yyyy-MM-dd HH:mm:ssxxx'
    const parsed = toDate(new Date(date), { timeZone: 'Africa/Abidjan' });
    
    return parsed;
}

function formatDate(date){
    const parsedDate = toDate(new Date(date));
    const azoresDate = utcToZonedTime(parsedDate, 'Africa/Abidjan');
    const formated = format(azoresDate, 'yyyy-MM-dd HH:mm:ssxxx', { timeZone: 'Africa/Abidjan' });
    
    return formated;
};

function getTimeLeft(endTime){
    //recibe una fecha como parametro 
    //y calcula el tiempo que falta para esa hora desde la hora actual
    //devuelve un contador en el formato HH:mm:ss

    //si el valor que se le pasa es completado devuelve 00:00:00
    if (endTime === 'completado'){
        return 'completado';
    };

    //revisar si la fecha final es mayor que la actual
    const endTimeParsed = parseDate(endTime);
    if (isAfter(getCurrentDate(), endTimeParsed)){
        //revisar y actualizar todos los end time
        //dataBaseHelper.updateTimeEnd()
        //y devolver 00:00:00
        return 'completado'
    };
    //pasar el tiempo restante a segundos
    const secondsLeft = differenceInSeconds(endTimeParsed, getCurrentDate());
    
    //transformar los segundos a un contador en formato HH:mm:ss
    const leftTime = secondsTotimer(secondsLeft);
    return leftTime;
    
};

function getTimeEnlapsed(startTime, endTime=getCurrentDate()){

    const startTimeParsed = parseDate(startTime)

    const secondsEnlapded = differenceInSeconds(endTime, startTimeParsed )
    
    //transformar los segundos a un contador en formato HH:mm:ss
    const enlapsedTime = secondsTotimer(secondsEnlapded)
    return enlapsedTime
    
};

const secondsTotimer = (seconds)=>{

    const date = new Date(null);
    //agregar los segundos
    date.setSeconds(seconds); 
    const formated = date.toISOString().slice(11, 19);
    return formated
};

const timerToMinutes = (timer)=>{
    const hours = Number(timer.slice(0,2));
    const minutes = Number(timer.slice(3,5));

    const totalMinutes = (hours * 60) + minutes;
    return totalMinutes;
};

const calculateEndingTime = (minutesToAdd) =>{
    const currentDate = getCurrentDate()
    const added = addMinutes(currentDate, minutesToAdd)
    const formated = formatDate(added)
    return formated
};

export const timeHelper ={
    getCurrentDate,
    parseDate,
    formatDate,
    getTimeLeft,
    calculateEndingTime,
    getTimeEnlapsed,
    timerToMinutes,
    getStartDate,
    secondsTotimer
}