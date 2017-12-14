In this directory you may add `validators` that should be shared on the front-end and back-end.
An example of a validator is `UserCreateValidator`, which would check that all the fields of a user is valid before creating it.
By validating on both the front-end and back-end the responsiveness can be increased, as no HTTP requests have to be made.
(And of course, validation has to **always** be performed on the back-end, never trust user input.)