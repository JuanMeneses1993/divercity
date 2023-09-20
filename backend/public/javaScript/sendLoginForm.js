const showResponse = (serverResponse)=>{
    const responseElement = document.getElementById('server-responses');
    responseElement.textContent = `${serverResponse}`;

    //hiddeAll();

    //borrar despues de 10 segundos
    setTimeout(()=>{
        responseElement.innerHTML= '';

    }, 10000);
};

const sendLoginForm = async(event)=>{
    event.preventDefault();
    const {user, pass} = event.target;

    const serverResponse = await fetch('/login/', {
        method:"POST",
        headers:{'Content-type' : 'application/json'},
        body:JSON.stringify({
            'user': user.value, 
            'pass':pass.value, 
        })
    });
    textResponse = await serverResponse.text();
    if (textResponse !== 'ok'){
        showResponse(textResponse);
        return;
    }

    window.location.replace("/panel")
};

document.getElementById('login__form')
.addEventListener('submit', sendLoginForm);
