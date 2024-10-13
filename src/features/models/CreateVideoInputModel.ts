import { VideoResolutions } from "../../types"

export type CreateVideoInputModel = {
  title: string
  author: string
  availableResolutions?: VideoResolutions[]
}
