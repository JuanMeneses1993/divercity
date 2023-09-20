

//formularios
const activateTvForm = document.getElementById('activate-tv__form');
const clientUpdateForm = document.getElementById('client-update__form');
const clientRegistrationForm = document.getElementById('client-registration__form');
const clientCheckForm = document.getElementById('client-check__form');
let newEmployee = document.getElementById('new-employee__form');
let deleteEmployee = document.getElementById('delete-employee__form');

//tablas
let statistics = document.getElementById('statistics');
const historyTable = document.getElementById('history-table');

//botones
const historyButton = document.getElementById('history__button');
const navButtonStatistics = document.getElementById('nav__button--statistics');
const activateTvButton = document.getElementById('activate-tv__button');
const clientUpdateButton = document.getElementById('client-update__button');
const clientRegistrationButton = document.getElementById('client-registration__button');
const clientCheckButton = document.getElementById('client-check__button');
const navButtonNewEmployee = document.getElementById('nav__button--new-employee');
const navButtonDeleteEmployee = document.getElementById('nav__button--delete-employee');

const showResponse = (serverResponse)=>{
    const responseElement = document.getElementById('server-responses');
    responseElement.textContent = `${serverResponse}`;

  

    //borrar despues de 10 segundos
    setTimeout(()=>{
        responseElement.innerHTML= '';

    }, 10000);

};

const sendNewEmployeeForm = async(event)=>{
    console.log('Dentro de agregar empleado')

    event.preventDefault();
    const {user, pass, passRepeat} = event.target;

    const serverResponse = await fetch('/users/', {
        method:"POST",
        headers:{'Content-type' : 'application/json'},
        body:JSON.stringify({
            'user': user.value, 
            'pass': pass.value, 
            'passRepeat': passRepeat.value,
        })
    });

    const responseText = await serverResponse.text();


    if (serverResponse.status === 200){
        //resetear formulario
        event.target.reset();
    };

    showResponse(responseText);
};

const sendDeleteEmployeeForm = async(event)=>{
    event.preventDefault();
    const {user} = event.target;

    const serverResponse = await fetch('/users/', {
        method:"DELETE",
        headers:{'Content-type' : 'application/json'},
        body:JSON.stringify({
            'user': user.value, 
        })
    });

    const responseText = await serverResponse.text();


    if (serverResponse.status === 200){
        //resetear formulario
        event.target.reset();
    };

    showResponse(responseText);
};

const getStatistics = async ()=>{
    try {
        hiddeControls()
        
        statistics.style.display = 'flex';
        const serverResponse = await fetch('/users/', {method:'GET'});
        const historyJson = await serverResponse.json();

        statistics.innerHTML = `
                            <thead><h2 class="table__title">Estadisticas</h2></thead>
                            <tr class ="table__row table__row--head">
                                <td class = " table__head table__head--user"> Usuario </td>
                                <td class = " table__head table__head--role">Role</td>
                                <td class = " table__head table__head--year">Año</td>
                                <td class = " table__head table__head--month">Mes</td>
                                <td class = " table__head table__head--week">Semana</td>
                                <td class = " table__head table__head--day">Dia</td>
                            </tr>`
        historyJson.forEach((row, index) => {

            let evenOrOdd = 'odd';
            if (index%2 === 0){
                evenOrOdd = 'even';
            };

            if(row.user === 'Total'){
                statistics.innerHTML += `
                <tr class = "table__row table__row--total">
                    <td class = "table__data table__data--user"></td>
                    <td class = "table__data table__data--total">${row.user}</td>
                    <td class = "table__data table__data--total ">${row.year}</td>
                    <td class = "table__data table__data--total">${row.month}</td>
                    <td class = "table__data table__data--total">${row.week}</td>
                    <td class = "table__data table__data--total">${row.day}</td>
                </tr>`
                return
            }
            statistics.innerHTML += `
                <tr class = "table__row table__row--${evenOrOdd}">
                    <td class = "table__data table__data--user">${row.user}</td>
                    <td class = "table__data table__data--role">${row.role}</td>
                    <td class = "table__data table__data--year">${row.year}</td>
                    <td class = "table__data table__data--month">${row.month}</td>
                    <td class = "table__data table__data--week">${row.week}</td>
                    <td class = "table__data table__data--day">${row.day}</td>
                </tr>`
        });
        console.log(historyJson )
    } catch (error) {
        console.log(error)
        
    }
};

