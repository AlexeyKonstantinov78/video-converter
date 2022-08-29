export class FfmpegBuilder {
  private inputPath: string;
  private outputPath: string;
  private options: Map<string, string> = new Map();

  constructor() {
    this. options.set('-c:v', 'libx264');
  }

  input(inputPath: string):this {
    this.inputPath = inputPath;
    return this;
  }

  setVideoSize(width: number, height: number): this {
    this.options.set('-s', `${width}x${height}`);
    return this;
  }

  output(outputPath: string) {
    if (!this.inputPath) {
      throw new Error('не задан параметр input');
    }
    const args: string[] = ['-i', this.inputPath];
    this.options..forEach((value, key) => {
      args.push(key, value);
    });
    args.push(outputPath);

    console.log(args);
    return args;
  }
}

// new FfmpegBuilder()
//   .input('')
//   .setVideoSize(1920, 1080)
//   .output('//')