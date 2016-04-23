/*
 * Aplicació que fa us de l'accelerometre,
 * animant un punt per la pantalla.
 * cal afegir el plugin
 * phonegap create accelerometer com.myapp.accelerometer accelerometer
 * cordova platform add android
 * phonegap plugin add org.apache.cordova.device-motion
 * sergi.grau@fje.edu
 * versió 1.0 24.02.2016
 *
 */



var app = {
    // Constructor
    initialize: function() {
        var watchID = null;
        var radius  = 50;
// Initial X Y positions
        var x = 0;
        var y = 0;
// Velocity / Speed
        var vx = 0;
        var vy = 0;
// Acceleration
        var accelX = 0;
        var accelY = 0;
// Multiplier to create proper pixel measurements
        var vMultiplier =   100;
        this.bindEvents();

    },
    // Esdeveniments possibles en la inicialització de l'app:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // callback per a esdeveiniment deviceready
    // this representa l'esdeveniment
    onDeviceReady: function() {
        var options = { frequency: 3000 };
        watchID = navigator.accelerometer.watchAcceleration(app.onSuccess, app.onError, options);



    },
    // Actualitzem DOM quan rebem un esdeveniment
    receivedEvent: function(id) {
        document.getElementById(id).innerHTML='ok';
        console.log('Received Event: ' + id);
    },
    //callback per a quan obtenim les dades de l'accelerometre
    onSuccess: function(acceleracio){
        accelX = acceleracio.x;
        accelY = acceleracio.y;
        vy = vy + -(accelY);
        vx = vx + accelX;
        y = parseInt(y + vy * 100);
        x = parseInt(x + vx * 100);
        if (x<0) { x = 0; vx = 0; }
        if (y<0) { y = 0; vy = 0; }
        if (x>document.documentElement.clientWidth-radius) {
            x = document.documentElement.clientWidth-radius; vx = 0;
        }
        if (y>document.documentElement.clientHeight-radius) {
            y = document.documentElement.clientHeight-radius; vy = 0;
            // Apply the position to the dot element
            punt.style.top  = y + "px";
            punt.style.left = x + "px";

        }
    },
    //callback per a un cas d'error
    onError: function(){
        alert('error');
    }
};
