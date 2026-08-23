import { postsService } from "./posts.service.js";
const userId = (req) => req.headers["x-user-id"];
const postId = (req) => String(req.params.id);
export class PostsController {
    list = async (req, res, next) => {
        try {
            res.json(await postsService.list(req.headers["x-user-id"]));
        }
        catch (error) {
            next(error);
        }
    };
    get = async (req, res, next) => {
        try {
            res.json(await postsService.getById(postId(req), req.headers["x-user-id"]));
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            res.status(201).json(await postsService.create(userId(req), req.body));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            res.json(await postsService.update(postId(req), userId(req), req.body));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await postsService.delete(postId(req), userId(req));
            res.status(204).end();
        }
        catch (error) {
            next(error);
        }
    };
    like = async (req, res, next) => {
        try {
            res.json(await postsService.like(postId(req), userId(req), true));
        }
        catch (error) {
            next(error);
        }
    };
    unlike = async (req, res, next) => {
        try {
            res.json(await postsService.like(postId(req), userId(req), false));
        }
        catch (error) {
            next(error);
        }
    };
    bookmark = async (req, res, next) => {
        try {
            res.json(await postsService.bookmark(postId(req), userId(req), true));
        }
        catch (error) {
            next(error);
        }
    };
    unbookmark = async (req, res, next) => {
        try {
            res.json(await postsService.bookmark(postId(req), userId(req), false));
        }
        catch (error) {
            next(error);
        }
    };
}
export const postsController = new PostsController();
//# sourceMappingURL=posts.controller.js.map