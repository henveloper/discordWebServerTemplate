import { MongoResource } from '../resources/MongoResource';
import { IDiscordSetting } from '../entities/Discord/Setting';
import { injectable } from 'inversify';

@injectable()
export class MongoService {
    static settingFallBack: IDiscordSetting = {
        activity: {
            type: 'WATCHING',
            name: 'MYSELF',
        },
    };

    constructor(public mongoResource: MongoResource) {
        //
    }

    public async getSetting<T extends keyof IDiscordSetting>(key: T): Promise<IDiscordSetting[T]> {
        const repo = this.mongoResource.settingRepository;

        const setting = await repo.query().filter('_id', key).findOne();
        let value = setting?.value as IDiscordSetting[T] | undefined;

        if (!value) {
            value = MongoService.settingFallBack[key];
            await repo.insert({ _id: key, value });
        }

        return value;
    }

    public async updateSetting<T extends keyof IDiscordSetting>(key: T, value: IDiscordSetting[T]) {
        await this.mongoResource.settingRepository.update({ _id: key, value }, { upsert: true });
    }
}
