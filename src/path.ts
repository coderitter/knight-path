import * as fs from "fs"
import * as nativePath from "path"

export default class Path {

  paths: string[] = []

  constructor(...path: (string | Path)[]) {
    this.append(...path)
  }

  get path(): string {
    return nativePath.join(...this.paths)
  }

  get lastPart(): string {
    return nativePath.parse(this.path).base
  }

  get lastPartWithoutExtension(): string {
    return nativePath.parse(this.path).name
  }

  get dir(): string {
    return nativePath.parse(this.path).dir
  }

  exists(): boolean {
    return fs.existsSync(this.path)
  }

  isFile(): boolean {
    return fs.lstatSync(this.path).isFile()
  }

  isDir(): boolean {
    return fs.lstatSync(this.path).isDirectory()
  }

  contents(): Path[] {
    return fs.readdirSync(this.path).map(path => this.appendToNew(path))
  }

  append(...path: (string | Path)[]) {
    for (let pathPart of path) {
      if (typeof pathPart === 'string') {
        this.paths.push(pathPart)
      }
      else if (pathPart instanceof Path) {
        this.paths.push(pathPart.path)
      }
    }
  }

  prepend(...path: (string | Path)[]) {
    for (let pathPart of path) {
      if (typeof pathPart === 'string') {
        this.paths.unshift(pathPart)
      }
      else if (pathPart instanceof Path) {
        this.paths.unshift(pathPart.path)
      }
    }
  }

  useDirOfThisFile(...path: (string | Path)[]) {
    this.prepend(__dirname)
    this.append(...path)
  }

  appendToNew(...path: (string | Path)[]): Path {
    return new Path(...this.paths, ...path)
  }

  mkDir() {
    fs.mkdirSync(this.path, { recursive: true })
  }

  delete() {
    if (this.exists()) {
      if (this.isDir()) {
        this.contents().forEach(content => {
          if (content.isDir()) {
            content.delete()
            fs.rmdirSync(content.path)
          }
          else {
            fs.unlinkSync(content.path)
          }
        })        
      }
      else {
        fs.unlinkSync(this.path)
      }
    }
  }

  read(options?: string | {
    flags?: string
    encoding?: string
    fd?: number
    mode?: number
    autoClose?: boolean
    emitClose?: boolean
    start?: number
    end?: number
    highWaterMark?: number
  }): fs.ReadStream {
    return fs.createReadStream(this.path, options)
  }

  write(options?: string | {
    flags?: string
    encoding?: string
    fd?: number
    mode?: number
    autoClose?: boolean
    start?: number
    highWaterMark?: number
  }): fs.WriteStream {
    return fs.createWriteStream(this.path, options)
  }
}