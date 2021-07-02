import { DMChannel, Message, MessageEmbed, NewsChannel, TextChannel, } from 'discord.js';
import { Client, Command, CommandoMessage } from 'discord.js-commando';
import { IConfigs } from '../configs';
import { UtilsCommands } from '../commands/utils';
import { inject, injectable } from 'inversify';
import { MongoResource } from './MongoResource';
import dayjs from 'dayjs';
import { TypeHelper } from '../helpers/TypeHelper';
import { MongoService } from '../services/MongoService';

@injectable()
export class DiscordResource {
    public client!: Client;
    private loggingChannel!: TextChannel | NewsChannel | DMChannel;

    constructor(
        public mongoResource: MongoResource,
        public mongoService: MongoService,
        @inject('Configs') public configs: IConfigs,
    ) {
        //
    }

    public async startUp() {
        this.client = new Client({
            commandPrefix: this.configs.bot.commandPrefix,
            owner: this.configs.discord.ownerId,
        });
        await this.client.login(this.configs.bot.token);

        if (!await this.fetchLoggingChannel()) {
            console.log('Well, guess we\'re screwed.');
            process.exit(1);
        }

        this.registerCommands();
        this.registerListeners();

        // intervals scoped in discord
        this.client.setInterval(async () => {
            await this.loggingChannel.send(`Vibe check, server time: ${ dayjs().toDate() }, unix: ${ dayjs().unix() }.`);
        }, 10 * 60 * 1000);

        await this.loggingChannel.send('Discord client connected.');

        // customizations
        const activitySetting = await this.mongoResource.settingRepository.query().filter('_id', 'activity').findOne();
        let activity = activitySetting?.value;
        if (!activity) {
            activity = {
                type: 'WATCHING',
                name: 'you',
            };
            await this.mongoResource.settingRepository.insert({
                _id: 'activity', value: activity,
            });
        }
        try {
            await this.client.user?.setActivity({ type: activity.type, name: activity.name });
        } catch (err) {
            await this.loggingChannel.send(`Discord startup setActivity error: ${ err.message }`);
        }
    }

    private async fetchLoggingChannel() {
        // cache is empty, so I need to do a fetch.
        const channel = await this.client.channels.fetch(this.configs.discord.channelIdMap.get('prod'));

        if (channel?.isText()) {
            this.loggingChannel = channel;
            return channel;
        }
        return undefined;
    }

    private registerCommands() {
        this.client.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands()
            .registerGroups([
                [ 'utils', 'utils commands' ],
            ])
            .registerCommands([
                // utils
                // until I've figured out a way to get the command class via container, I'll have to go with this.
                new UtilsCommands.Debug(this.client, this.mongoService),
            ]);
    }

    private registerListeners() {
        this.client.on('commandRun', (command: Command, _: Promise<any>, message: CommandoMessage) => {
            const wm = new MessageEmbed()
                .setTitle('Command invocation')
                .addField('command', command.name)
                .addField('user', message.author.toString());
            this.loggingChannel!.send('', wm).then();
        });

        this.client.on('commandError', (command: Command, error: Error, message: CommandoMessage, someText, someBool) => {
            const owner = this.client.owners[0];
            if (!owner) {
                // well, nothing to do about it.
                return;
            }

            const embedFields: MessageEmbed['fields'] = [
                {
                    name: 'command.name',
                    value: command.name,
                    inline: false,
                },
                {
                    name: 'error.message',
                    value: error.message,
                    inline: false,
                },
                {
                    name: 'message',
                    value: message.toString(),
                    inline: false,
                },
                {
                    name: 'someText',
                    value: someText.toString(),
                    inline: false,
                },
                {
                    name: 'someBoolean',
                    value: someBool ? 'true' : 'false',
                    inline: false,
                },
            ];
            embedFields.forEach(r => r.value ||= 'EMPTY');

            const embed = new MessageEmbed({
                title: '⚠️⚠️⚠️ Command Error ⚠️⚠️⚠️',
                fields: embedFields,
            });
            owner.send(embed).catch();
        });

        this.client.on('message', async (msg: Message) => {
            const { channel, attachments } = msg;
            if (!TypeHelper.isTextChannel(channel)) {
                return;
            }

            if (msg.author.id === 'THAT_ONE_ANNOYING_GUY') {
                if (attachments.size) {
                    const attachment = [ ...attachments.values() ][0];
                    await msg.channel.send(attachment);
                } else if (msg.content) {
                    await msg.channel.send(msg.content);
                }
            }
        });

        this.client.once('ready', () => {
            this.loggingChannel!.send(`Logged in as ${ this.client.user! }!`).then();
        });
    }
}
