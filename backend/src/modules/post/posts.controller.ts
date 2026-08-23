import { Request, Response, NextFunction } from "express";
import { postsService } from "./posts.service.js";

const userId = (req: Request) => req.headers["x-user-id"] as string;
const postId = (req: Request) => String(req.params.id);

export class PostsController {
    list = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.list(req.headers["x-user-id"] as string | undefined)); } catch (error) { next(error); }
    };
    get = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.getById(postId(req), req.headers["x-user-id"] as string | undefined)); } catch (error) { next(error); }
    };
    create = async (req: Request, res: Response, next: NextFunction) => {
        try { res.status(201).json(await postsService.create(userId(req), req.body)); } catch (error) { next(error); }
    };
    update = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.update(postId(req), userId(req), req.body)); } catch (error) { next(error); }
    };
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try { await postsService.delete(postId(req), userId(req)); res.status(204).end(); } catch (error) { next(error); }
    };
    like = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.like(postId(req), userId(req), true)); } catch (error) { next(error); }
    };
    unlike = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.like(postId(req), userId(req), false)); } catch (error) { next(error); }
    };
    bookmark = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.bookmark(postId(req), userId(req), true)); } catch (error) { next(error); }
    };
    unbookmark = async (req: Request, res: Response, next: NextFunction) => {
        try { res.json(await postsService.bookmark(postId(req), userId(req), false)); } catch (error) { next(error); }
    };
}

export const postsController = new PostsController();
