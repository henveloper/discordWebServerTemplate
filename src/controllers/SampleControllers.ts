import { injectable } from 'inversify';
import { Context } from 'koa';
import { DiscordService } from '../services/discordService';

@injectable()
export class SampleControllers {
    constructor(
        public discordService: DiscordService,
    ) {
        //
    }

    public async sendSomething(ctx: Context) {
        const channel = await this.discordService.getTextChannel('prod');
        if (!channel) {
            ctx.body = { isSuccess: 0, message: 'ass' };
            return ctx;
        }

        await channel.send('I\'m the controller.');

        ctx.body = { isSuccess: true };
        return ctx;
    }
}
