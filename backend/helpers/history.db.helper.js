import { Connection } from "promise-mysql";
import { getConnection } from "../database/database";
import { tvDbHelper } from "./tv.db.helper"; 
import { timeHelper } from "./time.helper";
import { userDbHelper } from "./users.db.helper";

const createHistoryRow = async(tvNumber)=>{
    try {
        const { currentUser,
                state,
                minutesBrough,
                startTime,
                endTime,
                endTimeMinusFiveMin,
                employeeName} = await tvDbHelper.getTv(tvNumber);

        if (startTime === 'null') return;
        
        const timeActive = timeHelper.getTimeEnlapsed(startTime);
        const currentTime = timeHelper.formatDate(timeHelper.getCurrentDate());
        const timeActiveFormated = timeActive.slice(0, 6) + '00';
        const clientName = currentUser;

        //Escribir en la base de datos
        const connection = await getConnection();
        const historyRow = {'tvNumber' : tvNumber,
                            'mode' : state,
                            'timeActive' : timeActiveFormated,
                            'clientName' : clientName,
                            'employeeName' : employeeName ,
                            'date' : currentTime.slice(0, 10),
                            'time' : currentTime.slice(11)};

        await connection.query(`INSERT INTO historial SET ?`, historyRow);

    } catch (error) {
        console.log(error)
        throw new Error('Error al escribir historial')
    }

}

const getLast10Rows = async ()=>{

    const connection = await getConnection();
    const last10Rows = await connection.query(`SELECT * FROM historial ORDER BY id DESC LIMIT 10`);

    return last10Rows;
};

const addTotalHours = (history)=>{
    const hours = history.map(row =>{ return row.timeActive.slice(0, 2)})
                    .reduce((cont, hour) =>{return cont + Number(hour)},0);

    const minutes = history.map(row =>{ return row.timeActive.slice(3, 5)})
                    .reduce((cont, minute) =>{return cont + Number(minute)},0);


    const convertToTimmer = (num)=>{
        const numFormated = String(num)
        if (numFormated.length === 1){
            return '0' + numFormated;
        }
        else return numFormated
    }

    const MINUTES_IN_HOUR = 60
    const totalHours = hours + (Math.floor(minutes/MINUTES_IN_HOUR));
    const totalMinutes = ((minutes / MINUTES_IN_HOUR) - Math.floor(minutes/MINUTES_IN_HOUR)) * MINUTES_IN_HOUR
    // const timmerMinutes = convertToTimmer(   );
    const timmerHours = convertToTimmer(totalHours);
    const timmerMinutes  = convertToTimmer(totalMinutes);
    const timmer = timmerHours + ':' + timmerMinutes.slice(0, 2)

    return timmer
};

const getHistory = async(employeeName, filter )=>{
    try {

        const startDate = timeHelper.getStartDate(filter);
        const currentDate = timeHelper.formatDate(timeHelper.getCurrentDate()).slice(0, 10);
        
        const connection = await getConnection();
        const dbResponse = async () => {
            if (!employeeName && !filter) return await connection.query(`SELECT * FROM historial `);
            else if (!employeeName && filter) return  await connection.query(`SELECT * FROM historial WHERE date >= '${startDate}' AND date <= '${currentDate}'`);
            else if (employeeName && !filter)  await connection.query(`SELECT * FROM historial WHERE employeeName = '${String(user)}' `);
            else if (employeeName && filter) return await connection.query(`SELECT * FROM historial WHERE date >= '${startDate}' AND date <= '${currentDate}' AND employeeName = '${employeeName}'`);
        };

        const history = await dbResponse();
        return history.map(row=>{return row});

    } catch (error) {

        throw new Error('Error al consultar historial')
    };
};

const getStatistics = async()=>{
    try {
	    const userNames = await userDbHelper.getNames();
	
	    const getUserStatistics = async (user)=>{
	        const yearHistory = await getHistory(user, 'year');
	        const monthHistory = await getHistory(user, 'month');
	        const weekHistory = await getHistory(user, 'week');
	        const dayHistory = await getHistory(user, 'day');
	    
	        const totalHoursYear = addTotalHours(yearHistory);
	        const totalHoursMonth = addTotalHours(monthHistory);
	        const totalHoursWeek = addTotalHours(weekHistory);
	        const totalHoursDay = addTotalHours(dayHistory);
	    
	        const userRole = await userDbHelper.getUserRole(user)
	    
	        const row = {
	            'user' : user,
	            'role' : userRole,
	            'year' : totalHoursYear,
	            'month' : totalHoursMonth,
	            'week' : totalHoursWeek,
	            'day' : totalHoursDay,
	        };
	     
            return row;
        };
	    const getTotalStatistics = async ()=>{
	        const totalYearHistory = await getHistory('', 'year');
	        const totalMonthHistory = await getHistory('', 'month');
	        const totalWeekHistory = await getHistory('', 'week');
	        const totalDayHistory = await getHistory('', 'day');

	        const totalHoursYear = addTotalHours(totalYearHistory);
	        const totalHoursMonth = addTotalHours(totalMonthHistory);
	        const totalHoursWeek = addTotalHours(totalWeekHistory);
	        const totalHoursDay = addTotalHours(totalDayHistory);
	    
	        
	        const row = {
	            'user' : 'Total',
	            'role' : '',
	            'year' : totalHoursYear,
	            'month' : totalHoursMonth,
	            'week' : totalHoursWeek,
	            'day' : totalHoursDay,
	        };
	     
            return row;
        };

	    const userStatistics = await Promise.all(userNames.map(getUserStatistics))
	    const totalStatistics = await getTotalStatistics()
        userStatistics.push(totalStatistics)
        return userStatistics
    
    }
     catch (error) {
        return (String(error))
    }


};
export const historyDbHelper = {
    createHistoryRow,
    getLast10Rows,
    getHistory,
    addTotalHours,
    getStatistics
}