/*
 * Aplicació que descarrega un fitxer remot a local, cal afegir el plugin
 * phonegap create fitxers edu.fje.daw2 fitxers
 * cordova platform add android
 * phonegap plugin add org.apache.cordova.file
 * phonegap plugin add org.apache.cordova.file-transfer
 * sergi.grau@fje.edu
 * versió 1.0 11.04.2016
 *
 */

var directori;

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
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.accedirFS, null);
    document.getElementById('desa').addEventListener('click', function (e) {
      app.desar();
    });
  },

  obtenirNomFitxer: function (url) {
    if (url) {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1) {
        return m[1] + '.' + url.split('.').pop();
      }
    }
    return "";
  },

  desar: function () {
    var url = document.getElementById('url').value;
    var nomFitxer = app.obtenirNomFitxer(url);
    document.getElementById('missatge').innerHTML='Descarregant ' + nomFitxer;
    var fileTransfer = new FileTransfer();
    fileTransfer.download(
        url,
        directori.fullPath + '/' + nomFitxer,
        function (entry) {
          document.getElementById('missatge').innerHTML='Descarrega completa, desat a: ' + entry.fullPath;
        },
        function (error) {
          alert("Problema descarrega " + JSON.stringify(error));
        });
  },
  accedirFS: function (sistemaFitxers) {
    sistemaFitxers.root.getDirectory('descarregues', {create: true}, function (dir) {
      directori = dir;
    }, function (error) {
      document.getElementById('missatge').innerHTML='Problema: ' + error.code;
    });

  }
};