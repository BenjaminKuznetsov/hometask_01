import { VideoResolutions } from "../../types"

export type UpdateVideoInputModel = {
  title: string
  author: string
  availableResolutions?: VideoResolutions[]
  canBeDownloaded?: boolean
  minAgeRestriction?: number
  publicationDate?: string
}
