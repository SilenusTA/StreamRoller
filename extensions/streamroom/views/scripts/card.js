/*
 Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// dragable class for creating a dragable card

class Card
{
    // ============================================================================
    //                          Constructor
    // ============================================================================
    constructor (order, divid)
    {
        this.order = order;
        this.cardelement = divid;
        // set the initial element up and add the handlers
        this.init(document.getElementById(divid));
    }
    // ============================================================================
    //                          Drag Card
    // ============================================================================
    init (elmnt)
    {
        elmnt.style.order = this.order;
    }
    setposition (order)
    {
        document.getElementById(this.cardelement).style.order = order;
        this.order = order;
    }
    get position ()
    {
        return this.order
    }

}


