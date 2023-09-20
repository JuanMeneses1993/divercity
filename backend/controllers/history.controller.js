import { historyDbHelper } from "../helpers/history.db.helper";
import { json } from "body-parser";

const getTvHistory = async(req, res)=>{
    const last10Rows = await historyDbHelper.getLast10Rows();
    res.json(last10Rows);
};

export const historyController = {
    getTvHistory,
}
