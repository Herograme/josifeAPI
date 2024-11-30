import { IcommandModel } from "./commandModel";

export class HelpCommand implements IcommandModel {
    public name = "help";
    public description = "Display all available commands";

    constructor(private commands: Map<string, IcommandModel>) { }

    async execute(): Promise<void> {
        console.log('\n📋 Available commands:');
        this.commands.forEach((command) => {
            console.log(`- ${command.name}: ${command.description}`);
        });
    }
}