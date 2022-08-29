import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecuter } from "../../core/executor/command.executor";
import { FileService } from "../../core/files/files.services";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { StreamHandler } from "../../core/handlers/stream.handler";
import { PromptService } from "../../core/prompt/prompt.service";
import { FfmpegBuilder } from "./ffmpeg.builder";
import { ICommandExecFfmpeg, IFfmpegInput } from "./ffmpeg.types";

export class FfmpegExecutor extends CommandExecuter<IFfmpegInput> {
  private fileService: FileService = new FileService();
  private promptService: PromptService = new PromptService();

  constructor(logger: IStreamLogger) {
    super(logger);
  }



  protected async prompt(): Promise<IFfmpegInput> {
    const width = await this.promptService.input<number>('Ширина', 'number');
    const height = await this.promptService.input<number>('Высота', 'number');
    const path = await this.promptService.input<string>('путь до файла', 'input');
    const name = await this.promptService.input<string>('имя', 'input');
    return { width, height, name, path };
  }
  
  protected build({ width, height, name, path }: IFfmpegInput): ICommandExecFfmpeg {
    const output = this.fileService.getFilePath(path, name, 'mp4');
    const args = (new FfmpegBuilder)
      .input(path)
      .setVideoSize(width, height)
      .output(output);

    return { command: 'ffmpeg', args, output };
  }
  protected spawn({output, command, args}:  ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
    this.fileService.deleteFileIfExists(output);
    return spawn(command, args);
  }
  protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
    const handler = new StreamHandler(logger);
    handler.proccessOutput(stream);
  }
  
}