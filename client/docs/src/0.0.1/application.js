/**
 * @api {get} /api/application Get Application
 * @apiVersion 0.0.1
 * @apiName Get Application
 * @apiGroup Application
 * @apiPermission public
 *
 * @apiDescription Gets an application from the database given the id value.
 *
 * @apiParam {String} id The application id to get from the database.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X GET https://vand.io/api/application?id=703ed1f4-34e7-478a-bcad-cad2ea279449
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X GET https://vand.io/api/application?id=703ed1f4-34e7-478a-bcad-cad2ea279449&callback=foobar
 *
 * @apiSuccess {Object} application The application object.
 * @apiSuccess {Object} application.email The email that applied.
 * @apiSuccess {Object} application.updated The last time the application was updated.
 * @apiSuccess {Object} application.verifyToken The Twitter verification code for checking the DM. Currently not supported.
 * @apiSuccess {Object} application.approved Whether the application was approved or not.
 * @apiSuccess {Object} application.approvedBy Who the application was approved by. Should be an admin username.
 * @apiSuccess {Object} application.company The company object.
 * @apiSuccess {String} application.company.name The company name.
 * @apiSuccess {String} application.company.website The company website.
 * @apiSuccess {Object} application.appointment The appointment object.
 * @apiSuccess {Boolean} application.appointment.inPerson Whether the appointment is inPerson or not.
 * @apiSuccess {Object} application.appointment.coordinator If inPerson is true, the coordinator object should have the contact filled.
 * @apiSuccess {String} application.appointment.coordinator.firstname If inPerson is true, the first name of the coordinator.
 * @apiSuccess {String} application.appointment.coordinator.lastname If inPerson is true, the last name of the coordinator.
 * @apiSuccess {String} application.appointment.coordinator.phonenumber If inPerson is true, the phone number of the coordinator.
 * @apiSuccess {String} application.appointment.coordinator.email If inPerson is true, the email of the coordinator.
 * @apiSuccess {Boolean} application.appointment.useKeybase Whether the appointment uses keybase verification or not. Current unsupported.
 * @apiSuccess {Object} application.appointment.keybase Whether the appointment uses keybase verification or not. Current unsupported.
 * @apiSuccess {String} application.appointment.keybase.username If useKeybase is true, the username of the keybase account. Current unsupported.
 * @apiSuccess {String} application.appointment.keybase.domain If useKeybase is true, the domain on the keybase account to verify. Current unsupported.
 * @apiSuccess {Number} application.appointment.date The appointment time in epoch milliseconds UTC. (moment.utc().valueOf())
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"_id":"703ed1f4-34e7-478a-bcad-cad2ea279449","email":"mockuser@vand.io","company":{"name":"Mock Company Inc.","website":"http://mockwebsite.com"},"appointment":{"inPerson":true,"coordinator":{"firstname":"John","lastname":"Smith","phonenumber":"555-555-5555","email":"mockuser@vand.io"},"useKeybase":false,"keybase":{"username":null,"domain":null},"date":1426913980906},"created":1425619495555,"updated":1425716561481,"approved":true,"approvedBy":"mockadmin"}
 *
 * @apiError (400 Bad Request) MissingId The application id is missing from the request.
 * @apiError (400 Bad Request) InvalidId The application id is not a valid uuid v4 value.
 * @apiError (400 Bad Request) IdNotExists The application id does not exist in the database.
 * @apiError (500 Internal Server Error) RequestIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing id."}
 *
 * @apiErrorExample Error-Response: (Invalid Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid id."}
 *
 * @apiErrorExample Error-Response: (Id Not Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Id does not exist."}
 *
 * @apiErrorExample Error-Response: (Request Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not get the application."}
 */

