/**
 * @apiDefine user User Access
 * This endpoint can be access only by users.
 */

/**
 * @api {get} /api/user/ Get User
 * @apiVersion 0.0.1
 * @apiName Get User
 * @apiGroup User
 * @apiPermission user
 *
 * @apiDescription Gets the user from the database.
 *
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X GET https://vand.io/api/user
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X GET https://vand.io/api/user?callback=foobar
 *
 * @apiSuccess {Object} user The user object.
 * @apiSuccess {String} user._id The user unique id.
 * @apiSuccess {String} user.username The user username.
 * @apiSuccess {String[]} user.cases The id values of the cases.
 * @apiSuccess {Object} user.preferences The user preferences object.
 * @apiSuccess {String[]} user.preferences.tags The types of attacks that a user can follow.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"_id":"3f9cdf63-640c-4f43-8dc9-0f2b87157221","username":"7ac93a6e-49b3-4202-899e-577013a1f7e3","cases":[],"preferences":{"tags":[]}}
 *
 * @apiError (401 Unauthorized) PleaseSignIn The user is not signed in.
 * @apiError (401 Unauthorized) UsersOnly The user account signed in is an admin.
 * @apiError (400 Bad Request) MissingUsername The username is missing from the request.
 * @apiError (400 Bad Request) InvalidUsername The username is not a UUID value.
 * @apiError (400 Bad Request) UserNotExists The username provided is not in the database,
 * @apiError (500 Internal Server Error) RequestIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Please Sign In)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Please sign in."}
 *
 * @apiErrorExample Error-Response: (Users Only)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Please sign in as a user."}
 *
 * @apiErrorExample Error-Response: (Missing Username)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing username."}
 *
 * @apiErrorExample Error-Response: (Invalid Username)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid username."}
 *
 * @apiErrorExample Error-Response: (User Not Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "User does not exist."}
 *
 * @apiErrorExample Error-Response: (Request Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not get the user."}
 *
 */

/**
 * @api {post} /api/user/login Login
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Logs the user in and gives them a session.
 *
 * @apiParam {String} username The username of the account.
 * @apiParam {String} password The password of the account.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/user/login -d "username=mockuser&password=mockpassword"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/user/login -d "username=mockuser&password=mockpassword&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Logged In."}
 *
 * @apiError (400 Bad Request) MissingUsername The username is missing from the request.
 * @apiError (400 Bad Request) MissingPassword The password is missing from the request.
 * @apiError (400 Bad Request) UserNotExists The username provided is not in the database,
 * @apiError (400 Bad Request) WrongPassword The password provided does not match the password in the database.
 * @apiError (500 Internal Server Error) LoginIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Username)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing username."}
 *
 * @apiErrorExample Error-Response: (Missing Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing password."}
 *
 * @apiErrorExample Error-Response: (User Not Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "User does not exist."}
 *
 * @apiErrorExample Error-Response: (Wrong Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Wrong password."}
 *
 * @apiErrorExample Error-Response: (Login Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not log the user in."}
 *
 */

/**
 * @api {post} /api/user/apply Apply
 * @apiVersion 0.0.1
 * @apiName Apply
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Apply to the website using their email address.
 * An application is generated for that email and the link is sent out to them.
 *
 * @apiParam {String} email The email address for the new admin.
 * @apiParam {String} captcha The captcha response from Google.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/user/apply -d "email=newuser@vand.io&captcha=03AHJ_VuvJM0YLLZEMIe8K_gEQxxPO24I6Lqt8ICsyMdnLmTaZNnmKfO0mfbSNT7lVkZbBJzKZryWN7-7tOQbhjbruCmxk_GT9ZkB5jyxUWB4keSh5lHaSLln1uyWvXpKilrPieWhV2yLfTnJhh3SzTVcB4dlO3e668j-wsLxTTsCwsUru1Fl13_oMsnQosCCMWgo7HQgcLzE5aDqV_AwlXeJ_yrYxtdXB2-D_3aLeihMN-ErdaYvkU6ogDoFCxRV1hYMis8SJxizpIRYgLWuJyj2NBb5yKuQRndkoZstLRdZ0LGSU9SuMwCZab74H-xJNRrUQLeYHxD-E2ybKt4LCJLqnFO9rRFZdRY0HHMX4LudVsS5M5FySVswqgEsEPiFWir22ii2isZysOwUP3w25l6Afb11W4_-t4Q"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/user/apply -d "email=newuser@vand.io&callback=foobar&captcha=03AHJ_VuvJM0YLLZEMIe8K_gEQxxPO24I6Lqt8ICsyMdnLmTaZNnmKfO0mfbSNT7lVkZbBJzKZryWN7-7tOQbhjbruCmxk_GT9ZkB5jyxUWB4keSh5lHaSLln1uyWvXpKilrPieWhV2yLfTnJhh3SzTVcB4dlO3e668j-wsLxTTsCwsUru1Fl13_oMsnQosCCMWgo7HQgcLzE5aDqV_AwlXeJ_yrYxtdXB2-D_3aLeihMN-ErdaYvkU6ogDoFCxRV1hYMis8SJxizpIRYgLWuJyj2NBb5yKuQRndkoZstLRdZ0LGSU9SuMwCZab74H-xJNRrUQLeYHxD-E2ybKt4LCJLqnFO9rRFZdRY0HHMX4LudVsS5M5FySVswqgEsEPiFWir22ii2isZysOwUP3w25l6Afb11W4_-t4Q"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Application created."}
 *
 * @apiError (400 Bad Request) MissingEmail The email is missing from the request.
 * @apiError (400 Bad Request) InvalidEmail The email is not a valid email.
 * @apiError (400 Bad Request) EmailExists The email is already part of an application.
 * @apiError (500 Internal Server Error) CreateIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing email."}
 *
 * @apiErrorExample Error-Response: (Invalid Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid email."}
 *
 * @apiErrorExample Error-Response: (Email Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Email already applied."}
 *
 * @apiErrorExample Error-Response: (Create Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not create application."}
 */
