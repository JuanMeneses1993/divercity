
var cmd = require('node-cmd');

const tvs = {
    1: '192.168.1.252',
    2: '192.168.1.252',
    3: '192.168.1.252',
    4: '192.168.1.252',
    5: '192.168.1.252',
    6: '192.168.1.252',
    7: '192.168.1.252',
    8: '192.168.1.252',
    9: '192.168.1.252',
    10: '192.168.1.252'
}

let  activateTv = (tvNumber)=>{
    try {
        console.log(`Activando Tv ${tvNumber}`)
    //const syncDir = cmd.runSync(`adb connect ${tvs[tvNumber]} & adb shell input keyevent 244`);
    //console.log(`Salida de la consola:\n ${syncDir.data}`);
        
    } catch (error) {
        console.log('Error activando tv')
    }

}

let deactivateTv = (tvNumber)=>{
    console.log(`Desactivando tv: ${tvNumber}`)
    //const syncDir= (`adb connect ${tvs[tvNumber]} & adb shell am start -n org.videolan.vlc/org.videolan.vlc.gui.video.VideoPlayerActivity -e input-repeat 3 -a android.intent.action.VIEW -d file:////storage/emulated/0/Downloader/pp.mp4`)
    //console.log(`Salida de la consola ${syncDir.data}`);
}

let showFiveMinAd = (tvNumber)=>{
    console.log(`Mostrando anuncio de 5 min: ${tvNumber}`)
}

export const tvHelper = {
    activateTv,
    deactivateTv,
    showFiveMinAd
}


// activar tvadb connect 192.168.1.252
// entrar al hdmi adb shell input keyevent 244

//te quedan 5 min adb shell am start -n org.videolan.vlc/org.videolan.vlc.gui.video.VideoPlayerActivity -e input-repeat 3 -a android.intent.action.VIEW -d file:////storage/emulated/0/Downloader/a5.mp4

// desactivar adb shell am start -n org.videolan.vlc/org.videolan.vlc.gui.video.VideoPlayerActivity -e input-repeat 3 -a android.intent.action.VIEW -d file:////storage/emulated/0/Downloader/pp.mp4