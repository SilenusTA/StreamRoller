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
class ScrollTextBanner
{
    // ============================================================================
    //                           FUNCTION: constructor
    // ============================================================================
    constructor ()
    {
        this.bannersettings = {
            enabled: "off",
            fontsize: "30px",
            posX: "80%",
            posY: "50%",
            height: "1rm",
            width: "1000px",
            maxitems: "5",
            speed: "100",
            backgroundalpha: "50"
        }
        this.animationcallback = true
        // array of text string plus data (ie count for number of times to display)
        this.bannertextarray = []
        // add a handler so we can count the animation loops to remove items when their
        // counters expire
        document.getElementById("scrolltextbannercontent").addEventListener(
            'animationiteration',
            () => { this.animationiteration(); }
        )
        return this;
    }
    // ============================================================================
    //                           FUNCTION: animationiteration
    // ============================================================================
    animationiteration ()
    {
        //get a holder to our two elements (the real one and the one we use to work out the size)
        let parent = document.getElementById("scrolltextbanner")
        let element = document.getElementById("scrolltextbannercontent")
        let scrolltext = ""
        let first = true;
        // used to calcualte a new animatin duration so we don't get faster as the strings get longer
        let animationduration = "10"
        element.innerHTML = ""

        while (this.bannertextarray.length > this.bannersettings.maxitems)
            this.bannertextarray.shift()
        //loop our text string array to see if any have expired and build up the on-screen string
        for (let i = 0; i < this.bannertextarray.length; i++)
        {
            // don't add a space between messages if it is the first one
            if (!first)
                scrolltext += "&nbsp&nbsp&nbsp"
            first = false

            // 0 means we need to remove it
            if (this.bannertextarray[i].count == 0)
            {
                this.bannertextarray.splice(i, 1)
                --i; // decrement i as we just removed an item from the array
            }
            else
            {
                scrolltext += this.bannertextarray[i].text
                // if set to -1 we loop forever so ignore those
                if (this.bannertextarray[i].count != -1)
                    this.bannertextarray[i].count--;
            }

        }

        // Main Div settings
        parent.style.top = this.bannersettings.posX
        parent.style.left = this.bannersettings.posY
        parent.style.width = this.bannersettings.width
        parent.style.height = this.bannersettings.height;
        element.style.height = this.bannersettings.height;
        element.style.lineHeight = this.bannersettings.height;
        parent.style.backgroundColor = "rgba(0,0,0," + (this.bannersettings.backgroundalpha / 255) + ")";

        // Main Animated Div settings
        element.innerHTML = scrolltext;
        if (this.bannersettings.enabled == "on")
            parent.style.visibility = "visible";
        else
            parent.style.visibility = "hidden";
        element.style.fontSize = this.bannersettings.fontsize;
        animationduration = element.scrollWidth / this.bannersettings.speed;

        // set the speed (need to work this out using the width)
        element.style.animationDuration = animationduration + "s"

        document.documentElement.style.setProperty('--scrolltextbanner-start-width', parent.getBoundingClientRect().right + "px");
        document.documentElement.style.setProperty('--scrolltextbanner-end-width', -element.scrollWidth + "px");
    }
    // ============================================================================
    //                           FUNCTION: update
    // ============================================================================
    update (data)
    {
        if (data.triggerparams.textMessage)
            this.bannertextarray.push({ text: data.triggerparams.textMessage, count: data.count ? data.count : 10 })
        else
            this.bannertextarray.push({ text: data.message, count: data.count ? data.count : 10 })
        this.animationiteration()
    }
    // ============================================================================
    //                           FUNCTION: getSettingscode
    // ============================================================================
    getSettingscode ()
    {
        let overlaysnippit = ""

        overlaysnippit += '<HR><H1>Scroll Text Banner overlay</H1>'
        overlaysnippit += '<p>Scrolling banner, most values can use with px or % for sizes, updates will be applied the next time the scroll wraps</p>'

        overlaysnippit += '<div class="form-group">'
        overlaysnippit += '<div class="form-check form-check-inline">'
        if (this.bannersettings.enabled == "on")
            overlaysnippit += '<input class="form-check-input" name="scrolltextbanner_enabled" type="checkbox" id="scrolltextbanner_enabled" checked>'
        else
            overlaysnippit += '<input class="form-check-input" name="scrolltextbanner_enabled" type="checkbox" id="scrolltextbanner_enabled">'
        overlaysnippit += '<label class="form-check-label" for="scrolltextbanner_enabled">Enable/Disable</label></div>'


        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for= "scrolltextbanner_fontsize" class= "col-form-label col-lg-3" >Fontsize</label >'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_fontsize" id="scrolltextbanner_fontsize" value="' + this.bannersettings.fontsize + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_posX" class="col-form-label col-lg-3">X Position</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_posX" id="scrolltextbanner_posX" value="' + this.bannersettings.posX + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_posY" class="col-form-label col-lg-3">Y Position</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_posY" id="scrolltextbanner_posY" value="' + this.bannersettings.posY + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_height" class="col-form-label col-lg-3">Height</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_height" id="scrolltextbanner_height" value="' + this.bannersettings.height + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_width" class="col-form-label col-lg-3">Width</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_width" id="scrolltextbanner_width" value="' + this.bannersettings.width + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_maxitems" class="col-form-label col-lg-3">Max items</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_maxitems" id="scrolltextbanner_maxitems" value="' + this.bannersettings.maxitems + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group py-2">'
        overlaysnippit += '<label for="scrolltextbanner_speed" class="col-form-label col-lg-3">Scroll Speed (will be applied on next rotation)</label>'
        overlaysnippit += '<input type="text" class="col-lg-1" name="scrolltextbanner_speed" id="scrolltextbanner_speed" value="' + this.bannersettings.speed + '">'
        overlaysnippit += '</div>'

        overlaysnippit += '<div class="form-group row-2 text-center">'
        overlaysnippit += '<label for="scrolltextbanner_backgroundalpha" class="form-label">Background Alpha</label>'

        overlaysnippit += '<input type="range" class="form-range" name="scrolltextbanner_backgroundalpha" id="scrolltextbanner_backgroundalpha" min="0" max="255" step="1"'
        overlaysnippit += 'onInput="$(\'#scrolltextbanner_backgroundalpharangeval\').html($(this).val())" value="' + this.bannersettings.backgroundalpha + '">'
        overlaysnippit += '</div>'
        overlaysnippit += '</div>'
        return overlaysnippit
    }
    // ============================================================================
    //                           FUNCTION: setSettings
    // ============================================================================
    setSettings (data)
    {
        for (const [key, value] of Object.entries(this.bannersettings))
        {
            if (data["scrolltextbanner_" + key]
                && data["scrolltextbanner_" + key] == "on"
                && data["scrolltextbanner_" + key])
                this.bannersettings[key] = "on";
            else if ("scrolltextbanner_" + key in data)
                this.bannersettings[key] = data["scrolltextbanner_" + key];
        }
        // if we have turned off themain overlay then we need to trunours off as well
        if (data.overlaysourcesenabled.indexOf("off") > -1)
            this.bannersettings.enabled = "off"
        //update the overlay
        this.animationiteration()
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
            name: "ScrollTextBanner",
            displaytitle: "Scrolling Text Banner",
            description: "Banner that will scroll text. (use -1 in count to loop forever, default is 10 loops)",
            messagetype: "action_ScrollTextBanner",
            channel: channel,
            parameters: { message: "name of this overlay", count: "10" }
        };
    }
}