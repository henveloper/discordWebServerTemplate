import { Document, Field } from 'ts-mongodb-orm';
import { ActivityType } from 'discord.js';

export type IDiscordSetting = {
    activity: {
        type: ActivityType,
        name: string,
    },
}

@Document({ collectionName: 'settings' })
export class Setting {
    @Field()
    public _id!: keyof IDiscordSetting;

    // possible to strongly type this?
    @Field()
    public value: any;
}
