/**
 * @apiDefine public Public Access
 * This endpoint can be access by anyone.
 */

/**
 * @apiDefine admin Admin Access
 * This endpoint can be access only by admins.
 */

/**
 * @api {post} /api/admin/register Register
 * @apiVersion 0.0.1
 * @apiName Register
 * @apiGroup Admin
 * @apiPermission public
 *
 * @apiDescription Register an admin using a token or the first admin without a token.
 *
 * @apiParam {String} [token] The token to activate the admin account.
 * @apiParam {String} email The email address for the admin.
 * @apiParam {String} username The username for the admin.
 * @apiParam {String} password The password for the admin.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Token-usage:
 *     curl -X POST https://vand.io/api/admin/register -d "token=testToken&email=mockadmin@vand.io&username=mockadmin&password=mockPassword"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/admin/register -d "email=mockadmin@vand.io&username=mockadmin&password=mockPassword&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Admin registered."}
 *
 * @apiError (400 Bad Request) MissingUsername The username is missing from the request.
 * @apiError (400 Bad Request) MissingEmail The email is missing from the request.
 * @apiError (400 Bad Request) MissingPassword The password is missing from the request.
 * @apiError (400 Bad Request) MissingToken The token is missing from the request.
 * @apiError (400 Bad Request) InvalidEmail The email is not a valid email.
 * @apiError (400 Bad Request) InvalidToken The token is not a UUID v4 value.
 * @apiError (400 Bad Request) EmailNotMatching The email in the request does not match the email for the token.
 * @apiError (400 Bad Request) AlreadyActive The admin account has already been activated.
 * @apiError (400 Bad Request) UsernameExists The username is already taken by another admin.
 * @apiError (500 Internal Server Error) RegisterIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Username)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing username."}
 *
 * @apiErrorExample Error-Response: (Missing Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing email."}
 *
 * @apiErrorExample Error-Response: (Missing Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing password."}
 *
 * @apiErrorExample Error-Response: (Missing Token)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing token."}
 *
 * @apiErrorExample Error-Response: (Invalid Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid email."}
 *
 * @apiErrorExample Error-Response: (Invalid Token)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid token."}
 *
 * @apiErrorExample Error-Response: (Email Not Matching)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Email does not match token."}
 *
 * @apiErrorExample Error-Respose: (Already Active)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Admin account already active."}
 *
 * @apiErrorExample Error-Response: (Username Exists)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Username already exists."}
 *
 * @apiErrorExample Error-Response: (Register Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not register admin."}
 */

/**
 * @api {post} /api/admin/token Activate
 * @apiVersion 0.0.1
 * @apiName Activate
 * @apiGroup Admin
 * @apiPermission admin
 *
 * @apiDescription Creates a new admin using their email address.
 *
 * @apiParam {String} email The email address for the new admin.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/admin/token -d "email=newadmin@vand.io"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/admin/token -d "email=newadmin@vand.io&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Admin created."}
 *
 * @apiError (401 Unauthorized) AdminsOnly The session found was either not an admin session or not a session at all.
 * @apiError (400 Bad Request) MissingEmail The email is missing from the request.
 * @apiError (400 Bad Request) InvalidEmail The email is not a valid email.
 * @apiError (400 Bad Request) EmailExists The email is already taken by another admin.
 * @apiError (500 Internal Server Error) CreateIssue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Admins Only)
 *      HTTP/1.1 401 Unauthorized
 *      {"message": "You must be an admin."}
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
 *      {"message": "Admin already exists."}
 *
 * @apiErrorExample Error-Response: (Create Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not create admin."}
 */

/**
 * @api {post} /api/admin/login Login
 * @apiVersion 0.0.1
 * @apiName Login
 * @apiGroup Admin
 * @apiPermission public
 *
 * @apiDescription Logs an admin into the site and provides a session.
 *
 * @apiParam {String} email The email address for the admin.
 * @apiParam {String} password The password for the admin.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/admin/login -d "email=mockadmin@vand.io&password=mockpassword"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/admin/login -d "email=mockadmin@vand.io&password=mockpassword&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Logged in."}
 *
 * @apiError (400 Bad Request) MissingUsername The username is missing from the request.
 * @apiError (400 Bad Request) MissingPassword The password is missing from the request.
 * @apiError (400 Bad Request) UserNotExist The username does not exist in the database.
 * @apiError (400 Bad Request) PasswordMismatch The password provided does not match the password in the database.
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
 * @apiErrorExample Error-Response: (User Not Exist)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Username does not exist."}
 *
 * @apiErrorExample Error-Response: (Password Mismatch)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Passwords do not match."}
 *
 * @apiErrorExample Error-Response: (Login Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not log admin in."}
 */

