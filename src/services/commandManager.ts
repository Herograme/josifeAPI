import { CleanCacheCommand, HelpCommand, IcommandModel, InfoCommand } from "./commands";

export class CommandManager {
    private commands: Map<string, IcommandModel> = new Map();

    constructor() {
        this.commands = new Map();
        this.registerDefaultCommands();
    }

    private registerDefaultCommands(): void {
        const defaultCommands = [
            new HelpCommand(this.commands),
            new InfoCommand(),
            new CleanCacheCommand(),
        ];

        defaultCommands.forEach((command) => {
            this.commands.set(command.name, command);
        });
    }

    public registerCommand(command: IcommandModel): void {
        this.commands.set(command.name, command);
    }

    public async executeCommand(commandName: string, args: string[]): Promise<void> {
        const command = this.commands.get(commandName);

        if (command) {
            await command.execute(args);
        } else {
            console.log(`❌ Command not found: ${commandName}, try running 'help' to see all available commands`);
        }
    }

    public getCommands(): Map<string, IcommandModel> {
        return this.commands;
    }
}