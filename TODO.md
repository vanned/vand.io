# Grunt TODO


## client/app/admin/profile/profile.controller.js

-  **TODO** `(line 36)`  Actually make an API call to deny the application.

## client/app/admin/login/login.html

-  **TODO** `(line 5)`  The header is not showing up because the navbar on top of it -->

## server/api/admin/login/login.controller.js

-  **TODO** `(line 19)`  Check for length 12+ for admins
-  **TODO** `(line 39)`  Lock the user out if they try too many times.

## server/api/admin/register/register.controller.js

-  **TODO** `(line 61)`  Check the length of the password to be 12+ chars because they are an admin.

## server/api/application/approved/approved.controller.js

-  **TODO** `(line 66)`  Revert the database changes of inserting the users.

## server/api/application/status/status.spec.js

-  **TODO** `(line 7)`  write application status test.

## server/api/application/updateApplication.spec.js

-  **TODO** `(line 449)`  Finish writing the update application tests.

## server/api/application/verify/verify.controller.js

-  **TODO** `(line 207)`  Revert the database changes of inserting the users.

## server/api/application/verify/verify.spec.js

-  **TODO** `(line 7)`  Write application verify test.

## server/api/case/case.spec.js

-  **TODO** `(line 8)`  Finish writing the test cases for this endpoint.

## server/api/case/open/open.controller.js

-  **TODO** `(line 9)`  Change this file size limit to a more reasonable value later.

## server/api/user/login/login.controller.js

-  **TODO** `(line 33)`  Lock the user out if they continue to use the wrong password.

## server/components/case/index.js

-  **TODO** `(line 45)`  Change this to an authenticated-read so we can make sure other people outside the website can't see them.

## server/components/emails/templates/admin/appointment/html.jade

-  **TODO** `(line 5)`  We will make this email pretty later.

## server/components/emails/templates/admin/lostPassword/html.jade

-  **TODO** `(line 5)`  We will make this email pretty later.

## server/components/emails/templates/admin/register/html.jade

-  **TODO** `(line 5)`  We will make this email pretty later.

## server/components/emails/templates/applications/create/html.jade

-  **TODO** `(line 5)`  We will make this email pretty later.

## server/components/emails/templates/users/register/html.jade

-  **TODO** `(line 5)`  We will make this email pretty later.

## server/components/emails/templates/admin/register/style.css

-  **TODO** `(line 1)`  We don't actually want pink in this email :) */
