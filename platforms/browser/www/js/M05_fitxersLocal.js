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
var objecteFitxer; //apuntador al fitxer

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


  desar: function () {
    objecteFitxer.createWriter(app.escriureFitxer, error);
  },
  accedirFS: function (sistemaFitxers) {
    sistemaFitxers.root.getFile("readme.txt", {create: true, exclusive: false},
        app.obtenirFitxer, function (error) {
          document.getElementById('missatge').innerHTML = 'Problema: ' + error.code;
        });

  },
  obtenirFitxer: function (fileEntry) {
    objecteFitxer = fileEntry;
  },

  escriureFitxer: function (writer) {
    var text = document.getElementById('text').value;
    writer.write(text);
    writer.onwriteend = function (evt) {
      document.getElementById('contingut').innerHTML = '<p>Desat.<br /><strong>File path:</strong> ' +
          objecteFitxer.fullPath + '</p>';
      var reader = new FileReader();
      reader.readAsText(objecteFitxer);
      reader.onload = function (evt) {
        document.getElementById('contingut').innerHTML = '<strong> Fitxer:</strong> <br />' + evt.target.result;

      }
    }
  },
}
