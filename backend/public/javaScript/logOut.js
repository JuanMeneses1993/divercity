const logOut = async ()=>{
    try {
        await fetch(`/login`, {method:'DELETE'})
        window.location.reload()
    } catch (error) {
        console.log(error)
    };
};

document.getElementById('log-out__button')
.addEventListener('click', logOut);