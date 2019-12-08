'use strict';
angular
    .module('tay3lo-admin')
    .factory('AuthenService', ['$cookieStore', '$rootScope', '$timeout', 'AlertService',
        function AuthenService($cookieStore, $rootScope, $timeout, AlertService) {
            // Listen for auth state changes
            firebase.auth().onAuthStateChanged(onAuthStateChanged);

            // local property
            var authen = this;
            authen.callback = null;
            authen.rememberMe = false;

            // init service
            var service = {};
            service.Login = Login;
            service.Logout = Logout;
            service.ClearCredentials = ClearCredentials;
            return service;

            // LOGIN
            function Login(email, password, rememberMe, callback) {
                // FIREBASE
                if (email.length < 4) {
                    AlertService.ShowAlert(null, '', 'Please enter an email address.');
                    return;
                }
                if (password.length < 1) {
                    AlertService.ShowAlert(null, '', 'Please enter a password.');
                    return;
                }
                AuthenService.rememberMe = rememberMe;
                AuthenService.callback = callback;
                // Sign in with email and pass.
                // [START authwithemail]
                firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                    // callback login false
                    var response = { success: false, message: 'Username or password is incorrect' };
                    if (AuthenService.callback) {
                        AuthenService.callback(response);
                    }

                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/wrong-password') {
                        AlertService.ShowAlert(null, '', 'Wrong password.');
                    } else {
                        AlertService.ShowAlert(null, '', errorMessage);
                    }
                    // [END_EXCLUDE]
                });
            }

            // Logout
            function Logout(callback) {
                AuthenService.callback = callback;
                firebase.auth().signOut();
            }

            // ======================== COOKIE =============================
            function ClearCredentials() {
                $rootScope.currentUserUID = null;
                $cookieStore.remove('globals');
            }


            // ========================= FIREBASE ==========================
            // onAuthStateChanged
            function onAuthStateChanged(user) {
                // We ignore token refresh events.
                if (user && $rootScope.currentUserUID === user.uid && !AuthenService.callback) { // logged in when not click any event
                    return;
                }
                if (!user && $rootScope.currentUserUID === null && !AuthenService.callback) { // when shutdenly lost session
                    return;
                }
                var response;
                if (user) {
                    // create user
                    // writeUserData(user.uid, user.displayName, user.email, user.photoURL);

                    // Check user permission
                    checkUserPermission(user.uid, function(isAdmin) {
                        if (isAdmin) {
                          $rootScope.currentUserUID = user.uid;
                          // if check remmember -> save
                          if (AuthenService.rememberMe) {
                              $cookieStore.put('globals', user.uid);
                          }
                            // response
                            response = { success: true };
                        } else {
                          $rootScope.currentUserUID = null;
                            // response
                            response = { success: false, message: 'User not found or does not have permission' };
                        }
                        if (AuthenService.callback) {
                            AuthenService.callback(response);
                        }
                    });

                } else {
                    $cookieStore.remove('globals');
                    response = { success: false, message: 'Username or password is incorrect' };
                    if (AuthenService.callback) {
                        AuthenService.callback(response);
                    }
                }

            }

            // Writes the user's data to the database
            // Write user ở đây sẽ ghi đè user info -> ko cần nữa
            function writeUserData(userId, name, email, imageUrl) {
                var userRef = firebase.database().ref('users/' + userId);
                // .set({
                //     username: name,
                //     email: email,
                //     profile_picture: imageUrl,
                //     is_admin: true
                // });
            }

            function checkUserPermission(userId, finished) {
                var users = firebase.database().ref('users');
                users.child(userId).once('value', function(snapshot) {
                    if (snapshot.val() !== null) {
                        finished(!snapshot.val().hasOwnProperty('isAdmin') ? false : snapshot.val().isAdmin);
                    } else {
                        finished(false)
                    }
                });
            }
        }
    ]);
