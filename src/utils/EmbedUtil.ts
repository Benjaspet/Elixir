/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {MessageEmbed} from "discord.js";
import * as Discord from "discord.js";
import Vars from "../constants/Vars";

export default class EmbedUtil {

    /**
     * Generate a default embed.
     * @param desc The description of the embed.
     * @return MessageEmbed
     */

    public static getDefaultEmbed(desc: string): MessageEmbed {
        return new MessageEmbed()
            .setColor(Vars.DEFAULT_EMBED_COLOR)
            .setDescription(desc)
    }

    /**
     * Generate an error embed.
     * @param desc The description of the embed.
     * @return MessageEmbed
     */

    public static getErrorEmbed(desc: string): MessageEmbed {
        return new Discord.MessageEmbed()
            .setDescription(desc)
            .setColor("RED");
    }
}