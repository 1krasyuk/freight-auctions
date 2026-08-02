import { getAuctionHandler } from "./get-auction-handler"
import { listAuctionBetsHandler } from "./list-auction-bets-handler"
import { listAuctionsHandler } from "./list-auctions-handler"
import { setAuctionBetHandler } from "./set-auction-bet-handler"

export const auctionHandlers = [
  listAuctionsHandler,
  getAuctionHandler,
  listAuctionBetsHandler,
  setAuctionBetHandler,
]
