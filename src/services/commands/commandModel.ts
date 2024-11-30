export interface IcommandModel {
    name: string;
    description: string;
    execute: (args: string[]) => Promise<void>;
}