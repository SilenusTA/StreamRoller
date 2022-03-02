// ############################# STREAMLABS_API.js ###################################
// This Module/addon/extension (whatever we decide to call these :D) will
// will handle anything streamlabs_api related
// -------------------------- Creation ----------------------------------------
// Author: Silenus aka streamlabs_api.tv/OldDepressedGamer
// Datatype : JSON message as provided by streamlabs api.
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// connects to streamlabs API to handle live streamlabs_api alerts and also data
// This gets sent to the data_center for logging and dissemination to user
// that wish to register for this information
// --------------------------- description -------------------------------------
// ================== schema ==================================================
// Channel name : STREAMLABS_ALERT
// GitHub: https://github.com/SilenusTA/streamer
// ----------------------------- notes ----------------------------------------
// TBD. 
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import { start as SL_connection_start } from "./streamlabs_api_handler.js";
import * as logger from "../../../backend/data_center/modules/logger.js";
import { config } from "./config.js";
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
function initialise(app, host, port)
{
    SL_connection_start(host, port);
    logger.log(config.SYSTEM_LOGGING_TAG + "streamlabs_api.initialise", "Streamlabs Socket initialised ");
}

// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { initialise };
