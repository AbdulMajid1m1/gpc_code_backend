import express from "express";
import hsCodeRoutes from "./hsCodeRoutes.js";
import gridRoutes from "./gridRoutes.js";
import schemaRoutes from "./schemaRoutes.js";

const router = express.Router();
router.get("/", (req, res) => {
    res.send("Api is working!");
});

router.use("/", hsCodeRoutes)
router.use("/", gridRoutes)
router.use("/", schemaRoutes)


export default router;
