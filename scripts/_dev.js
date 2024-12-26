/* = = = SKIP_MENU = = =
 * Variable responsible for skipping menus
 * dependant_on -> none
 * true -> skips menus
 */
export const SKIP_MENU = false;

/* = = = AUTO_NEXT_LEVEL = = =
 * Variable responsible for automatically starting next levels
 * dependant_on -> SKIP_MENU / must be true
 * false -> retry
 * true -> next level
 */
export const AUTO_NEXT_LEVEL = true;

/* = = = STARTING_LEVEL = = =
 * Variable responsible for starting on specified level
 * dependant_on -> none
 * -1 -> default behavior
 * <0; inf> -> game will start on this level
 */
export const STARTING_LEVEL = 2;