import { getAuctionHandler } from "./get-auction-handler"
import { listAuctionBetsHandler } from "./list-auction-bets-handler"
import { listAuctionsHandler } from "./list-auctions-handler"

export const auctionHandlers = [
  listAuctionsHandler,
  getAuctionHandler,
  listAuctionBetsHandler,
]