/**
 * @api {post} /api/admin/lostPassword Lost Password
 * @apiVersion 0.0.1
 * @apiName LostPassword
 * @apiGroup Admin
 * @apiPermission public
 *
 * @apiDescription Sends a reset password email given an admin username or email.
 *
 * @apiParam {String} [email] The email address for the admin account.
 * @apiParam {String} [username] The username for the admin account.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/admin/lostPassword -d "email=mockadmin@vand.io"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/admin/lostPassword -d "username=mockadmin@vand.io&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Reset email sent."}
 *
 * @apiError (400 Bad Request) MissingUsernameOrEmail The username and email are missing from the request.
 * @apiError (400 Bad Request) InvalidEmail The email is not a valid email address.
 * @apiError (400 Bad Request) EmailNotExist The email address does not exist in the database.
 * @apiError (400 Bad Request) UserNotExist The username does not exist in the database.
 * @apiError (500 Internal Server Error) Resetissue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Username Or Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing username or email."}
 *
 * @apiErrorExample Error-Response: (Invalid Email)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid email."}
 *
 * @apiErrorExample Error-Response: (Email Not Exist)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Email does not exist."}
 *
 * @apiErrorExample Error-Response: (User Not Exist)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Username does not exist."}
 *
 * @apiErrorExample Error-Response: (Reset Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not send lost password email."}
 */

/**
 * @api {post} /api/admin/forgotPassword Forgot Password
 * @apiVersion 0.0.1
 * @apiName ForgotPassword
 * @apiGroup Admin
 * @apiPermission public
 *
 * @apiDescription Resets the admin password given the right reset token.
 *
 * @apiParam {String} id The unique id of the admin account.
 * @apiParam {String} token The reset token for the admin account.
 * @apiParam {String} new The new password for the admin account.
 * @apiParam {String} confirm The confirm new password for the admin account.
 * @apiParam {String} [callback] The callback function name for JSONP.
 *
 * @apiExample {curl} Example-usage:
 *     curl -X POST https://vand.io/api/admin/forgotPassword -d "id=cede9a6f-0da8-4093-9762-c925b1951949&token=dcefa6cf-26ca-40cd-8218-45edff278a33&new=newPassword&confirm=newPassword"
 *
 * @apiExample {curl} Callback-usage:
 *     curl -X POST https://vand.io/api/admin/forgotPassword -d "id=cede9a6f-0da8-4093-9762-c925b1951949&token=dcefa6cf-26ca-40cd-8218-45edff278a33&new=newPassword&confirm=newPassword&callback=foobar"
 *
 * @apiSuccess {String} message The successful message.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {"message":"Password changed."}
 *
 * @apiError (400 Bad Request) MissingId The admin id is missing from the request.
 * @apiError (400 Bad Request) MissingToken The reset token is missing from the request.
 * @apiError (400 Bad Request) MissingNewPassword The new password is missing from the request.
 * @apiError (400 Bad Request) MissingConfirmPassword The confirmed password is missing from the request.
 * @apiError (400 Bad Request) InvalidId The admin is was not a UUID v4 value.
 * @apiError (400 Bad Request) InvalidToken The reset token was not a UUID v4 value.
 * @apiError (400 Bad Request) PasswordMismatch The new password and confirm passwords do not match.
 * @apiError (400 Bad Request) UserNotExist The admin id does not exist in the database.
 * @apiError (400 Bad Request) TokenMismatch The reset token for the requested admin is did not match.
 * @apiError (500 Internal Server Error) Resetissue There was an issue with the server.
 *
 * @apiErrorExample Error-Response: (Missing Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing id."}
 *
 * @apiErrorExample Error-Response: (Missing Token)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing token."}
 *
 * @apiErrorExample Error-Response: (Missing New Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing new password."}
 *
 * @apiErrorExample Error-Response: (Missing Confirm Password)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Missing confirmed password."}
 *
 * @apiErrorExample Error-Response: (Invalid Id)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid id."}
 *
 * @apiErrorExample Error-Response: (Invalid Token)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Invalid token."}
 *
 * @apiErrorExample Error-Response: (Password Mismatch)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Passwords do not match."}
 *
 * @apiErrorExample Error-Response: (User Not Exist)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Admin does not exist with that id."}
 *
 * @apiErrorExample Error-Response: (Token Mistmatch)
 *      HTTP/1.1 400 Bad Request
 *      {"message": "Token does not match admin."}
 *
 * @apiErrorExample Error-Response: (Reset Issue)
 *      HTTP/1.1 500 Internal Server Error
 *      {"message": "Could not change password."}
 */
