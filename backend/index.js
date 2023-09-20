import app from "./app";
import { tvDbHelper } from "./helpers/tv.db.helper";
import path from "path"

const main = async () => {
    app.listen(app.get("port"));
    console.log(`Server on port ${app.get("port")}`);

    //Actualizar automaticamente la base de datos en caso de que se halla cumplido algun tiempo
    while (true){
        try {
            await tvDbHelper.dbChecker();
            //espera 100ms para volver a entrar en el bucle
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
            
        } catch (error) {
            console.log(error);
            break;
        };

    };
};


main();

