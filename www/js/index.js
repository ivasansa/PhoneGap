/*
* Aplicació que mostra quan el dispositiu està disponible
* sergi.grau@fje.edu
* versió 1.0 24.02.2016
*
*/
var app = {
    // Constructor
    initialize: function() {
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
        app.receivedEvent('estat ok');
    },
    // Actualitzem DOM quan rebem un esdeveniment
    receivedEvent: function(id) {
        document.getElementById(id).innerHTML='ok'; 
        console.log('Received Event: ' + id);
    },
};
