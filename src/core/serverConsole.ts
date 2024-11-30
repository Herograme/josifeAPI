import { CommandManager } from "@/services";
import { IcommandModel } from "@/services/commands";
import readline from "node:readline";

export class ServerConsole {
    private rl: readline.Interface
    private commandManager: CommandManager

    constructor() {
        this.commandManager = new CommandManager()
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '🚀 Server commands > '
        })
    }

    public start() {
        console.log('\n🚀 Console of commands server initializated')
        console.log('📋 Type "help" to see all available commands\n')

        this.rl.prompt()
        this.rl.on('line', async (line) => {
            const [command, ...args] = line.trim().split(' ')

            if (command) {
                await this.commandManager.executeCommand(command, args)
            } else {
                console.log('❌ No command entered')
            }
            this.rl.prompt()
        }).on('close', () => {
            console.log('📡 Server console closed')
            process.exit(0)
        })

    }

    public registerCommand(command: IcommandModel) {
        this.commandManager.registerCommand(command)
    }
}