"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const settings_1 = require("../settings");
const httpStatusCodes_1 = require("../../lib/httpStatusCodes");
const types_1 = require("../types");
exports.videosRouter = (0, express_1.Router)();
const videoMapper = (video) => {
    return {
        id: video.id,
        title: video.title,
        author: video.author,
        canBeDownloaded: video.canBeDownloaded,
        minAgeRestriction: video.minAgeRestriction,
        createdAt: video.createdAt,
        publicationDate: video.publicationDate,
        availableResolutions: video.availableResolutions,
    };
};
const validate_Title = (value, errorsMessages) => {
    if (!value) {
        errorsMessages.push({
            message: "Title is required",
            field: "title",
        });
        return;
    }
    if (typeof value !== "string") {
        errorsMessages.push({
            message: "Title should be a string",
            field: "title",
        });
        return;
    }
    if (value.length > 40) {
        errorsMessages.push({
            message: "Max length of title is 40 characters",
            field: "title",
        });
    }
};
const validate_Author = (value, errorsMessages) => {
    if (!value) {
        errorsMessages.push({
            message: "Author is required",
            field: "author",
        });
        return;
    }
    if (typeof value !== "string") {
        errorsMessages.push({
            message: "Author should be a string",
            field: "author",
        });
        return;
    }
    if (value.length > 20) {
        errorsMessages.push({
            message: "Max length of author is 20 characters",
            field: "author",
        });
        return;
    }
};
const validate_AvailableResolutions = (value, errorsMessages) => {
    if (value === undefined)
        return;
    if (value === null)
        return;
    if (!Array.isArray(value)) {
        errorsMessages.push({
            message: "AvailableResolutions should be an array",
            field: "availableResolutions",
        });
        return;
    }
    if (value.length === 8) {
        errorsMessages.push({
            message: "AvailableResolutions shouldn't be an empty array",
            field: "availableResolutions",
        });
    }
    if (value.find((value) => !Object.values(types_1.VideoResolutions).includes(value))) {
        errorsMessages.push({
            message: "Allowed values are [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
            field: "availableResolutions",
        });
    }
};
const validate_CanBeDownloaded = (value, errorsMessages) => {
    if (value === undefined)
        return;
    if (typeof value !== "boolean") {
        errorsMessages.push({
            message: "CanBeDownloaded should be a boolean",
            field: "canBeDownloaded",
        });
    }
};
const validate_MinAgeRestriction = (value, errorsMessages) => {
    if (value === undefined)
        return;
    if (value === null)
        return;
    if (typeof value !== "number") {
        errorsMessages.push({
            message: "MinAgeRestriction should be a number or null",
            field: "minAgeRestriction",
        });
        return;
    }
    if (value < 1 || value > 18 || !Number.isInteger(value)) {
        errorsMessages.push({
            message: "MinAgeRestriction should be an integer from 1 to 18",
            field: "minAgeRestriction",
        });
    }
};
const validate_PublicationDate = (value, errorsMessages) => {
    if (value === undefined)
        return;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        errorsMessages.push({
            message: "PublicationDate should be an ISO String",
            field: "publicationDate",
        });
    }
};
exports.videosRouter.get("/", (req, res) => {
    const videos = settings_1.db.videos.map(videoMapper);
    res.status(httpStatusCodes_1.HttpStatusCodes.OK).json(videos);
});
exports.videosRouter.get("/:id", (req, res) => {
    const videoId = Number(req.params.id);
    if (isNaN(videoId)) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NotFound);
        return;
    }
    const video = settings_1.db.videos.find((video) => video.id === videoId);
    if (!video) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NotFound);
        return;
    }
    const mappedVideo = videoMapper(video);
    res.status(httpStatusCodes_1.HttpStatusCodes.OK).json(mappedVideo);
});
exports.videosRouter.post("/", (req, res) => {
    const video = req.body;
    const errorsMessages = [];
    validate_Title(video.title, errorsMessages);
    validate_Author(video.author, errorsMessages);
    validate_AvailableResolutions(video.availableResolutions, errorsMessages);
    if (errorsMessages.length > 0) {
        res.status(httpStatusCodes_1.HttpStatusCodes.BadRequest).json({ errorsMessages });
        return;
    }
    const createdDate = new Date();
    const createdAt = createdDate.toISOString();
    const publicationDate = new Date(createdDate.setDate(createdDate.getDate() + 1)).toISOString();
    const newVideo = {
        id: settings_1.db.videos.length + 1,
        title: video.title,
        author: video.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt,
        publicationDate: publicationDate,
        availableResolutions: video.availableResolutions || null,
    };
    settings_1.db.videos.push(newVideo);
    res.status(httpStatusCodes_1.HttpStatusCodes.Created).json(newVideo);
});
exports.videosRouter.put("/:id", (req, res) => {
    var _a, _b, _c, _d;
    const errorsMessages = [];
    const videoId = Number(req.params.id);
    if (isNaN(videoId)) {
        errorsMessages.push({ message: "Id should be an integer number", field: null });
        res.status(httpStatusCodes_1.HttpStatusCodes.BadRequest).json({ errorsMessages });
        return;
    }
    const foundVideo = settings_1.db.videos.find((video) => video.id === videoId);
    if (!foundVideo) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NotFound);
        return;
    }
    const video = req.body;
    validate_Title(video.title, errorsMessages);
    validate_Author(video.author, errorsMessages);
    validate_AvailableResolutions(video.availableResolutions, errorsMessages);
    validate_CanBeDownloaded(video.canBeDownloaded, errorsMessages);
    validate_MinAgeRestriction(video.minAgeRestriction, errorsMessages);
    validate_PublicationDate(video.publicationDate, errorsMessages);
    if (errorsMessages.length > 0) {
        res.status(httpStatusCodes_1.HttpStatusCodes.BadRequest).json({ errorsMessages });
        return;
    }
    foundVideo.title = video.title;
    foundVideo.author = video.author;
    foundVideo.canBeDownloaded = (_a = video.canBeDownloaded) !== null && _a !== void 0 ? _a : foundVideo.canBeDownloaded;
    foundVideo.minAgeRestriction = (_b = video.minAgeRestriction) !== null && _b !== void 0 ? _b : foundVideo.minAgeRestriction;
    foundVideo.availableResolutions = (_c = video.availableResolutions) !== null && _c !== void 0 ? _c : foundVideo.availableResolutions;
    foundVideo.publicationDate = (_d = video.publicationDate) !== null && _d !== void 0 ? _d : foundVideo.publicationDate;
    res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NoContent);
});
exports.videosRouter.delete("/:id", (req, res) => {
    const videoId = Number(req.params.id);
    const foundVideo = settings_1.db.videos.find((video) => video.id === videoId);
    if (!foundVideo) {
        res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NotFound);
        return;
    }
    settings_1.db.videos = settings_1.db.videos.filter((video) => video.id !== videoId);
    res.sendStatus(httpStatusCodes_1.HttpStatusCodes.NoContent);
});
