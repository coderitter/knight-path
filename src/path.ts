import * as fs from "fs"
import * as nativePath from "path"

export default class Path {

  paths: string[] = []

  constructor(...path: (string | Path)[]) {
    this.append(...path)
  }

  get path(): string {
    return nativePath.normalize(nativePath.join(...this.paths))
  }

  get filename(): string {
    return nativePath.parse(this.path).base
  }

  get filenameWithoutExtension(): string {
    return nativePath.parse(this.path).name
  }

  get dir(): string {
    return nativePath.parse(this.path).dir
  }

  get length(): number {
    return this.split().length
  }

  part(index: number): string|undefined {
    let splitted = this.split()
    if (index < splitted.length) {
      return splitted[index]
    }
  }

  split(): string[] {
    let path = this.path
    
    if (path.indexOf('/') == 0) {
      path = path.substr(1)
    }

    if (path.lastIndexOf('/') == path.length - 1) {
      path.substr(0, path.length - 1)
    }

    return path.split('/')
  }

  iterateFiles(handleFile: (file: Path) => void, recursive: boolean = true) {
    if (this.isDir) {
      for (let content of this.contents()) {
        if (content.isFile()) {
          handleFile(content)
        }
        else if (recursive && content.isDir) {
          content.iterateFiles(handleFile)
        }
      }
    }
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

  getDir(): Path {
    return new Path(this.dir)
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

  subtract(path: Path): Path {
    let subtractFrom = this.split()
    let subtract = path.split()

    let i = 0
    
    while (i < subtract.length && i < subtractFrom.length &&
        subtract[i] == subtractFrom[i]) {
      
      i++
    }

    let subtracted = subtractFrom.splice(i)
    return new Path(...subtracted)
  }

  appendToNew(...path: (string | Path)[]): Path {
    return new Path(...this.paths, ...path)
  }

  equals(path: string|Path): boolean {
    let equalTo: Path
    if (typeof path === 'string') {
      equalTo = new Path(path)
    }
    else {
      equalTo = path
    }

    let splitted = this.split()
    let equalToSplitted = equalTo.split()

    if (splitted.length !== equalToSplitted.length) {
      return false
    }

    for (let i = 0; i < splitted.length; i++) {
      if (splitted[i] != equalToSplitted[i]) {
        return false
      }
    }

    return true
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