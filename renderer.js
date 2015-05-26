(function () {
	var remote = require('remote');
	var db     = require('diskdb');
	var fs     = require('fs');
	var ipc    = require('ipc');

	var currentWindow = remote.getCurrentWindow();

	var dbDirectory = __dirname + '/db';

	function createStorageDir() {

		try {
			fs.readdirSync(dbDirectory);
		} catch(err) {
			fs.mkdirSync(dbDirectory);
		}
	}

	function connectDB() {
		db.connect(dbDirectory, ['todos']);
	}

	createStorageDir();
	connectDB();

	angular.module('mainapp', [])
		.controller('MainController', ['$scope', function ($scope) {

			$scope.todos = db.todos.find();

			$scope.closeWindow = function () {
				currentWindow.close()
			};

			$scope.addTodo = function () {
				var emptyTitle = _.isEmpty($scope.title);
				var emptyContent = _.isEmpty($scope.content);

				if (emptyTitle || emptyContent) {
					$scope.clearForm();
					return;
				}

				var savedTodo = db.todos.save({
					createdAt: new Date(),
					title: $scope.title,
					content: $scope.content
				});

				$scope.todos.push(savedTodo);
				$scope.clearForm();
			};

			$scope.clearForm = function () {
				$scope.title = '';
				$scope.content = '';
			};

			$scope.removeTodo = function (todo) {
				db.todos.remove({_id: todo._id});
				var index = $scope.todos.indexOf(todo);
				$scope.todos.splice(index, 1);
			};

			$scope.openInstance = function () {
				ipc.send('open-instance');
			};

		}]);
}());