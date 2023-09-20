const historyTable = document.getElementById('history-table');


const showResponse = (serverResponse)=>{
    try {
            const responseElement = document.getElementById('server-responses');
            responseElement.textContent = `${serverResponse}`;
        
            hiddeControls();
            hiddeAdminControls()
        
            //borrar despues de 10 segundos
            setTimeout(()=>{
                responseElement.textContent= '';
        
            }, 5000);
    } catch (error) {
        console.log(" Ha habido un error en showResponse");
    }
};

const sendActivateTv = async(event)=>{
    event.preventDefault();
    const {activateTvNumber, activateTvHours, activateTvMinutes, activateTvUser, activateTvPass} = event.target;

    const serverResponse = await fetch('/tv/', {
        method:"POST",
        headers:{'Content-type' : 'application/json'},
        body:JSON.stringify({
            'activateTvNumber': activateTvNumber.value, 
            'activateTvHours':activateTvHours.value, 
            'activateTvMinutes':activateTvMinutes.value,
            'activateTvUser':activateTvUser.value,
            'activateTvPass':activateTvPass.value
        })
    });

    const responseText = await serverResponse.text();


    if (serverResponse.status === 200){
        //resetear formulario
        event.target.reset();
    };
    showResponse(responseText);
    
};

const sendClientRegistration = async(event)=>{
    try {
        event.preventDefault();
        const {user, pass, passRepeat} = event.target;

        const path = `/client/`
        const serverResponse = await fetch(path, {
            method:"POST",
            headers:{'Content-type' : 'application/json'},
            body:JSON.stringify({
	            'user': user.value, 
	            'pass':pass.value, 
	            'passRepeat':passRepeat.value, 
	        })
        });

        const responseText = await serverResponse.text();


        if (serverResponse.status === 200){
            //resetear formulario
            event.target.reset();
        };
        showResponse(responseText);
    } catch (error) {
        console.log(error)
    }
};

const sendClientCheck = async(event)=>{
    try {
        event.preventDefault();
        const {user} = event.target;
    
        const path = `/client/${user.value}`
        const serverResponse = await fetch(path, {
            method:"GET",
            headers:{'Content-type' : 'application/json'},
        });
    
        const responseText = await serverResponse.text();
    
    
        if (serverResponse.status === 200){
            //resetear formulario
            event.target.reset();
        };
        showResponse(responseText);

    } catch (error) {
        console.log(error)
    }

    
    
};

const sendClientUpdate = async(event)=>{
    try {
	    event.preventDefault();
	    const {user, hours} = event.target;
	
	    const serverResponse = await fetch('/client/', {
	        method:"PATCH",
	        headers:{'Content-type' : 'application/json'},
	        body:JSON.stringify({
	            'user': user.value, 
	            'hours':hours.value, 
	        })
	    });
	
	    
	        
	    const responseText = await serverResponse.text();
	
	
	    if (serverResponse.status === 200){
	        //resetear formulario
	        event.target.reset();
	    };
	    showResponse(responseText);
    } catch (error) {
        console.log(error)
    }
};


const activateTvForm = document.getElementById('activate-tv__form');
const clientUpdateForm = document.getElementById('client-update__form');
const clientRegistrationForm = document.getElementById('client-registration__form');
const clientCheckForm = document.getElementById('client-check__form');


const activateTvButton = document.getElementById('activate-tv__button');
const clientUpdateButton = document.getElementById('client-update__button');
const clientRegistrationButton = document.getElementById('client-registration__button');
const clientCheckButton = document.getElementById('client-check__button');




activateTvForm.addEventListener('submit', sendActivateTv)
clientUpdateForm.addEventListener('submit', sendClientUpdate)
clientRegistrationForm.addEventListener('submit', sendClientRegistration)
clientCheckForm.addEventListener('submit', sendClientCheck)

const table = document.getElementById('history-table');
const historyButton = document.getElementById('history__button');
// clientUpdateForm.style.display = 'none';
// clientRegistrationForm.style.display = 'none';
// clientCheckForm.style.display = 'none';
// historyButton.style.display = 'none'

const hiddeControls= ()=>{
    activateTvForm.style.display = 'none';
    clientUpdateForm.style.display = 'none';
    clientRegistrationForm.style.display = 'none';
    clientCheckForm.style.display = 'none';

    historyTable.style.display = 'none';
    
};



hiddeControls()
hiddeAdminControls()

activateTvButton.addEventListener('click',()=>{
    hiddeAdminControls()
    hiddeControls()
    activateTvForm.style.display = 'grid';
});

clientUpdateButton.addEventListener('click',()=>{
    hiddeAdminControls()
    hiddeControls()
    clientUpdateForm.style.display = 'grid';
});

clientRegistrationButton.addEventListener('click',()=>{
    hiddeAdminControls()
    hiddeControls()
    clientRegistrationForm.style.display = 'grid';
});

clientCheckButton.addEventListener('click',()=>{
    hiddeAdminControls()
    hiddeControls()
    clientCheckForm.style.display = 'grid';
});







////////////////////////////////////////////////////////



const getHistory = async ()=>{
    try {

        hiddeControls()
        
        historyTable.style.display = 'flex';
        const serverResponse = await fetch('/history/', {method:'GET'});
        const historyJson = await serverResponse.json();
    
        historyTable.innerHTML = `
                            <thead><h2 class="table__title">Historial</h2></thead>
                            <tr class ="table__row table__row--head">
                                <td class = " table__head table__head--tvNumber"> Nº </td>
                                <td class = " table__head table__head--user">Usuario</td>
                                <td class = " table__head table__head--user">Empleado</td>
                                <td class = " table__head table__head--timeActive">Tiempo</td>
                                <td class = " table__head table__head--date">Fecha</td>
                                <td class = " table__head table__head--time">Hora</td>
                            </tr>`
        historyJson.forEach((historyRow, index) => {
            console.log('historyrow:', historyRow)
            let evenOrOdd = 'odd';
            if (index%2 === 0){
                evenOrOdd = 'even';
            };
            table.innerHTML += `
                <tr class = "table__row table__row--${evenOrOdd}">
                    <td class = "table__data table__data--tvNumber">${historyRow.tvNumber}</td>
                    <td class = "table__data table__data--user">${historyRow.clientName}</td>
                    <td class = "table__data table__data--employee">${historyRow.employeeName}</td>
                    <td class = "table__data table__data--timeActive">${historyRow.timeActive}</td>
                    <td class = "table__data table__data--date">${historyRow.date}</td>
                    <td class = "table__data table__data--time">${historyRow.time.slice(0, -6)}</td>
                </tr>`
        });
        console.log(historyJson )
    } catch (error) {
        console.log(error)
        
    }
};

historyButton.addEventListener('click',getHistory);


