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