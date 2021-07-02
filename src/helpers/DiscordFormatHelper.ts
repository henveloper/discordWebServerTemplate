export class DiscordFormatHelper {
    static inlineCode(s: string) {
        return `\`${ s }\``;
    }

    static code(s: string) {
        return `\`\`\`\n${ s }\`\`\``;
    }

    static pingUser(id: string) {
        return `<@${ id }>`;
    }

    static pingUsers(id: string[]) {
        return id.map(DiscordFormatHelper.pingUser).join(' ');
    }
}
