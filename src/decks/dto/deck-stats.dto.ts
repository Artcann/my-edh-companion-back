import { DeckColorsDTO } from "./deck-colors.dto";

export class DeckStatsDTO {
  colors: DeckColorsDTO
  salt: number
  ccm: number
  total_cards: number
}