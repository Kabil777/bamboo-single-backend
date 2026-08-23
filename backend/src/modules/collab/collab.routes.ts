import { Router } from "express";
import { CollabController } from "./collab.controller.js";
import { CollabServer } from "../../ws/servers/CollabServer.js";

export function createCollabRouter(collabServer: CollabServer): Router {
    const router = Router();
    const controller = new CollabController(collabServer);

    // Blog save & role routes
    router.post("/blog/save/:id", controller.handleSaveBlog);
    router.get("/blog/role/:id", controller.handleGetBlogRole);
    router.get("/blog/:id/roles", controller.handleListBlogRoles);
    router.post("/blog/:id/roles", controller.handleAddBlogRole);
    router.patch("/blog/:id/roles", controller.handleUpdateBlogRole);
    router.delete("/blog/:id/roles", controller.handleDeleteBlogRole);

    // Docs save & role routes
    router.post("/docs/save/:id", controller.handleSaveDocs);
    router.get("/docs/role/:id", controller.handleGetDocsRole);
    router.get("/docs/:id/roles", controller.handleListDocsRoles);
    router.post("/docs/:id/roles", controller.handleAddDocsRole);
    router.patch("/docs/:id/roles", controller.handleUpdateDocsRole);
    router.delete("/docs/:id/roles", controller.handleDeleteDocsRole);

    return router;
}
