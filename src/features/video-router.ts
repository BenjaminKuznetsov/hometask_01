import { Router, Request, Response } from "express"
import { db } from "../app"
import { HttpStatusCodes } from "../../lib/httpStatusCodes"
import {
  ApiErrorType,
  FieldErrorType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  VideoResolutions,
  VideoType,
} from "../types"
import { CreateVideoInputModel } from "./models/CreateVideoInputModel"
import { UpdateVideoInputModel } from "./models/UpdateVideoInputModel"

export const videosRouter = Router()

const videoMapper = (video: VideoType) => {
  return {
    id: video.id,
    title: video.title,
    author: video.author,
    canBeDownloaded: video.canBeDownloaded,
    minAgeRestriction: video.minAgeRestriction,
    createdAt: video.createdAt,
    publicationDate: video.publicationDate,
    availableResolutions: video.availableResolutions,
  }
}

const validate_Title = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (!value) {
    errorsMessages.push({
      message: "Title is required",
      field: "title",
    })
    return
  }

  if (typeof value !== "string") {
    errorsMessages.push({
      message: "Title should be a string",
      field: "title",
    })
    return
  }

  if (value.length > 40) {
    errorsMessages.push({
      message: "Max length of title is 40 characters",
      field: "title",
    })
  }
}
const validate_Author = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (!value) {
    errorsMessages.push({
      message: "Author is required",
      field: "author",
    })
    return
  }

  if (typeof value !== "string") {
    errorsMessages.push({
      message: "Author should be a string",
      field: "author",
    })
    return
  }

  if (value.length > 20) {
    errorsMessages.push({
      message: "Max length of author is 20 characters",
      field: "author",
    })
    return
  }
}
const validate_AvailableResolutions = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (value === undefined) return
  if (value === null) return
  if (!Array.isArray(value)) {
    errorsMessages.push({
      message: "AvailableResolutions should be an array",
      field: "availableResolutions",
    })
    return
  }

  if (value.length === 8) {
    errorsMessages.push({
      message: "AvailableResolutions shouldn't be an empty array",
      field: "availableResolutions",
    })
  }

  if (value.find((value) => !Object.values(VideoResolutions).includes(value))) {
    errorsMessages.push({
      message: "Allowed values are [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
      field: "availableResolutions",
    })
  }
}

const validate_CanBeDownloaded = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (value === undefined) return
  if (typeof value !== "boolean") {
    errorsMessages.push({
      message: "CanBeDownloaded should be a boolean",
      field: "canBeDownloaded",
    })
  }
}
const validate_MinAgeRestriction = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (value === undefined) return
  if (value === null) return
  if (typeof value !== "number") {
    errorsMessages.push({
      message: "MinAgeRestriction should be a number or null",
      field: "minAgeRestriction",
    })
    return
  }
  if (value < 1 || value > 18 || !Number.isInteger(value)) {
    errorsMessages.push({
      message: "MinAgeRestriction should be an integer from 1 to 18",
      field: "minAgeRestriction",
    })
  }
}
const validate_PublicationDate = (value: unknown, errorsMessages: FieldErrorType[]) => {
  if (value === undefined) return
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    errorsMessages.push({
      message: "PublicationDate should be an ISO String",
      field: "publicationDate",
    })
  }
}

videosRouter.get("/", (req: Request, res: Response<VideoType[]>) => {
  const videos = db.videos.map(videoMapper)
  res.status(HttpStatusCodes.OK).json(videos)
})

videosRouter.get("/:id", (req: RequestWithParams<{ id: string }>, res: Response<VideoType>) => {
  const videoId = Number(req.params.id)
  if (isNaN(videoId)) {
    res.sendStatus(HttpStatusCodes.NotFound)
    return
  }

  const video = db.videos.find((video) => video.id === videoId)
  if (!video) {
    res.sendStatus(HttpStatusCodes.NotFound)
    return
  }
  const mappedVideo = videoMapper(video)
  res.status(HttpStatusCodes.OK).json(mappedVideo)
})

videosRouter.post("/", (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoType | ApiErrorType>) => {
  const video = req.body
  const errorsMessages: FieldErrorType[] = []

  validate_Title(video.title, errorsMessages)
  validate_Author(video.author, errorsMessages)
  validate_AvailableResolutions(video.availableResolutions, errorsMessages)
  if (errorsMessages.length > 0) {
    res.status(HttpStatusCodes.BadRequest).json({ errorsMessages })
    return
  }

  const createdDate = new Date()
  const createdAt = createdDate.toISOString()
  const publicationDate = new Date(createdDate.setDate(createdDate.getDate() + 1)).toISOString()

  const newVideo: VideoType = {
    id: db.videos.length + 1,
    title: video.title,
    author: video.author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt,
    publicationDate: publicationDate,
    availableResolutions: video.availableResolutions || null,
  }
  db.videos.push(newVideo)
  res.status(HttpStatusCodes.Created).json(newVideo)
})

videosRouter.put("/:id", (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoInputModel>, res: Response) => {
  const errorsMessages: FieldErrorType[] = []
  const videoId = Number(req.params.id)

  if (isNaN(videoId)) {
    errorsMessages.push({ message: "Id should be an integer number", field: null })
    res.status(HttpStatusCodes.BadRequest).json({ errorsMessages })
    return
  }

  const foundVideo = db.videos.find((video) => video.id === videoId)
  if (!foundVideo) {
    res.sendStatus(HttpStatusCodes.NotFound)
    return
  }

  const video = req.body

  validate_Title(video.title, errorsMessages)
  validate_Author(video.author, errorsMessages)
  validate_AvailableResolutions(video.availableResolutions, errorsMessages)
  validate_CanBeDownloaded(video.canBeDownloaded, errorsMessages)
  validate_MinAgeRestriction(video.minAgeRestriction, errorsMessages)
  validate_PublicationDate(video.publicationDate, errorsMessages)
  if (errorsMessages.length > 0) {
    res.status(HttpStatusCodes.BadRequest).json({ errorsMessages })
    return
  }

  foundVideo.title = video.title
  foundVideo.author = video.author
  foundVideo.canBeDownloaded = video.canBeDownloaded ?? foundVideo.canBeDownloaded
  foundVideo.minAgeRestriction = video.minAgeRestriction ?? foundVideo.minAgeRestriction
  foundVideo.availableResolutions = video.availableResolutions ?? foundVideo.availableResolutions
  foundVideo.publicationDate = video.publicationDate ?? foundVideo.publicationDate
  res.sendStatus(HttpStatusCodes.NoContent)
})

videosRouter.delete("/:id", (req: RequestWithParams<{ id: string }>, res: Response) => {
  const videoId = Number(req.params.id)

  const foundVideo = db.videos.find((video) => video.id === videoId)

  if (!foundVideo) {
    res.sendStatus(HttpStatusCodes.NotFound)
    return
  }

  db.videos = db.videos.filter((video) => video.id !== videoId)
  res.sendStatus(HttpStatusCodes.NoContent)
})
