import request from "supertest"
import { app } from "../src/settings"

describe("/videos", () => {
  it("should return status 200", async () => {
    await request(app).get("/").expect(200)
  })
})
