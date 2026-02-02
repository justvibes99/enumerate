import type { DataSet } from "../types";
import { usStateCapitals } from "./built-in-sets/us-state-capitals";
import { periodicTable } from "./built-in-sets/periodic-table";
import { classicalComposers } from "./built-in-sets/classical-composers";
import { worldCapitals } from "./built-in-sets/world-capitals";
import { romanNumerals } from "./built-in-sets/roman-numerals";
import { natoAlphabet } from "./built-in-sets/nato-alphabet";
import { greekAlphabet } from "./built-in-sets/greek-alphabet";
import { morseCode } from "./built-in-sets/morse-code";
import { greekRomanGods } from "./built-in-sets/greek-roman-gods";
import { usPresidents } from "./built-in-sets/us-presidents";
import { famousPaintings } from "./built-in-sets/famous-paintings";
import { worldCurrencies } from "./built-in-sets/world-currencies";
import { chemicalCompounds } from "./built-in-sets/chemical-compounds";
import { famousInventions } from "./built-in-sets/famous-inventions";
import { worldLanguages } from "./built-in-sets/world-languages";

export const BUILT_IN_SETS: DataSet[] = [
  usStateCapitals,
  periodicTable,
  classicalComposers,
  worldCapitals,
  romanNumerals,
  natoAlphabet,
  greekAlphabet,
  morseCode,
  greekRomanGods,
  usPresidents,
  famousPaintings,
  worldCurrencies,
  chemicalCompounds,
  famousInventions,
  worldLanguages,
];
