/** @format */

export interface XernerxStats {
  guilds: null | number;
  users: null | number;
  shardId: null | number;
  shardCount: null | number;
  shards: null | number;
  voteCount: null | number;
  votes: null | number;
  commands: {
    slash: {
      local: number;
      global: number;
    };
    message: {
      local: number;
      global: number;
    };
    context: {
      local: number;
      global: number;
    };
  };
}

export interface XernerxSlashCommandHandlerOptions {
  directory: string;
  global: boolean;
}

export interface XernerxMessageCommandHandlerOptions {
  directory: string;
  global: boolean;
}
export interface XernerxContextCommandHandlerOptions {
  directory: string;
  global: boolean;
}

declare global {
  namespace NodeJS {
    interface Process {
      xernerx: {
        log?: {
          type: "static" | "dynamic";
          info: boolean;
          error: boolean;
          warn: boolean;
          debug: boolean;
          // format: Array<'name' | 'time' | 'ram'>;
        };
      };
    }
  }
}
