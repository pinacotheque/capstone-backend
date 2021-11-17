import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
    badRequestErrorHandler,
    catchAllErrorHandler,
    notFoundErrorHandler,
} from "./errorHandlers.js";
import mongoose from 'mongoose'


import usersRouter from '../src/services/users/index.js'
import TeamsRouter from '../src/services/teams/index.js'


const server = express();


const port = process.env.PORT

// console.log("DB CONNECTION STRING: ", process.env.MYDBCONNECTIONSTRING)

// mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
// const db = mongoose.connection;
// db.on("error", (error) => console.log(error));

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Mongo Connected!")

    server.listen(port, () => {
        console.table(listEndpoints(server))

        console.log(`Server running on port ${port}`)
    })
})



server.use(cors());
server.use(express.json());

/*

server.use("/blogs", blogsRouter)
server.use("/auth", authRouter)
*/
server.use("/users", usersRouter);
server.use("/teams", TeamsRouter);


server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

//server.listen(port, () => console.log(" Server is running on port : ", port));

server.on("error", (error) =>
    console.log(` Server is not running due to : ${error}`)
);

/*


///////////

import {
    badRequestErrorHandler,
    catchAllErrorHandler,
    notFoundErrorHandler,
} from "./errorHandlers.js";

import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import passport from 'passport'
// import usersRouter from "./services/users/index.js"


console.time("Server startup");
const server = express();
const port = process.env.PORT || 3001;


// ************** MIDDLEWARES ***************\\

server.use(express.json());
server.use(cors());


// ************** ROUTES ***************\\

// server.use("/users", usersRouter);
console.table(listEndpoints(server));


// ************** ERROR MIDDLEWARES ***************\\

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

// ************** MONGO CONNECTION ***************\\

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


*/