/*
 *
 * Copyright 2014 Canonical Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var ConfigParser = require('./config_parser');
var path         = require('path');
var fs           = require('fs');
var logger       = require('./logger');
var Utils        = require('./utils');

function sanitize(str) {
    return str.replace(/\n/g, ' ').replace(/^\s+|\s+$/g, '');
}

module.exports = {
    generate: function(path, outDir) {
        var config = new ConfigParser(path);


        if (!config.author()) {
            logger.error("\nconfig.xml should contain author");
            process.exit(1);
        }

        this.generateDesktopFile(config, outDir);
        this.generateManifest(config, outDir);
        this.generateApparmorProfile(config, outDir);
    },

    generateDesktopFile: function(config, dir) {
        var name = sanitize(config.name()); //FIXME: escaping
        var content = '[Desktop Entry]\nName=' + name + '\nExec=./cordova-ubuntu www/\nTerminal=false\nType=Application\nX-Ubuntu-Touch=true';
        if (config.icon() && fs.existsSync(path.join(dir, '../..', config.icon()))) {
            Utils.cp(path.join(dir, '../..', config.icon()), path.join(dir, 'www'));

            content += '\nIcon=www/' + path.basename(config.icon());
        } else {
            Utils.cp(path.join(dir, 'build', 'default_icon.png'), path.join(dir, 'www'));

            content += '\nIcon=www/default_icon.png';
        }

        fs.writeFileSync(path.join(dir, 'cordova.desktop'), content);
    },

    generateManifest: function(config, dir) {
        var hooks = { cordova: { desktop: 'cordova.desktop',
                                 apparmor: 'apparmor.json' } };

        config.etree.getroot().findall('./feature/param').forEach(function (element) {
            if (element.attrib.hook)
                hooks.cordova[element.attrib.hook] = element.attrib.value;
        });

        var manifest = { name: config.id(),
                         version: config.version(),
                         title: config.name(),
                         hooks: hooks,
                         maintainer: sanitize(config.author())  + ' <' + config.email() + '>',
                         description: sanitize(config.description()) };

        fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
    },

    generateApparmorProfile: function(config, dir) {
        var policy = { policy_groups: ['networking', 'audio'], policy_version: 1 };

        config.etree.getroot().findall('./feature/param').forEach(function (element) {
            if (element.attrib.policy_group && policy.policy_groups.indexOf(element.attrib.policy_group) === -1)
                policy.policy_groups.push(element.attrib.policy_group);
        });

        fs.writeFileSync(path.join(dir, 'apparmor.json'), JSON.stringify(policy));
    }
};
