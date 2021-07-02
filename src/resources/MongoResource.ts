import { Connection, createConnection, Repository } from 'ts-mongodb-orm';
import { configs } from '../configs';
import { UserData } from '../entities/Discord/UserData';
import { Setting } from '../entities/Discord/Setting';
import { injectable } from 'inversify';

@injectable()
export class MongoResource {
    public connection?: Connection;

    // deprecated
    public settingRepository!: Repository<typeof Setting>;
    public userDataRepository!: Repository<typeof UserData>;

    public async startUp() {
        if (this.connection?.isConnected) {
            return;
        }

        console.log('Connecting mongoDB...');
        this.connection = await createConnection({
            uri: configs.mongo.uri,
            dbName: 'DiscordData',
            mongoClientOptions: {
                readConcern: { level: 'majority' },
                writeConcern: { w: 'majority' },
                useUnifiedTopology: true,
                ignoreUndefined: true,
                connectTimeoutMS: 2000,
            },
        });

        console.log('Syncing mongoDB repositories...');

        const discordDbName = 'discord';

        this.settingRepository = this.connection.getRepository(Setting, { dbName: discordDbName });
        await this.settingRepository.syncIndex();

        this.userDataRepository = this.connection.getRepository(UserData, { dbName: discordDbName });
        await this.userDataRepository.syncIndex();

        console.log('mongoDB resource initialized.');
    }
}
