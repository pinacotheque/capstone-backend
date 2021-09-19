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
            next(createError(500, "An error occurred while saving Teams"));
        }
    }
});

//**************** GET ALL TeamS **************** 

TeamsRouter.get("/", JWTMiddleware, async (req, res, next) => {
    try {
        const Team = await Team.find({}).populate("user");
        res.send(Team);
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while getting Teams"));
    }
});

//**************** GET SPECIFIC Team **************** 

TeamsRouter.get("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const id = req.params.id;
        const Team = await Team.findById(id).populate("user");
        if (Team) {
            res.send(Team);
        } else {
            next(createError(404, `Team ${req.params.id} not found`));
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while getting Team"));
    }
});

//**************** EDIT SPECIFIC Team **************** 

TeamsRouter.put("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const accomId = req.params.id
        const modifiedAccommodation = await Team.findOneAndUpdate({ _id: accomId, user: { _id: req.user._id } }, req.body, { new: true, runValidators: true })
        if (modifiedAccommodation) {
            res.send(modifiedAccommodation)
        } else {
            next(createError(404, 'Accommodation not found! OR You are NOT Authorized!'))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while modifying Team"))
    }

    // try {
    // 	const Team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    // 		runValidators: true,
    // 		new: true,
    // 	});
    // 	if (Team) {
    // 		res.send(Team);
    // 	} else {
    // 		next(createError(404, `Team ${req.params.id} not found`));
    // 	}
    // } catch (error) {
    // 	console.log(error);
    // 	next(createError(500, "An error occurred while modifying Team"));
    // }
});

//**************** DELETE SPECIFIC Team **************** 

TeamsRouter.delete("/:id", JWTMiddleware, async (req, res, next) => {
    try {
        const accomId = req.params.id
        const deletedAccommodation = await Team.findOneAndDelete({ _id: accomId, user: { _id: req.user._id } })
        if (deletedAccommodation) {
            res.status(204).send()
        } else {
            next(createError(404, 'Accommodation not found! OR You are NOT Authorized!'))
        }
    } catch (error) {
        console.log(error);
        next(createError(500, "An error occurred while deleting Team"))
    }
    // try {
    // 	const Team = await Team.findByIdAndDelete(req.params.id).populate("user");
    // 	if (Team) {
    // 		res.status(204).send();
    // 	} else {
    // 		next(createError(404, `Team ${req.params.id} not found`));
    // 	}
    // } catch (error) {
    // 	console.log(error);
    // 	next(createError(500, "An error occurred while deleting Team"));
    // }
});

export default TeamsRouter;