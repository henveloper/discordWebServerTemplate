import { injectable } from 'inversify';
import { isDevelopment } from '../utils';
import { CronJob } from 'cron';
import axios from 'axios';

@injectable()
export class CronJobResource {
    public devWarmupCronjob!: CronJob;
    public yourCustomCronjob!: CronJob;

    public startUp() {
        if (isDevelopment) {
            // simulates GAE health checks
            this.devWarmupCronjob = new CronJob({
                cronTime: '* * * * *',
                onTick: async () => {
                    await axios.get('/_ah/warmup');
                },
                runOnInit: true,
                start: true,
                timeZone: 'Asia/Hong_Kong',
            });
        }

        this.yourCustomCronjob = new CronJob({
            cronTime: '*/10 * * * *',
            onTick: async () => {
                await axios.get('/');
            },
            runOnInit: false,
            start: true,
            timeZone: 'Asia/Hong_Kong',
        });
    }
}
