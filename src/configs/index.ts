import { ChannelIdManager } from './ChannelIdManager';

export const configs = {
    discord: {
        channelIdMap: new ChannelIdManager({
            dev: '755043381159133266',
            prod: '760527010946088960',
        }),
        ownerId: '321516585892315139',
    },
    webhooks: {
        // in case you have some webhooks for some reason.
        // preferably just get the channels by id in cache.
    },
    mongo: {
        uri: process.env.MONGO_URI!,
    },
    bot: {
        commandPrefix: '|',
        token: process.env.DISCORD_BOT_TOKEN!,
    },
};

export type IConfigs = typeof configs;
