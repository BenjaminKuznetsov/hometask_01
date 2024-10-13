import request from "supertest"
import { app } from "../src/app"

describe("/videos", () => {
  it("should return status 200", async () => {
    await request(app).get("/").expect(200)
  })
})
