/*
 * Aplicació que manipula una base de dades, No cal plugin
 * doncs utilitza la base de dades del propi navegador
 * phonegap create baseDades edu.fje.daw2 baseDades
 * cordova platform add android
 * sergi.grau@fje.edu
 * versió 1.0 13.04.2016
 *
 */

var app = {
  // Constructor
  initialize: function () {
    app.bindEvents();
  },
  // Esdeveniments possibles en la inicialització de l'app:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', app.onDeviceReady, false);
  },
  // callback per a esdeveiniment deviceready
  // app representa l'esdeveniment
  onDeviceReady: function () {

    db = app.obtenirBaseDades();
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LLISTA(id INTEGER PRIMARY KEY AUTOINCREMENT, accio)');
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
  }
}