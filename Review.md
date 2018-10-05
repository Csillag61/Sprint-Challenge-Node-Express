# Review Questions

## What is Node.js?
Node.js is a program that runs other programs, executes JavaScript applications outside the browser.
Advantages of using Node.js for writing server side code are: ez to share code between the server and the client, single threaded, asynchronous, npm repository

## What is Express?
web application framework that sits on top of the Node.js http server module. and adds extra functionality, like routing and middleware support, and a simpler API.
## Mention two parts of Express that you learned about this week.
Middleware, routing
## What is Middleware?
Array of functions, that get the req and res and operates on them. It handles  one aspect of the app. Tasks like authentication and logging are handled by middleware. Another benefit of Middleware is that it provides an easy way to add modularity to the code.We can group the different types of middlewares in 3 groups: bult-ins, third party and custom mw.
## What is a Resource?
A principle to use to create RESTful Web API> everything is a resource, a redource is accessible via uniqe URL, can have multiple representations.
## What can the API return to help clients know if a request was successful? 
error-success messages

## How can we partition our application into sub-applications? 
through express

## What is express.json() and why do we need it?
This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option. 