/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// es-lint globals to stop red highlights in vscode
/* global localConfig */


// ============================================================================
//                           reOrderCard
//      called from the reorder buttons in the title bar of the cards
// ============================================================================
function reOrderCard (cardname, direction)
{
    let card1 = localConfig.cards[cardname];
    let card1position = card1.position;
    /* find who has the position we are moving to*/
    //for (let i = 0; i < localConfig.cards.len; i++)
    for (const [key, value] of Object.entries(localConfig.cards))
    {
        // if we have a matched position we need to swap them
        if (value.position == (card1.position + direction))
        {
            card1.setposition(value.position);
            value.setposition(card1position);

        }
    }

}