import 'reflect-metadata';
import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import { DiscordResource } from './resources/DiscordResource';
import { MongoResource } from './resources/MongoResource';
import { SampleControllers } from './controllers/SampleControllers';
import { MongoService } from './services/MongoService';
import { Container } from 'inversify';
import { CronJobResource } from './resources/CronJobResource';
import { DiscordService } from './services/discordService';
import { configs } from './configs';

export class Server {
    public hasInitialized = false;

    // test case need to access this
    public container = new Container();
    private app = new Koa();
    private router = new Router();

    constructor() {
        this.container.bind('Configs').toConstantValue(configs);

        this.container.bind(MongoResource).toSelf().inSingletonScope();
        this.container.bind(DiscordResource).toSelf().inSingletonScope();
        this.container.bind(CronJobResource).toSelf().inSingletonScope();

        this.container.bind(MongoService).toSelf().inRequestScope();
        this.container.bind(DiscordService).toSelf().inRequestScope();

        this.container.bind(SampleControllers).toSelf().inRequestScope();
    }

    public async start() {
        if (!this.hasInitialized) {
            this.hasInitialized = true;
            this.attachControllers()
                .app
                .use(cors())
                .use(this.router.routes())
                .use(this.router.allowedMethods())
                .listen(process.env.PORT);

            await this.container.get<MongoResource>(MongoResource).startUp();
            await this.container.get<DiscordResource>(DiscordResource).startUp();
            await this.container.get<CronJobResource>(CronJobResource).startUp();

            this.container.get<DiscordService>(DiscordService).getTextChannel('prod')
                .then(r => r!.send('Resource initiation complete.'));
        }
    }

    private attachControllers() {
        // root
        this.router.get('/', ctx => {
            ctx.body = 'hi!';
        });

        // gcp startup
        this.router.get('/_ah/warmup', async ctx => {
            ctx.body = { isSuccess: true };
        });

        this.router.get('/sample/sendSomething', async ctx => {
            await this.container.get<SampleControllers>(SampleControllers).sendSomething(ctx);
        });

        return this;
    }
}
