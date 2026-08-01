import { setupWorker } from "msw/browser"

import { auctionHandlers } from "@/entities/auction/api/mocks/handlers"

export const worker = setupWorker(...auctionHandlers)
