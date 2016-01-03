/*

Copyright (C) Sun Jan 03 2016 JamezSoftware <jamezsoftware@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*
This extension is based on the "copyright extension" by Joe Ireland.
See his copyright notice and REAMDE.md for more information.
*/

/*
The MIT License (MIT)

Copyright (c) Sun May 17 2015 Joe Ireland

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

/**
 * Copyright Configuration
 */
define(function (require, exports, module) {
    "use strict";

    var CONST = {
            PANEL_ID:         "jamezsoftware-licenseHeader-panel",
            BUTTON_ID:        "jamezsoftware-licenseHeader-btn",
            CLOSE_ID:         "jamezsoftware-licenseHeader-close",
            SAVE_ID:          "jamezsoftware-licenseHeader-save",
            AUTHOR_ID:        "jamezsoftware-licenseHeader-author",
            EMAIL_ID:         "jamezsoftware-licenseHeader-email",
            COMMENT_CMD_ID:   "jamezsoftware-licenseHeader-commentCmd",
            LICENSE_CMD_ID:   "jamezsoftware-licenseHeader-licenseCmd",
            TEXT_ID:          "jamezsoftware-licenseHeader-text",
            DATE_VAR:         "${DATE}",
            AUTHOR_VAR:       "${AUTHOR}",
            EMAIL_VAR:        "${EMAIL}",
            AUTHOR_PREF:      "author",
            EMAIL_PREF:       "email",
            COMMENT_CMD_PREF: "commentCmd",
            LICENSE_CMD_PREF: "licenseCmd",
            TEXT_PREF:        "text"
        },
        WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
        ExtensionUtils   = brackets.getModule("utils/ExtensionUtils"),
        Resizer          = brackets.getModule("utils/Resizer"),
        PrefManager      = brackets.getModule("preferences/PreferencesManager"),
        Preferences      = PrefManager.getExtensionPrefs("jamezsoftware.licenseHeader"),
        MITLicense       = require("text!./text/MIT.txt"),
        GPLv2License     = require("text!./text/GPL2.txt"),
        GPLv3License     = require("text!./text/GPL3.txt"),
        LGPLv2License    = require("text!./text/LGPL2.txt"),
        LGPLv3License    = require("text!./text/LGPL3.txt"),
        ApacheLicense    = require("text!./text/Apache.txt"),
        Panel            = require("text!./html/panel.html"),
        Button           = require("text!./html/button.html"),
        $button,
        $panel;

    /**
    * Constructor to create Copyright Config manager.
    *
    * @constructor
    */
    function Config() {
        ExtensionUtils.loadStyleSheet(module, "css/main.less");

        $("#main-toolbar .buttons").append(Button);
        $button = $("#" + CONST.BUTTON_ID).on("click", this.togglePanel.bind(this));

        WorkspaceManager.createBottomPanel(CONST.PANEL_ID, $(Panel), 600);
        $panel = $("#" + CONST.PANEL_ID);
        $("#" + CONST.CLOSE_ID).on("click", this.togglePanel.bind(this));
        $("#" + CONST.SAVE_ID).on("click", this.save.bind(this));
    }

    Config.prototype.get = function () {
        var author  = Preferences.get(CONST.AUTHOR_PREF),
            email   = Preferences.get(CONST.EMAIL_PREF),
            command = Preferences.get(CONST.COMMENT_CMD_PREF),
            license = Preferences.get(CONST.LICENSE_CMD_PREF),
            lines   = Preferences.get(CONST.TEXT_PREF);

        if (!author || this.isTextUnset(lines)) {
            return {status: "not-configured"};
        } else if (!command) {
            return {status: "no-command"};
        }

        var today  = new Date().toDateString(),
            length = lines.length - 1,
            width  = lines[length].length,
            text   = lines.join("\n")
                          .replace(CONST.DATE_VAR, today)
                          .replace(CONST.AUTHOR_VAR, author)
                          .replace(CONST.EMAIL_VAR, email);

        return { text: text, command: command, length: length, width: width, status: "ok" };
    };

    Config.prototype.save = function () {
        Preferences.set(CONST.AUTHOR_PREF, $("#" + CONST.AUTHOR_ID).val());
        Preferences.set(CONST.EMAIL_PREF, $("#" + CONST.EMAIL_ID).val());
        Preferences.set(CONST.COMMENT_CMD_PREF, $("#" + CONST.COMMENT_CMD_ID).val());
        Preferences.set(CONST.LICENSE_CMD_PREF, $("#" + CONST.LICENSE_CMD_ID).val());
        if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.MITLicense") {
            Preferences.set(CONST.TEXT_PREF, MITLicense.split("\n"));
        } else if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.GPLv2License") {
            Preferences.set(CONST.TEXT_PREF, GPLv2License.split("\n"));
        } else if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.GPLv3License") {
            Preferences.set(CONST.TEXT_PREF, GPLv3License.split("\n"));
        } else if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.LGPLv2License") {
            Preferences.set(CONST.TEXT_PREF, LGPLv2License.split("\n"));
        } else if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.LGPLv3License") {
            Preferences.set(CONST.TEXT_PREF, LGPLv3License.split("\n"));
        } else if ($("#" + CONST.LICENSE_CMD_ID).val() === "edit.ApacheLicense") {
            Preferences.set(CONST.TEXT_PREF, ApacheLicense.split("\n"));
        }
        this.togglePanel();
    };

    Config.prototype.update = function () {
        var author  = Preferences.get(CONST.AUTHOR_PREF);
        var email   = Preferences.get(CONST.EMAIL_PREF);
        var command = Preferences.get(CONST.COMMENT_CMD_PREF);
        var license = Preferences.get(CONST.LICENSE_CMD_PREF);
        var text    = Preferences.get(CONST.TEXT_PREF);

        if (!command) {
            command = "edit.blockComment";
        }

        if (this.isTextUnset(text)) {
            //Default empty to use presets
        } else {
            text = text.join("\n"); //Load from config
        }

        $("#" + CONST.AUTHOR_ID).val(author);
        $("#" + CONST.EMAIL_ID).val(email);
        $("#" + CONST.COMMENT_CMD_ID).val(command);
        $("#" + CONST.LICENSE_CMD_ID).val(license);
        $("#" + CONST.TEXT_ID).val(text);
    };

    Config.prototype.showPanel = function () {
        if (!$button.hasClass("active")) {
            this.togglePanel();
        }
    };

    Config.prototype.togglePanel = function () {
        Resizer.toggle($panel);
        $button.toggleClass("active");

        if ($button.hasClass("active")) {
            this.update();
        }
    };

    Config.prototype.isTextUnset = function (text) {
        return !text || text.length === 0 || (text.length === 1 && text[0].length === 0);
    };


    module.exports = Config;
});
