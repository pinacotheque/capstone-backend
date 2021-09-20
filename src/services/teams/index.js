import Team from "./schema.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTMiddleware } from "../../auth/middlewares.js"
import createError from "http-errors";
import express from "express";

const TeamsRouter = express.Router();

//**************** POST NEW Team, RETURNS ID **************** 

TeamsRouter.post("/", JWTMiddleware, async (req, res, next) => {
    try {
        const newTeam = new Team({ ...req.body, user: req.user._id });
        const { _id } = await newTeam.save();

        res.status(201).send({ _id });
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            next(createError(400, error));
        } else {
            next(createError(500, "An error occurred while saving team"));
        }
    }
});

//**************** GET ALL TEAMS **************** 

TeamsRouter.get("/", JWTMiddleware, async (req, res, next) => {
    try {
        const Team = await Team.find({}).populate("user");
        res.send(Team);
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while getting team"));
    }
});

//**************** GET ONE Team **************** 

TeamsRouter.get("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const id = req.params.id;
        const Team = await Team.findById(id).populate("user");
        if (Team) {
            res.send(Team);
        } else {
            next(createError(404, `Team ${req.params.id} not found!`));
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while getting team"));
    }
});

//**************** EDIT Team **************** 

TeamsRouter.put("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const accomId = req.params.id
        const modifiedTeam = await Team.findOneAndUpdate({ _id: accomId, user: { _id: req.user._id } }, req.body, { new: true, runValidators: true })
        if (modifiedTeam) {
            res.send(modifiedTeam)
        } else {
            next(createError(404, 'Team not found!'))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while modifying Team"))
    }

});

//**************** DELETE Team **************** 

TeamsRouter.delete("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const accomId = req.params.id
        const deletedTeam = await Team.findOneAndDelete({ _id: accomId, user: { _id: req.user._id } })
        if (deletedTeam) {
            res.status(204).send()
        } else {
            next(createError(404, 'Team not found or not authorized!'))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while deleting team"))
    }

});

export default TeamsRouter;