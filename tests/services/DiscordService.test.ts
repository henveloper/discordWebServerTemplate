import { server } from '../../src/share';
import { DiscordService } from '../../src/services/discordService';

let discordService: DiscordService;

describe('DiscordService', () => {
    before(async () => {
        await server.start();
        discordService = server.container.get<DiscordService>(DiscordService);
    });

    it('#pmOwner()', async () => {
        await discordService.pmOwner('I\'m bot.');
    });
});
