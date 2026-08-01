import { getAuctionHandler } from "./get-auction-handler"
import { listAuctionsHandler } from "./list-auctions-handler"

export const auctionHandlers = [listAuctionsHandler, getAuctionHandler]