/**
 * @api {post} /api/application Update Application
 * @apiVersion 0.0.1
 * @apiName Update Application
 * @apiGroup Application
 * @apiPermission public
 *
 * @apiDescription Updates the application with appointment date/information.
 *
 * @apiParam {Object} company The company object.
 * @apiParam {String} company.name The company name.
 * @apiParam {String} company.website The company website.
 * @apiParam {Object} appointment The appointment object.
 * @apiParam {Boolean} appointment.inPerson Whether the appointment is inPerson or not.
 * @apiParam {Object} appointment.coordinator If inPerson is true, the coordinator object should have the contact filled.
 * @apiParam {String} appointment.coordinator.firstname If inPerson is true, the first name of the coordinator.
 * @apiParam {String} appointment.coordinator.lastname If inPerson is true, the last name of the coordinator.
 * @apiParam {String} appointment.coordinator.phonenumber If inPerson is true, the phone number of the coordinator.
 * @apiParam {String} appointment.coordinator.email If inPerson is true, the email of the coordinator.
 * @apiParam {Boolean} appointment.useKeybase Whether the appointment uses keybase verification or not. Current unsupported.
 * @apiParam {Object} appointment.keybase Whether the appointment uses keybase verification or not. Current unsupported.
 * @apiParam {String} appointment.keybase.username If useKeybase is true, the username of the keybase account. Current unsupported.
 * @apiParam {String} appointment.keybase.domain If useKeybase is true, the domain on the keybase account to verify. Current unsupported.
 * @apiParam {Number} appointment.date The appointment time in epoch milliseconds UTC. (moment.utc().valueOf())
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -H 'Content-Type: application/json' -X POST https://vand.io/api/application -d '{"id":"6b5b7a6e-0f42-4d66-931f-46d7cea2933a","appointment":{"inPerson":true,"useKeybase":false,"coordinator":{"firstname":"John","lastname":"Smith","phonenumber":"555-555-5555","email":"mockuser@vand.io"},"keybase":{},"date":1426913980906},"company":{"name":"Mock Company Inc.","website":"http://mockwebsite.com"}}'
 *
 * @apiExample {curl} Callback-usage:
 *     curl -H 'Content-Type: application/json' -X POST https://vand.io/api/application -d '{"id":"6b5b7a6e-0f42-4d66-931f-46d7cea2933a","appointment":{"inPerson":true,"useKeybase":false,"coordinator":{"firstname":"John","lastname":"Smith","phonenumber":"555-555-5555","email":"mockuser@vand.io"},"keybase":{},"date":1426913980906},"company":{"name":"Mock Company Inc.","website":"http://mockwebsite.com"},"callback":"foobar"}'
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Application updated."}
 *
 * @apiError (400 Bad Request) MissingId The application id is missing from the request.
 * @apiError (400 Bad Request) InvalidId The application id is not a valid uuid v4 value.
 * @apiError (400 Bad Request) MissingAppointment The application appointment object is missing from the request.
 * @apiError (400 Bad Request) MissingCompany The application company object is missing from the request.
 * @apiError (400 Bad Request) CompanyObject The application company object is not an object.
 * @apiError (400 Bad Request) MissingName The company name is missing from the request.
 * @apiError (400 Bad Request) MissingWebsite The company website is missing from the request.
 * @apiError (400 Bad Request) InvalidWebsite The company website is not a valid url.
 * @apiError (400 Bad Request) AppointmentObject The application appointment object is not an object.
 * @apiError (400 Bad Request) MissingInPerson The appointment inPerson value is missing from the request.
 * @apiError (400 Bad Request) MissingUseKeyBase The appointment useKeybase value is missing from the request.
 * @apiError (400 Bad Request) InvalidInPerson The appointment inPerson value is not a boolean.
 * @apiError (400 Bad Request) InvalidUseKeybase The appointment useKeybase value is not a boolean.
 * @apiError (400 Bad Request) ChooseAppointment The appointment object has either useKeybase and inPerson both set to true or both set to false.
 * @apiError (400 Bad Request) MissingAppointmentDate The appointment date is missing from the request.
 * @apiError (400 Bad Request) InvalidAppointmentDate The appointment date is not a epoch millisecond number.
 * @apiError (400 Bad Request) AppointmentInPast The appointment date is in the past.
 * @apiError (400 Bad Request) MissingCoordinator The appointment coordinator is missing from the request.
 * @apiError (400 Bad Request) MissingKeybase The appointment keybase object is missing from the request.
 * @apiError (400 Bad Request) CoordinatorObject The appointment coordinator object is not an object.
 * @apiError (400 Bad Request) MissingFirstName The coordinator firstname is missing from the request.
 * @apiError (400 Bad Request) MissingLastName The coordinator lastname is missing from the request.
 * @apiError (400 Bad Request) MissingPhoneNumber The coordinator phone number is missing from the request.
 * @apiError (400 Bad Request) InvalidPhoneNumber The coordinator phone number is not a valid US phone number.
 * @apiError (400 Bad Request) MissingEmail The coordinator email is missing from the request.
 * @apiError (400 Bad Request) InvalidEmail The coordinator email is not a valid email address.
 * @apiError (400 Bad Request) KeybaseObject The appointment keybase object is not an object.
 * @apiError (400 Bad Request) MissingUsername The keybase username is missing from the request.
 * @apiError (400 Bad Request) MissingDomain The keybase domain is missing from the request.
 * @apiError (400 Bad Request) InvalidDomain The keybase domain is not a valid url.
 * @apiError (400 Bad Request) ApplicationNotExists The application is not in the database.
 * @apiError (500 Internal Server Error) UpdateIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing id."}
 *
 * @apiErrorExample Error-Response: (Invalid Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid id."}
 *
 * @apiErrorExample Error-Response: (Missing Appointment)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing appointment."}
 *
 * @apiErrorExample Error-Response: (Missing Company)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing company."}
 *
 * @apiErrorExample Error-Response: (Company Object)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Company must be an object."}
 *
 * @apiErrorExample Error-Response: (Missing Name)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing company name."}
 *
 * @apiErrorExample Error-Response: (Missing Website)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing company website."}
 *
 * @apiErrorExample Error-Response: (Invalid Website)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid company website.."}
 *
 * @apiErrorExample Error-Response: (Appointment Object)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment must be an object."}
 *
 * @apiErrorExample Error-Response: (Missing InPerson)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment type \"inPerson\" is missing, must be a boolean."}
 *
 * @apiErrorExample Error-Response: (Missing UseKeyBase)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment type \"useKeybase\" is missing, must be a boolean."}
 *
 * @apiErrorExample Error-Response: (Invalid InPerson)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment type \"inPerson\" must be a boolean."}
 *
 * @apiErrorExample Error-Response: (Invalid UseKeybase)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment type \"useKeybase\" must be a boolean."}
 *
 * @apiErrorExample Error-Response: (Choose Appointment)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Choose one appointment type."}
 *
 * @apiErrorExample Error-Response: (Missing Appointment Date)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing appointment date/time."}
 *
 * @apiErrorExample Error-Response: (Invalid Appointment Date)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid appointment date/time."}
 *
 * @apiErrorExample Error-Response: (Appointment In Past)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Appointment date already past."}
 *
 * @apiErrorExample Error-Response: (Missing Coordinator)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing appointment coordinator."}
 *
 * @apiErrorExample Error-Response: (Missing Keybase)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing appointment keybase."}
 *
 * @apiErrorExample Error-Response: (Coordinator Object)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Coordinator must be an object."}
 *
 * @apiErrorExample Error-Response: (Missing First Name)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing coordinator firstname."}
 *
 * @apiErrorExample Error-Response: (Missing Last Name)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing coordinator lastname."}
 *
 * @apiErrorExample Error-Response: (Missing Phone Number)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing coordinator phone number."}
 *
 * @apiErrorExample Error-Response: (Invalid Phone Number)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid coordinator phone number, currently US numbers only."}
 *
 * @apiErrorExample Error-Response: (Missing Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing coordinator email."}
 *
 * @apiErrorExample Error-Response: (Invalid Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid coordinator email."}
 *
 * @apiErrorExample Error-Response: (Keybase Object)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Keybase must be an object."}
 *
 * @apiErrorExample Error-Response: (Missing Username)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing keybase username."}
 *
 * @apiErrorExample Error-Response: (Missing Domain)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing keybase domain."}
 *
 * @apiErrorExample Error-Response: (Invalid Domain)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid keybase domain."}
 *
 * @apiErrorExample Error-Response: (Application Not Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Application does not exist."}
 *
 * @apiErrorExample Error-Response: (Approve Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not update application."}
 *
 */

