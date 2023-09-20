import { timeHelper } from "./helpers/time.helper";
import { historyDbHelper} from "./../src/helpers/history.db.helper"
import { tvDbHelper } from "./helpers/tv.db.helper";
import { userDbHelper } from "./helpers/users.db.helper";
import { promiseImpl } from "ejs";



const main = async()=>{
    const userNames = await userDbHelper.getNames();

    const getStats = async (user)=>{
        const yearHistory = await historyDbHelper.getHistory(user, 'year');
        const monthHistory = await historyDbHelper.getHistory(user, 'month');
        const weekHistory = await historyDbHelper.getHistory(user, 'week');
        const dayHistory = await historyDbHelper.getHistory(user, 'day');
    
        const totalHoursYear = historyDbHelper.addTotalHours(yearHistory);
        const totalHoursMonth = historyDbHelper.addTotalHours(monthHistory);
        const totalHoursWeek = historyDbHelper.addTotalHours(weekHistory);
        const totalHoursDay = historyDbHelper.addTotalHours(dayHistory);
    
        const userRole = await userDbHelper.getUserRole(user)
        let userFormated;
        if (userRole === 'admin'){ userFormated = 'admin ' + user }
        else {userFormated = user};
    
        const row = {
            'user' : userFormated,
            'role' : userRole,
            'year' : totalHoursYear,
            'month' : totalHoursMonth,
            'week' : totalHoursWeek,
            'day' : totalHoursDay,
        };
        return row
    }

    const stats = await Promise.all(userNames.map(getStats))

    console.log("stats: ", stats);
};
main()


















//Variables del empleado en la base de datos

// id
// userName
// password
// isActive
// totalMinutesSold
// MinutesSoldToday
// MinutesSoldThisMonth


//Variables del historial en la base de datos

// mode
// timeActive
// clientName
// employeeName
// date
// hour

//Variables de las sesiones en la base de datos





