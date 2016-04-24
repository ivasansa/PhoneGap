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

function Restaurant(nom, tipus, latitud, longitud, img) {
    this.nom = nom;
    this.tipus = tipus;
    this.latitud = latitud;
    this.longitud = longitud;
    this.img = img;

}
//
//function showValue(value){
//    radius = value;
//    console.log("radius");
//
//}



var radius = 12;
var len;
var marker;
var rest = [];
var markers = [];
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
            tx.executeSql('DROP TABLE RESTAURANTS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS RESTAURANTS' +
                            '(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            'nom, tipus, latitud, longitud, img)');
        }, app.error, app.desar, app.obtenirBaseDades);
        //document.getElementById('desa').addEventListener('click', function (e) {
        //    app.desar();
        //});
    },

    obtenirBaseDades: function () {
        return window.openDatabase("llistaBD", "1.0", "Llista BD", 200000);
    },
    desar: function () {
        //var valor = document.getElementById('accio').value;
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM RESTAURANTS');
            tx.executeSql('INSERT INTO RESTAURANTS (nom, tipus, latitud, longitud, img) VALUES ' +
                        '("Chino Juan", "Chino", "41.413469", "2.188765", "/img/chino_juan.jpg")');
            tx.executeSql('INSERT INTO RESTAURANTS (nom, tipus, latitud, longitud, img) VALUES ' +
                        '("Zozan Gourmet", "Turco", "41.398328", "2.205016", "/img/zozan.jpg")');
        }, app.error, app.obtenirItemsMapa);
        //document.getElementById('accio').value = '';
    },
    error: function (error) {
        console.log('error');
        document.getElementById('missatge').innerHTML = "SQL Error: " + error.code;
    },
    obtenirItems: function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM RESTAURANTS', [], app.consultar, app.error);
        }, app.error);
    },

    obtenirItemsMapa: function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM RESTAURANTS', [], app.consultarMapa, app.error);
        }, app.error);
    },

    consultar: function (tx, resultats) {
        len = resultats.rows.length;
        var sortida = '';
        for (var i = 0; i < len; i++) {
            sortida = sortida +
                '<li id="' + resultats.rows.item(i).id + '">' +
                resultats.rows.item(i).nom + '</li>';
            //var imgSortida = resultats.rows.item(i).img;
        }
        //document.getElementById('missatge').innerHTML = '<p>total items:</p>';
        //document.getElementById('llista').innerHTML = '<ul>' + sortida + '</ul>';
        //document.getElementById('imagen').innerHTML = '<img src="' + imgSortida + '">';

        //<img src="smiley.gif" alt="Smiley face" height="42" width="42">
        //    Try it Yourself »

    },


    consultarMapa: function (tx, resultats) {
        len = resultats.rows.length;
        var sortida = '';
        for (var i = 0; i < len; i++) {
            sortida = sortida +
                '<li id="' + resultats.rows.item(i).id + '">' +
                resultats.rows.item(i).nom + '</li>';

            var r = new Restaurant(resultats.rows.item(i).nom, resultats.rows.item(i).tipus, resultats.rows.item(i).latitud,
                                    resultats.rows.item(i).longitud, resultats.rows.item(i).img);
            rest.push(r);
            //console.log("mapa");
            //var imgSortida = resultats.rows.item(i).img;
        }
        //document.getElementById('missatge').innerHTML = '<p>total items:</p>';
        //document.getElementById('llista').innerHTML = '<ul>' + sortida + '</ul>';
        //document.getElementById('imagen').innerHTML = '<img src="' + imgSortida + '">';



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
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(
            document.getElementById('mapa'),
            opcionsMapa
        );
        marker = new google.maps.Marker({
            position: latLng,
            map: mapa });

        //mapa.setZoom(radius);

        markers.push(marker);
        //marker = new google.maps.Marker({
        //    position:  {lat: 41.409377,lng: 2.190170},
        //    map: mapa });
        //app.obtenirItemsMapa();

        //console.log(rest);
        //console.log(rest.length);
        //console.log(rest[1]);


        //rest.forEach( function (arrayItem){
        //    var x = arrayItem.latitud;
        //    console.log(x);
        //});





        for(var i = 0; i<rest.length; ++i){
            console.log("hols"+rest[i].latitud);
            marker = new google.maps.Marker({
                position:  {lat: parseFloat(rest[i].latitud),lng: parseFloat(rest[i].longitud)},
                label:rest[i].nom,
                map: mapa
            });
            //google.maps.event.addListener(marker, 'click', function(){
            //    console.log(marker.nom);
            //});
            markers.push(marker);

            console.log(rest[i].latitud);


            var img = document.createElement("img");
            img.src = rest[i].img;

            document.getElementById("llista").appendChild(img);


        }



        //google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //    return function() {
        //        //infowindow.setContent(markers[i]);
        //        //infowindow.open(map, marker[i]);
        //        console.log(markers[i].nom);
        //    }
        //})(marker, i));
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
