var app           = require('app');
var BrowserWindow = require('browser-window');
var ipc           = require('ipc');

var mainWindow = null;

var windowDefaultValues = {
	width: 800,
	height: 600,
	frame: false
};

app.on('window-all-closed', function () {
		if (process.platform != 'darwin') {
			app.quit();
		}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow(windowDefaultValues);
	mainWindow.loadUrl('file://' + __dirname + '/renderer.html');

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
});

ipc.on('open-instance', function (evt, args) {
	var newWindow = new BrowserWindow(windowDefaultValues);
	newWindow.loadUrl('file://' + __dirname + '/renderer.html');
});