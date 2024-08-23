/**
 *      StreamRoller Copyright 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 *      StreamRoller is an all in one streaming solution designed to give a single
 *      'second monitor' control page and allow easy integration for configuring
 *      content (ie. tweets linked to chat, overlays triggered by messages, hue lights
 *      controlled by donations etc)
 * 
 *      This program is free software: you can redistribute it and/or modify
 *      it under the terms of the GNU Affero General Public License as published
 *      by the Free Software Foundation, either version 3 of the License, or
 *      (at your option) any later version.
 * 
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU Affero General Public License for more details.
 * 
 *      You should have received a copy of the GNU Affero General Public License
 *      along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// ############################## FOLLOWER.js ##################################
// Main overlay script file. This is a demo file to show how to link the backend
// into your overlay and trigger alters, onscreen data etc
// -------------------------- Creation ----------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// Datatype : JSON message as provided by streamlabs api.
// Date: 14-Jan-2021
// ----------------------------- notes ----------------------------------------
// Demo code to show how to create an overlay using the data server
// ============================================================================


// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
function follow_cmd (name)
{
	var elem;

	/* Alert box header */
	elem = document.getElementById('Alert_Header');
	elem.innerHTML = "<span>New follower</span>";

	/* Alert box left Image */
	elem = document.getElementById('Alert_ImageL');
	elem.style.content = 'url(follow_image.gif)';

	/* Alert box content text */
	elem = document.getElementById('Alert_ContentText');
	elem.innerHTML = name;

	/* play our sound file*/
	var simple = new Audio('Murloc.mp3');
	simple.loop = false;
	simple.volume = 0.5;
	simple.load();

	window.setTimeout(function ()
	{
		/* NOTE: This line will cause a DOM error if the browser doesn't allow autoplay.
			Most browsers will have this as default for security but OBS has this off to allow the
			autoplay of sounds. Test in OBS or change browser settings if needed.
		*/
		simple.play();
		simple.onended = function () { simple.remove(); };
		/*********REANIMATE*************/
		element = document.getElementById('Alert_Container');
		// -> removing the class
		element.classList.remove("ABClass");
		// -> trigger a restart (need a change to happen)
		void element.offsetWidth;
		// -> and re-adding the class
		element.classList.add("ABClass");
		//Unhide the overlay
		element.style.display = "block";
		/********************************* */
	}, 100);

	/* wait 10 seconds and remove alter code from HTML*/
	window.setTimeout(function ()
	{
		document.getElementById('Alert_Container').style.display = "none";
	}, 10000);

}		