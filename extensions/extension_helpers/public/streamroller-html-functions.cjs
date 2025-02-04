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
let __api_version__ = "0.1";
//(twitchCategoriesDropdownId, twitchCategories, twitchCategorieshistory, currentTwitchGameCategory)
function createDropdownWithHistoryString (id, categories = [], history = [], currentGameCategory = [])
{
    let dropdownHtml = '<div class="d-flex-align w-50">';
    //dropdownHtml += '<input id="dropdownSearch" type="text" class="form-control mb-2" placeholder="Search or select..." oninput="filterDropdown()">';
    //dropdownHtml += '<select id="historyDropdown" class="form-select mb-2" onchange="updateHistory(this.value)">';
    dropdownHtml += '<select id="' + id + '" name = "' + id + '" class="form-select mb-2>';
    dropdownHtml += '<option value="">Select an option...</option>';

    // Append history options first
    history.forEach(item =>
    {
        if (item == currentGameCategory)
            dropdownHtml += "<option value=" + item + "selected >" + item + "</option>";
        else
            dropdownHtml += "<option value=" + item + ">" + item + "</option>";
    });

    // Append a visual separator if history exists
    if (history.length)
    {
        dropdownHtml += '<option value="separator" disabled>-----------</option>';
    }

    // Append default categories
    categories.forEach(option =>
    {
        if (!history.includes(option))
        {
            dropdownHtml += `<option value="${option}">${option}</option>`;
        }
    });

    dropdownHtml += '</select>';
    dropdownHtml += '<button id="clearHistory" class="btn btn-danger" onclick="clearHistory()">Clear History</button>';
    dropdownHtml += '</div>';

    dropdownHtml += `
      <script>
        const categories = ${JSON.stringify(categories)};
        const id = "${id}";
  
        function filterDropdown() {
          const searchValue = document.getElementById('dropdownSearch').value.toLowerCase();
          const dropdown = document.getElementById('historyDropdown');
          Array.from(dropdown.options).forEach(option => {
            option.hidden = option.value && !option.text.toLowerCase().includes(searchValue);
          });
        }
         
      </script>
    `;
    /*function updateHistory(selectedValue) {
              if (selectedValue && selectedValue !== 'separator') {
                let history = JSON.parse(localStorage.getItem(id) || '[]');
                if (!history.includes(selectedValue)) {
                  history.unshift(selectedValue);
                  localStorage.setItem(id, JSON.stringify(history));
                }
              }
            }
      
            function clearHistory() {
              localStorage.removeItem(id);
              alert('History cleared! Please refresh the page.');
            }*/
    return dropdownHtml;
}

// ============================================================================
//                                  EXPORTS
// ============================================================================
// Either export(ES6) or attach to the exports (CommonJS)
// ---------------------------------------------------------
// Client Usage CommonJS:
// <script src="/streamroller_apis.cjs"></script>
// streamroller_api.ServerPacket("CreateChannel","STREAMROLLER_API");
// ---------------------------------------------------------
// Client Usage ES6:
// import * as streamroller_api from './public/streamroller_apis.cjs';
// streamroller_api.ServerPacket("CreateChannel","STREAMROLLER_API");
// ---------------------------------------------------------
let sr_html_helper = {
    __api_version__,
    createDropdownWithHistoryString
};
if (typeof module !== "undefined" && module.exports)
{
    /** 
     * Streamroller_apis: helper functions for using the Streamroller system 
     * @exports createDropdownWithHistoryString() Create a select dropdown box
     */
    module.exports = sr_html_helper;
}
else
{
    /**
     * something or other
    * @module sr_api CJS export comment :D
    */
    let sr_html_helper = {
        __api_version__,
        createDropdownWithHistoryString
    };
}