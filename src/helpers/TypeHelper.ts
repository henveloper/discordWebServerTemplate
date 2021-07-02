import { AxiosError } from 'axios';
import { Channel, GuildChannel, TextChannel } from 'discord.js';

export class TypeHelper {
    static isAxiosError(err: any): err is AxiosError {
        return !!err.isAxiosError;
    }

    static isGuildChannel(ch: Channel): ch is GuildChannel {
        return (ch as any).guild !== undefined;
    }

    // not quite, but suffice.
    static isTextChannel(ch: Channel): ch is TextChannel {
        return ch.type === 'text';
    }
}
