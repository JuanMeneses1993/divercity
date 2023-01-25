const deactivateTv = async (tvNumber)=>{
    console.log(`desactivando tv Numero: ${tvNumber}`)
    try {
        let serverResponse = await fetch(`/tv/${tvNumber}`, {method:'DELETE'})
        console.log( await serverResponse.text()) 
    } catch (error) {
        console.log(error)
    }
}