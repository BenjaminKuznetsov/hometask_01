"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./features/video-router");
const types_1 = require("./types");
const httpStatusCodes_1 = require("../lib/httpStatusCodes");
const urls_1 = require("../lib/urls");
exports.app = (0, express_1.default)();
exports.db = {
    videos: [
        {
            id: 1,
            title: "Introduction to TypeScript",
            author: "John Doe",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-09-20T08:15:30.000Z",
            publicationDate: "2024-09-22T10:30:00.000Z",
            availableResolutions: [types_1.VideoResolutions.P144, types_1.VideoResolutions.P720, types_1.VideoResolutions.P1080],
        },
        {
            id: 2,
            title: "Mastering Node.js",
            author: "Jane Smith",
            canBeDownloaded: false,
            minAgeRestriction: 18,
            createdAt: "2024-08-10T12:45:15.000Z",
            publicationDate: "2024-08-12T14:00:00.000Z",
            availableResolutions: [types_1.VideoResolutions.P144, types_1.VideoResolutions.P480],
        },
        {
            id: 3,
            title: "React for Beginners",
            author: "Emily Clark",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: "2024-07-25T09:00:00.000Z",
            publicationDate: "2024-07-27T11:15:45.000Z",
            availableResolutions: [types_1.VideoResolutions.P144, types_1.VideoResolutions.P360, types_1.VideoResolutions.P720],
        },
    ],
};
exports.app.use(express_1.default.json());
exports.app.use(urls_1.URLs.VIDEOS, video_router_1.videosRouter);
exports.app.get(urls_1.URLs.HOME, (req, res) => {
    let helloPhrase = "Hometask 01, V1";
    res.send(helloPhrase);
});
exports.app.delete(urls_1.URLs.CLEAR_DB, (req, res) => {
    exports.db.videos = [];
    res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NoContent);
});
