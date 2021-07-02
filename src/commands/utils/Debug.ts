import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { isProduction } from '../../utils';
import { MongoService } from '../../services/MongoService';
import { injectable } from 'inversify';

@injectable()
export class Debug extends Command {
    constructor(bot: CommandoClient, public mongoService: MongoService) {
        super(bot, {
            name: isProduction ? 'debug' : 'x.debug',
            group: 'utils',
            memberName: 'debug',
            description: 'debugger',
            ownerOnly: true,
        });
    }

    async run(msg: CommandoMessage) {
        const document = await this.mongoService.getSetting('activity');
        await msg.say(document);
        return null;
    }
}
