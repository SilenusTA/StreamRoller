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

class StaticTextOverlay
{
    // ============================================================================
    //                           FUNCTION: constructor
    // ============================================================================
    constructor ()
    {
        this.statictextsettings = {
            enabled: "on",
            fontsize: "30px",
            posX: "10%",
            posY: "10%",
            height: "1rm",
            width: "500px",
            backgroundalpha: "50",
            text: ""
        }
        return true;
    }
    // ============================================================================
    //                           FUNCTION: update
    // ============================================================================
    update (data)
    {
        let element = document.getElementById("statictextoverlay")

        if (data.triggerparams.textMessage)
            // use the standard data returned from the trigger if available
            element.innerHTML = data.triggerparams.textMessage
        else
            // use the action message
            element.innerHTML = data.message
    }
    // ============================================================================
    //                           FUNCTION: getSettingscode
    // ============================================================================
    getSettingscode ()
    {
        let overlaysnippit = ""

        overlaysnippit += '<HR><H1>Static Text overlay</H1>'
        overlaysnippit += '<p>Displays static text</p>'

        overlaysnippit += '<div class="form-group">'
        overlaysnippit += '<div class="form-check form-check-inline">'
        if (this.statictextsettings.enabled.indexOf("on") > -1)
            overlaysnippit += '<input class="form-check-input" name="statictextoverlay_enabled" type="checkbox" id="statictextoverlay_enabled" checked>'
        else
            overlaysnippit += '<input class="form-check-input" name="statictextoverlay_enabled" type="checkbox" id="statictextoverlay_enabled">'
        overlaysnippit += '<label class="form-check-label" for="statictextoverlay_enabled">Enable/Disable</label></div>'


        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for= "statictextoverlay_fontsize" class= "col-form-label col-lg-3" >Fontsize</label >'
        overlaysnippit += '<input type="text" class="col-lg-1" name="statictextoverlay_fontsize" id="statictextoverlay_fontsize" value="' + this.statictextsettings.fontsize + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="statictextoverlay_posX" class="col-form-label col-lg-3">X Position</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="statictextoverlay_posX" id="statictextoverlay_posX" value="' + this.statictextsettings.posX + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="statictextoverlay_posY" class="col-form-label col-lg-3">Y Position</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="statictextoverlay_posY" id="statictextoverlay_posY" value="' + this.statictextsettings.posY + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="statictextoverlay_height" class="col-form-label col-lg-3">Height</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="statictextoverlay_height" id="statictextoverlay_height" value="' + this.statictextsettings.height + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="statictextoverlay_width" class="col-form-label col-lg-3">Width</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="statictextoverlay_width" id="statictextoverlay_width" value="' + this.statictextsettings.width + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group row-2 text-center">'
        overlaysnippit += '<label for="statictextoverlay_backgroundalpha" class="form-label">Background Alpha</label>'

        overlaysnippit += '<input type="range" class="form-range" name="statictextoverlay_backgroundalpha" id="statictextoverlay_backgroundalpha" min="0" max="255" step="1"'
        overlaysnippit += 'onInput="$(\'#statictextoverlay_backgroundalpharangeval\').html($(this).val())" value="' + this.statictextsettings.backgroundalpha + '">'
        overlaysnippit += '</div>'
        overlaysnippit += '</div>'

        return overlaysnippit
    }
    // ============================================================================
    //                           FUNCTION: setSettings
    // ============================================================================
    setSettings (data)
    {
        for (const [key, value] of Object.entries(this.statictextsettings))
        {
            if (data["statictextoverlay_" + key] && data["statictextoverlay_" + key].indexOf("on") > -1 && data["statictextoverlay_" + key])
                this.statictextsettings[key] = "on";
            else if ("statictextoverlay_" + key in data)
                this.statictextsettings[key] = data["statictextoverlay_" + key];
        }
        // if we have turned off themain overlay then we need to trunours off as well
        if (data.overlaysourcesenabled.indexOf("off") > -1)
            this.statictextsettings.enabled = "off"
        //set our overlay appropriatly
        let parent = document.getElementById("statictextoverlay")
        if (this.statictextsettings.enabled.indexOf("on") > -1)
            parent.style.visibility = "visible";
        else
            parent.style.visibility = "hidden";
    }
    // ============================================================================
    //                           FUNCTION: getTriggers
    // ============================================================================
    getTriggers (channel)
    {
        // we have no trigger we generate
        return false;
    }
    // ============================================================================
    //                           FUNCTION: setSettings
    // ============================================================================

    getActions (channel)
    {
        // return the action to enable extensions to send us data to display
        return {
            name: "StaticTextOverlay",
            displaytitle: "Static Text Overlay",
            description: "Static Text Display.",
            messagetype: "action_StaticTextOverlay",
            channel: channel,
            parameters: { message: "name of this overlay", count: "10" }
        };
    }

}