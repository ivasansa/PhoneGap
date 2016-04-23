/*
 * Aplicació que fa us del dibuix de mapes
 * https://developers.google.com/maps/documentation/javascript/
 * phonegap create accelerometer com.myapp.accelerometer accelerometer
 * cordova platform add android
 * phonegap plugin add org.apache.cordova.geolocation
 * sergi.grau@fje.edu
 * versió 1.0 24.02.2016
 *
 */

var watchID = null;

var options = { timeout: 31000, enableHighAccuracy: true, maximumAge: 90000 };

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
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError, options);
        //watchID =  navigator.geolocation.watchPosition(onSuccess, onError, options);

        db = app.obtenirBaseDades();
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS RESTAURANTS(id INTEGER PRIMARY KEY AUTOINCREMENT, nom STRING, tipus STRING, img STRING)');
        }, app.error, app.obtenirItems);
        document.getElementById('desa').addEventListener('click', function (e) {
            app.desar();
        });


    },

    obtenirBaseDades: function () {
        return window.openDatabase("llistaBD", "1.0", "Llista BD", 200000);
    },
    desar: function () {
        var valor = document.getElementById('accio').value;
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO LLISTA (accio) VALUES ("' + valor + '")');
        }, app.error, app.obtenirItems);
        document.getElementById('accio').value = '';
    },
    error: function (error) {
        console.log('error');
        document.getElementById('missatge').innerHTML = "SQL Error: " + error.code;
    },
    obtenirItems: function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM LLISTA', [], app.consultar, app.error);
        }, app.error);
    },
    consultar: function (tx, resultats) {
        var len = resultats.rows.length;
        var sortida = '';
        for (var i = 0; i < len; i++) {
            sortida = sortida +
                '<li id="' + resultats.rows.item(i).id + '">' +
                resultats.rows.item(i).accio + '</li>';
        }
        document.getElementById('missatge').innerHTML = '<p>total items:</p>';
        document.getElementById('llista').innerHTML = '<ul>' + sortida + '</ul>';
    },


    //callback per a quan obtenim les dades de l'accelerometre
    onSuccess: function(posicio){


        var latLng  =
            new google.maps.LatLng(
                posicio.coords.latitude,
                posicio.coords.longitude);

        var opcionsMapa = {
            center: latLng,
            panControl: false,
            zoomControl: true,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(
            document.getElementById('mapa'),
            opcionsMapa
        );
        var marker = new google.maps.Marker({
            position: latLng,
            map: mapa });
        marker = new google.maps.Marker({
            position:  {lat: 41.409377,lng: 2.190170},
            map: mapa });

    },
    //callback per a un cas d'error
    onError: function(error){
        var tipusError;

        if(error.code) {
            switch(error.code)
            {
                case 1: // PERMISSION_DENIED
                    tipusError ='manca de permisos';
                    break;
                case 2: // POSITION_UNAVAILABLE
                    tipusError ='posició no disponible.';
                    break;
                case 3: // TIMEOUT
                    tipusError = 'Timeout';
                    break;
                default: // UNKOWN_ERROR
                    tipusError ='Error desconegut';
                    break; }
        }
        var element = document.getElementById('dades');
        element.innerHTML = tipusError;

    }
};
