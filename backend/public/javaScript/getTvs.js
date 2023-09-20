const getTvContainer = async ()=>{
    try {

        const serverResponse = await fetch('/tv/', {method:'GET'});
    
        const serverResponseJson = await serverResponse.json();
   
        const responseData = serverResponseJson.map((tv) => {
            let tvLeftTime = document.getElementById(`tv__leftTime--${String(tv.tvNumber)}`)
            tvLeftTime.textContent = `${tv.leftTime}`;


            if(tv.state === 'active' ){

                document.getElementById(`tv__close-icon--${tv.tvNumber}`)
                .style.display = 'grid';
                document.getElementById(`tv__add-icon--${tv.tvNumber}`)
                .style.display = 'none';
                
                tvLeftTime.classList.add('tv--active');
                tvLeftTime.classList.remove(`tv--inactive`);
                tvLeftTime.classList.remove(`tv--unlimited`);

            };
            if(tv.state === 'unlimited' ){

                document.getElementById(`tv__close-icon--${tv.tvNumber}`)
                .style.display = 'grid';
                document.getElementById(`tv__add-icon--${tv.tvNumber}`)
                .style.display = 'none';
                
                tvLeftTime.classList.add('tv--unlimited');
                tvLeftTime.classList.remove(`tv--inactive`);
                tvLeftTime.classList.remove(`tv--active`);

            }


            if(tv.state === 'inactive'){
                document.getElementById(`tv__close-icon--${tv.tvNumber}`)
                .style.display = 'none';
                document.getElementById(`tv__add-icon--${tv.tvNumber}`)
                .style.display = 'grid';

                tvLeftTime.classList.add('tv--inactive');

                tvLeftTime.classList.remove(`tv--active`);
                tvLeftTime.classList.remove(`tv--unlimited`);
                tvLeftTime.classList.remove(`tv__leftTime--completado`);    
                
            }

            //agregar nueva clase si solo quedan 5 min
            if (tv.endTimeMinusFiveMin === 'completado'){
                tvLeftTime.classList.add(`tv__leftTime--completado`);                  
            }

        });

       

        
        
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}
const autoGetTvs = async ()=>{

    setTimeout(async ()=>{
        await getTvContainer()
        tvsContainer.style.display = 'grid';
        await autoGetTvs()
    }, 1000)
    
}

const tvsContainer = document.getElementById('tvs-container')
tvsContainer.style.display = 'none';

autoGetTvs()