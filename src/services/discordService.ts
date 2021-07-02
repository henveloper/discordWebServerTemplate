import { inject, injectable } from 'inversify';
import { DiscordResource } from '../resources/DiscordResource';
import { IConfigs } from '../configs';

export type TChannel =
    | 'dev'
    | 'prod';

@injectable()
export class DiscordService {
    constructor(
        public discordResource: DiscordResource,
        @inject('Configs') public configs: IConfigs,
    ) {
        //
    }

     public async pmOwner(message: string) {
        const owner = this.discordResource.client.owners[0]!;
        await owner.send(message)
    }

    public async getTextChannel(name: TChannel) {
        const channel = await this.discordResource.client.channels.fetch(this.configs.discord.channelIdMap.get(name));

        return channel?.isText() ? channel : undefined;
    }
}
