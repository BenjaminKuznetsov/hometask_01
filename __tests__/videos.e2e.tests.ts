import request from "supertest"
import { app } from "../src/app"
import { PATHS } from "../lib/paths"
import { HttpStatusCodes } from "../lib/httpStatusCodes"

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete(PATHS.CLEAR_DB)
  })

  it("should return status 200 and empty array", async () => {
    await request(app).get(PATHS.VIDEOS).expect(200, [])
  })

  it("should return status 404 for not existing video", async () => {
    await request(app).get(`${PATHS.VIDEOS}/1`).expect(404)
  })

  it("shouldn't create video with incorrect title", async () => {
    await request(app)
      .post(PATHS.VIDEOS)
      .send({
        title: "",
        author: "a1",
        availableResolution: ["P144"],
      })
      .expect(HttpStatusCodes.BadRequest)
  })

  it("shouldn't create video with incorrect author", async () => {
    await request(app)
      .post(PATHS.VIDEOS)
      .send({
        title: "t1",
        author: "",
        availableResolution: ["P144"],
      })
      .expect(HttpStatusCodes.BadRequest)
  })

  // it("shouldn't create video with incorrect availableResolution", async () => {
  //   await request(app)
  //     .post(PATHS.VIDEOS)
  //     .send({
  //       title: "t1",
  //       author: "a1",
  //       availableResolution: ["P1340"],
  //     })
  //     .expect(HttpStatusCodes.BadRequest)
  // })

  it("should create video with correct data", async () => {
    const newVideo = {
      title: "t1",
      author: "a1",
      availableResolution: ["P144"],
    }
    const { body: createdVideo } = await request(app).post(PATHS.VIDEOS).send(newVideo).expect(201)

    expect(createdVideo.id).toBeDefined()
    expect(createdVideo.title).toBe(newVideo.title)
    expect(createdVideo.author).toBe(newVideo.author)
    expect(createdVideo.availableResolution).toStrictEqual(newVideo.availableResolution)
    expect(createdVideo.minAgeRestriction).toBeDefined()
    expect(createdVideo.createdAt).toBeDefined()
    expect(createdVideo.publicationDate).toBeDefined()
    expect(createdVideo.canBeDownloaded).toBeDefined()
  })
})
