angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Contacts) {
                        return Contacts.getContacts();
                    },
					progressReports: function(Progress) {
						return Progress.getProgressReports();
					}
                }
            })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "contact-form.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
			.when("/new/progress", {
				controller: "NewProgressReportController",
				templateUrl: "progress-form.html"
			})
			 .when("/progress/:progressId", {
                controller: "EditProgressController",
                templateUrl: "progress.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
	 .service("Progress", function($http) {
		   this.getProgressReports = function() {
            return $http.get("/progress").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
		   this.createProgressReport = function(progressReport) {
            return $http.post("/progress", progressReport).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
		 this.getProgressReport = function(progressId) {
            var url = "/progress/" + progressId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
		this.editProgressReport = function(progressReport) {
            var url = "/progress/" + progress._id;
            console.log(progress._id);
            return $http.put(url, progress).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteProgressReport = function(progressId) {
            var url = "/progress/" + progressId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
    .service("Contacts", function($http) {
        this.getContacts = function() {
            return $http.get("/contacts").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding contacts.");
                });
        }
        this.createContact = function(contact) {
            return $http.post("/contacts", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating contact.");
                });
        }
        this.getContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this contact.");
                    console.log(response);
                });
        }
        this.deleteContact = function(contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this contact.");
                    console.log(response);
                });
        }
    })
	.controller("ListController",function(contacts,progressReports, $scope) {
        $scope.contacts = contacts.data;
		$scope.progressReports = progressReports.data;
    })
	 .controller("EditProgressController", function($scope, $routeParams, Progress) {
        Progress.getProgressReport($routeParams.progressId).then(function(doc) {
            $scope.progressReport = doc.data;
        }, function(response) {
            alert(response);
        });
        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.progressFormUrl = "progress-form.html";
        }
        $scope.back = function() {
            $scope.editMode = false;
            $scope.progressFormUrl = "";
        } 
		 $scope.saveProgress = function(progressReport) {
            Progress.editProgress(progressReport);
            $scope.editMode = false;
            $scope.progressFormUrl = "";
        }
        $scope.deleteProgress = function(progressId) {
            Progress.deleteProgress(progressId);
        }
    })
    .controller("NewContactController", function($scope, $location, Contacts) {
        $scope.back = function() {
            $location.path("#/");
        }
        $scope.saveContact = function(contact) {
            Contacts.createContact(contact).then(function(doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
	.controller("NewProgressReportController", function($scope, $location, Progress) {
        $scope.back = function() {
            $location.path("#/");
        }
        $scope.saveProgress = function(progressReport) {
            Progress.createProgressReport(progressReport).then(function(doc) {
                var progressFormUrl = "/progress/" + doc.data._id;
                $location.path(progressFormUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditContactController", function($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function(doc) {
            $scope.contact = doc.data;
        }, function(response) {
            alert(response);
        });
        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        }
        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }
        $scope.saveContact = function(contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        }
        $scope.deleteContact = function(contactId) {
            Contacts.deleteContact(contactId);
        }
    });