const getHistory = async ()=>{
    try {
        hiddeControls()
        
        historyTable.style.display = 'flex';
        const serverResponse = await fetch('/history/', {method:'GET'});
        const historyJson = await serverResponse.json();
    
        historyTable.innerHTML = `
                            <thead><h2 class="table__title">Historial</h2></thead>
                            <tr class ="table__row table__row--head">
                                <td class = " table__head table__head--tvNumber"> Equipo </td>
                                <td class = " table__head table__head--user">Usuario</td>
                                <td class = " table__head table__head--user">Empleado</td>
                                <td class = " table__head table__head--timeActive">Tiempo</td>
                                <td class = " table__head table__head--date">Fecha</td>
                                <td class = " table__head table__head--time">Hora</td>
                            </tr>`
        historyJson.forEach((historyRow, index) => {

            let evenOrOdd = 'odd';
            if (index%2 === 0){
                evenOrOdd = 'even';
            };
            historyTable.innerHTML += `
                <tr class = "table__row table__row--${evenOrOdd}">
                    <td class = "table__data table__data--tvNumber">${historyRow.tvNumber}</td>
                    <td class = "table__data table__data--user">${historyRow.clientName}</td>
                    <td class = "table__data table__data--employee">${historyRow.employeeName}</td>
                    <td class = "table__data table__data--timeActive">${historyRow.timeActive}</td>
                    <td class = "table__data table__data--date">${historyRow.date}</td>
                    <td class = "table__data table__data--time">${historyRow.time.slice(0, -6)}</td>
                </tr>`
        });

    } catch (error) {
        console.log(error)
        
    }
};

const sendActivateTv = async(event)=>{
    hiddeControls()
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
    hiddeControls()
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



const showElement = (event)=>{
    hiddeControls()
    const buttonName = event.target.id.slice(13);
    const elementId = buttonName + '__form';
    
    document.getElementById(elementId)
    .style.display = 'grid';
};

const hiddeControls= ()=>{
    
    newEmployee.style.display = 'none';
    deleteEmployee.style.display = 'none';
    statistics.style.display = 'none';
    activateTvForm.style.display = 'none';
    clientUpdateForm.style.display = 'none';
    clientRegistrationForm.style.display = 'none';
    clientCheckForm.style.display = 'none';

    historyTable.style.display = 'none';
    
};


document.getElementById('new-employee__form')
.addEventListener('submit', sendNewEmployeeForm);

document.getElementById('delete-employee__form')
.addEventListener('submit', sendDeleteEmployeeForm);

historyButton.addEventListener('click',getHistory);

activateTvForm.addEventListener('submit', sendActivateTv)
clientUpdateForm.addEventListener('submit', sendClientUpdate)
clientRegistrationForm.addEventListener('submit', sendClientRegistration)
clientCheckForm.addEventListener('submit', sendClientCheck)
navButtonNewEmployee.addEventListener('click', showElement);
navButtonDeleteEmployee.addEventListener('click', showElement);
navButtonStatistics.addEventListener('click', getStatistics);








activateTvButton.addEventListener('click',()=>{
    hiddeControls()
    activateTvForm.style.display = 'grid';
});

clientUpdateButton.addEventListener('click',()=>{
    hiddeControls()
    clientUpdateForm.style.display = 'grid';
});

clientRegistrationButton.addEventListener('click',()=>{
    hiddeControls()
    clientRegistrationForm.style.display = 'grid';
});

clientCheckButton.addEventListener('click',()=>{
    hiddeControls()
    clientCheckForm.style.display = 'grid';
});


const addListener = async()=>{
    const serverResponse = await fetch('/tv/', {method:'GET'});
    const serverResponseJson = await serverResponse.json();
    serverResponseJson.forEach(tv => {

        const activateTv = async(event)=>{
            showUserPass()
            hiddeControls()
            document.getElementById('activate-tv__form')
            .style.display= 'grid';
            const tvNumberField = document.getElementById('activateTvNumber')
            tvNumberField.value = event.target.id.slice(14);

        }

        document.getElementById(`tv__add-icon--${tv.tvNumber}`)
        .addEventListener('click', activateTv)
    });


}
addListener()

hiddeControls()

