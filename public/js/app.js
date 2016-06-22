angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    // contacts: function(Contacts) {
                        // return Contacts.getContacts();
                    // },
					progressReports: function(Progress) {
						return Progress.getProgressReports().data;
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
			// added by jesse 6/22
			.when("/new/progress", {
				controller: "NewProgressReportController",
				templateUrl: "progress-form.html"
			})
			 .when("/progress/:progessId", {
                controller: "EditProgressController",
                templateUrl: "progress.html"
            })
			// end add
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
	.controller("ListController",["contacts","progressReports", function(contacts,progressReports, $scope) {
       // $scope.contacts = contacts.data;
		$scope.progressReports = progressReports;
    }])
	 .controller("EditProgressController", function($scope, $routeParams, Progress) {
        Progress.getProgressReport($routeParams.progessId).then(function(doc) {
            $scope.progressReport = doc.data;
        }, function(response) {
            alert(response);
        });
        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "progress-form.html";
        }
        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        } 
    })
    .controller("ListController", function(contacts, $scope) {
        $scope.contacts = contacts.data;
		$scope.progressReports = progressReports.data;
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
	// added 6/22  jesse
	.controller("NewProgressReportController", function($scope, $location, Progress) {
		$scope.back = function() {
			$location.path("#/");
		}
		
		$scope.saveProgress = function(progressReport) {
			Progress.createProgressReport(progressReport).then(function(doc) {
				var progressUrl = "/progress/" + doc.data._id;
				$location.path(progressUrl);
			}, function(response) {
				alert(response);
			});
		}
	})
	// end add
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