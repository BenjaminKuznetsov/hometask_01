import express, { Request, Response } from "express"
import { videosRouter } from "./features/video-router"
import { VideoResolutions, VideoType } from "./types"
import { HttpStatusCodes } from "../lib/httpStatusCodes"
import { PATHS } from "../lib/paths"
export const app = express()

export const db: { videos: VideoType[] } = {
  videos: [
    {
      id: 1,
      title: "Introduction to TypeScript",
      author: "John Doe",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2024-09-20T08:15:30.000Z",
      publicationDate: "2024-09-22T10:30:00.000Z",
      availableResolutions: [VideoResolutions.P144, VideoResolutions.P720, VideoResolutions.P1080],
    },
    {
      id: 2,
      title: "Mastering Node.js",
      author: "Jane Smith",
      canBeDownloaded: false,
      minAgeRestriction: 18,
      createdAt: "2024-08-10T12:45:15.000Z",
      publicationDate: "2024-08-12T14:00:00.000Z",
      availableResolutions: [VideoResolutions.P144, VideoResolutions.P480],
    },
    {
      id: 3,
      title: "React for Beginners",
      author: "Emily Clark",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2024-07-25T09:00:00.000Z",
      publicationDate: "2024-07-27T11:15:45.000Z",
      availableResolutions: [VideoResolutions.P144, VideoResolutions.P360, VideoResolutions.P720],
    },
  ],
}

app.use(express.json())
app.use(PATHS.VIDEOS, videosRouter)

app.get(PATHS.HOME, (req: Request, res: Response) => {
  let helloPhrase = "Hometask 01, V1"
  res.send(helloPhrase)
})

app.delete(PATHS.CLEAR_DB, (req: Request, res: Response) => {
  db.videos = []
  res.sendStatus(HttpStatusCodes.NoContent)
})
