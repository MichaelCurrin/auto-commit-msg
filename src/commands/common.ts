abstract class Command {
  abstract identifier: string;

  abstract async execute(): Promise<void>;
}

export { Command };
