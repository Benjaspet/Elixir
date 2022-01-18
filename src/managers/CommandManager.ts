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

import {Client, Collection} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import Command from "../structs/Command";
import JoinCommand from "../commands/JoinCommand";
import LoopCommand from "../commands/LoopCommand";
import LyricsCommand from "../commands/LyricsCommand";
import NowPlayingCommand from "../commands/NowPlayingCommand";
import PauseCommand from "../commands/PauseCommand";
import PlayCommand from "../commands/PlayCommand";
import PlaylistCommand from "../commands/PlaylistCommand";
import QueueCommand from "../commands/QueueCommand";
import ResumeCommand from "../commands/ResumeCommand";
import SearchCommand from "../commands/SearchCommand";
import ShuffleCommand from "../commands/ShuffleCommand";
import SkipCommand from "../commands/SkipCommand";
import StopCommand from "../commands/StopCommand";
import VolumeCommand from "../commands/VolumeCommand";

export default class CommandManager {

    public static commands: Collection<string, ApplicationCommand> = new Collection<string, ApplicationCommand>();
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        CommandManager.registerCommands([
            new JoinCommand(this.client),
            new LoopCommand(this.client),
            new LyricsCommand(this.client),
            new NowPlayingCommand(this.client),
            new PauseCommand(this.client),
            new PlayCommand(this.client),
            new PlaylistCommand(this.client),
            new QueueCommand(this.client),
            new ResumeCommand(this.client),
            new SearchCommand(this.client),
            new ShuffleCommand(this.client),
            new SkipCommand(this.client),
            new StopCommand(this.client),
            new VolumeCommand(this.client)
        ]);
    }

    private static registerCommands(commands: Command[]): void {
        for (const command of commands) {
            CommandManager.commands.set(command.getName(), command);
        }
    }
}