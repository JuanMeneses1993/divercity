
const showUserPass =(event)=>{
        //ativar el boton
        withUser.style.backgroundColor = 'var(--selector-active-color)';
        //desactivar el otro boton
        withOutUser.style.backgroundColor = 'var(--selector-inactive-color)';
        
        //mostrar usuario y pass
        userInput.style.visibility= "visible";
        passInput.style.visibility= "visible";


        //cambiar valores de user y pass para procesarlo en el servidor
        userInput.value='';
        passInput.value= '';

}

const hiddeUserPass = ()=>{
    //ativar el boton
    withUser.style.backgroundColor = 'var(--selector-inactive-color)';
    //desactivar el otro boton
    withOutUser.style.backgroundColor = 'var(--selector-active-color)';
    
    //ocultar usuario y pass
    userInput.style.visibility= "hidden";
    passInput.style.visibility= "hidden";
    
    //cambiar valores de user y pass para procesarlo en el servidor
    userInput.value='none';
    passInput.value= 'none';
}

let withUser = document.getElementById("selector-si")
let withOutUser = document.getElementById("selector-no")
const userInput = document.getElementById('form-user');
const passInput = document.getElementById('form-pass');

withUser.addEventListener('click',showUserPass);
withOutUser.addEventListener('click',hiddeUserPass);