/**
 * @api {post} /api/application/approved Approved
 * @apiVersion 0.0.1
 * @apiName Approved
 * @apiGroup Application
 * @apiPermission admin
 *
 * @apiDescription Approves an updated application.
 *
 * @apiParam {String} id The application id to approve.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/application/approved -d "id=703ed1f4-34e7-478a-bcad-cad2ea279449"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/application/approved -d "id=703ed1f4-34e7-478a-bcad-cad2ea279449&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Application approved."}
 *
 * @apiError (401 Unauthorized) AdminsOnly The session found was either not an admin session or not a session at all.
 * @apiError (400 Bad Request) MissingId The application id is missing from the request.
 * @apiError (400 Bad Request) InvalidId The application id is not a valid uuid v4 value.
 * @apiError (400 Bad Request) IdNotExists The application id does not exist in the database.
 * @apiError (500 Internal Server Error) ApproveIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Admins Only)
 *      HTTP/1.1 401 Unauthorized
 *      {"message": "You must be an admin."}
 *
 * @apiErrorExample Error-Response: (Missing Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing id."}
 *
 * @apiErrorExample Error-Response: (Invalid Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid id."}
 *
 * @apiErrorExample Error-Response: (Id Not Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Id does not exist."}
 *
 * @apiErrorExample Error-Response: (Approve Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not approve application."}
 */