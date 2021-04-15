import * as fs from 'fs'
import * as nativePath from 'path'

export default class Path {

  parts: string[]

  constructor(...parts: (string | Path)[]) {
    if (parts.length > 0) {
      let first = parts[0]

      if (typeof first == 'string') {
        this.parts = Path.split(first, true)
      }
      else {
        this.parts = []
        this.append(first)
      }
    }
    else {
      this.parts = []
    }

    if (parts.length > 1) {
      let remaining = parts.splice(1)
      this.append(...remaining)
    }
  }

  get path(): string {
    return nativePath.normalize(nativePath.join(...this.parts))
  }

  set path(path: string) {
    this.parts = Path.split(path)
  }

  get length(): number {
    return this.parts.length
  }

  get filename(): string {
    return nativePath.parse(this.path).base
  }

  set filename(filename: string) {
    this.parts = new Path(this.dir, filename).parts
  }

  get extension(): string {
    return nativePath.parse(this.path).ext
  }

  set extension(extension: string) {
    if (extension.length > 0 && extension[0] != '.') {
      extension = '.' + extension
    }
    
    this.parts = new Path(this.dir, this.filenameWithoutExtension + extension).parts
  }

  get filenameWithoutExtension(): string {
    return nativePath.parse(this.path).name
  }

  set filenameWithoutExtension(filenameWithoutExtension: string) {
    this.parts = new Path(this.dir, filenameWithoutExtension + this.extension).parts
  }

  get dir(): string {
    return nativePath.parse(this.path).dir
  }

  set dir(dir: string) {
    this.parts = new Path(dir, this.filename).parts
  }

  get dirPath(): Path {
    return new Path(this.dir)
  }

  setPath(...parts: (string | Path)[]) {
    this.parts = new Path(...parts).parts
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

  append(...parts: (string | Path)[]) {
    for (let part of parts) {
      if (typeof part == 'string') {
        this.parts.push(...Path.split(part, false))
      }
      else if (part instanceof Path) {
        this.parts.push(...part.parts)
      }
    }
  }

  prepend(...parts: (string | Path)[]) {
    for (let part of parts) {
      if (typeof part == 'string') {
        this.parts.unshift(...Path.split(part, false))
      }
      else if (part instanceof Path) {
        this.parts.unshift(...part.parts)
      }
    }
  }

  subtract(...path: (string | Path)[]): Path {
    let subtract = new Path(...path)

    let i = 0
    while (i < subtract.length && i < this.length && subtract.parts[i] == this.parts[i]) {
      i++
    }

    let subtracted = this.parts.slice()
    subtracted.splice(i)
    return new Path(...subtracted)
  }

  appendToNew(...path: (string | Path)[]): Path {
    return new Path(...this.parts, ...path)
  }

  equals(...path: (string | Path)[]): boolean {
    let equals = new Path(...path)

    if (this.length !== equals.length) {
      return false
    }

    for (let i = 0; i < this.parts.length; i++) {
      if (this.parts[i] != equals.parts[i]) {
        return false
      }
    }

    return true
  }

  startsWith(...path: (string | Path)[]): boolean {
    let startsWith = new Path(...path)

    if (startsWith.length > this.length) {
      return false
    }

    for (let i = 0; i < startsWith.length; i++) {
      if (this.parts[i] != startsWith.parts[i]) {
        return false
      }
    }

    return true
  }

  mkDir() {
    fs.mkdirSync(this.path, { recursive: true })
  }

  iterateFiles(handleFile: (file: Path) => void, recursive: boolean = true) {
    if (this.isDir()) {
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

  copy(to: string|Path) {
    if (typeof to == 'string') {
      to = new Path(to)
    }
  }

  move(to: string|Path) {

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

  clone(): Path {
    return new Path(...this.parts)
  }

  static split(path: string, preserveRoot: boolean = true): string[] {
    let leadingSep = path[0] == nativePath.sep

    if (leadingSep) {
      path = path.substr(1)
    }
  
    if (path[path.length - 1] == nativePath.sep) {
      path = path.substr(0, path.length - 1)
    }

    let splitted = path.split(nativePath.sep)

    if (preserveRoot && leadingSep) {
      splitted.unshift(nativePath.sep)
    }

    return splitted
  }  
}
