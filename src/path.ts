import * as fs from 'fs'
import { WriteFileOptions } from 'node:fs'
import * as nativePath from 'path'

export function path(...parts: (string|Path)[]): Path {
  return new Path(...parts)
}

export class Path {

  parts: string[]

  constructor(...parts: (string|Path)[]) {
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

  setPath(...parts: (string|Path)[]) {
    this.parts = new Path(...parts).parts
  }

  equals(...path: (string|Path)[]): boolean {
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

  indexOf(...path: (string|Path)[]): number {
    let indexOf = new Path(...path)

    if (indexOf.length > this.length) {
      return -1
    }

    let start = 0
    let foundStart = false

    for (; start < this.length; start++) {
      if (this.parts[start] == indexOf.parts[0]) {
        foundStart = true
        break;
      }
    }

    if (! foundStart || indexOf.length > this.length - start) {
      return -1
    }

    let everyPartMatches = true

    for (let i = 0; start + i < this.length && i < indexOf.length; i++) {
      if (this.parts[start + i] != indexOf.parts[i]) {
        everyPartMatches = false
        break
      }
    }

    if (everyPartMatches) {
      return start
    }

    return -1
  }

  startsWith(...path: (string|Path)[]): boolean {
    let startsWith = new Path(...path)
    let index = this.indexOf(startsWith)
    return index == 0
  }

  endsWith(...path: (string|Path)[]): boolean {
    let endsWith = new Path(...path)
    let index = this.indexOf(endsWith)

    if (index == -1) {
      return false
    }

    return index + endsWith.length == this.length
  }

  append(...parts: (string|Path)[]) {
    for (let part of parts) {
      if (typeof part == 'string') {
        this.parts.push(...Path.split(part, false))
      }
      else if (part instanceof Path) {
        this.parts.push(...part.parts)
      }
    }
  }

  appendToNew(...parts: (string|Path)[]): Path {
    let intermediary = new Path(this.path, ...parts)
    return new Path(intermediary.path)
  }

  prepend(...parts: (string|Path)[]) {
    for (let part of parts) {
      if (typeof part == 'string') {
        this.parts.unshift(...Path.split(part, false))
      }
      else if (part instanceof Path) {
        this.parts.unshift(...part.parts)
      }
    }
  }

  prependToNew(...parts: (string|Path)[]): Path {
    return new Path(...parts, this)
  }

  insert(index: number, ...parts: (string|Path)[]) {
    let insert = new Path(...parts)

    if (index < 0 && index >= this.length) {
      return
    }

    this.parts.splice(index, 0, ...insert.parts)
  }

  insertToNew(index: number, ...parts: (string|Path)[]): Path {
    let newPath = new Path(this)
    newPath.insert(index, ...parts)
    return newPath
  }

  subtract(...parts: (string|Path)[]) {
    let subtract = new Path(...parts)
    let start = this.indexOf(subtract)

    if (start > -1) {
      this.parts.splice(start, subtract.length)
    }
  }

  subtractToNew(...parts: (string|Path)[]): Path {
    let newPath = new Path(this)
    newPath.subtract(...parts)
    return newPath
  }

  replace(path: string|Path, ...parts: (string|Path)[]) {
    let indexOf = this.indexOf(path)

    if (indexOf == -1) {
      return
    }

    let replace = new Path(...parts)
    let start = this.indexOf(replace)

    if (start > -1) {
      this.parts.splice(start, replace.length, ...replace.parts)
    }
  }

  replaceToNew(path: string|Path, ...parts: (string|Path)[]): Path {
    let newPath = new Path(this)
    newPath.replace(path, ...parts)
    return newPath
  }

  stats(): fs.Stats|undefined {
    try {
      return fs.lstatSync(this.path)
    }
    catch (e) {}
  }

  async statsAsync(): Promise<fs.Stats|undefined> {
    try {
      return await new Promise<fs.Stats>((resolve, reject) => fs.lstat(this.path, (err, stats) => err ? reject(err) : resolve(stats)))
    }
    catch (e) {}
  }

  exists(): boolean {
    return fs.existsSync(this.path)
  }

  async existsAsync(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => fs.exists(this.path, exists => resolve(exists)))
  }

  isFile(): boolean {
    let stats = this.stats()
    if (stats) {
      return stats.isFile()  
    }
    return false
  }

  async isFileAsync(): Promise<boolean> {
    let stats = await this.statsAsync()
    return stats ? stats.isFile() : false
  }

  isDir(): boolean {
    let stats = this.stats()
    return stats ? stats.isDirectory() : false
  }

  async isDirAsync(): Promise<boolean> {
    let stats = await this.statsAsync()
    return stats ? stats.isDirectory() : false
  }

  size(): number {
    let stats = this.stats()
    return stats ? stats.size : 0
  }

  async sizeAsync(): Promise<number> {
    let stats = await new Promise<fs.Stats>((resolve, reject) => fs.stat(this.path, (err, stats) => err ? reject(err) : resolve(stats)))
    return stats.size
  }

  mkDir() {
    if (! this.exists()) {
      fs.mkdirSync(this.path, { recursive: true })
    }
  }

  async mkDirAsync() {
    if (! await this.existsAsync()) {
      await new Promise<void>((resolve, reject) => fs.mkdir(this.path, { recursive: true }, (err) => err ? reject(err) : resolve()))
    }
  }

  touch() {
    if (! this.exists()) {
      this.dirPath.mkDir()
      let fd = fs.openSync(this.path, 'w')
      fs.closeSync(fd)
    }
  }

  async touchAsync() {
    if (! await this.existsAsync()) {
      await this.dirPath.mkDirAsync()
      let fd = await new Promise<number>((resolve, reject) => fs.open(this.path, 'w', undefined, (err, fd) => err ? reject(err) : resolve(fd)))
      await new Promise<void>((resolve, reject) => fs.close(fd, err => err ? reject(err) : resolve()))
    }
  }

  readDir(): Path[] {
    let files = fs.readdirSync(this.path)
    return files.map(path => this.appendToNew(path))
  }

  async readDirAsync(): Promise<Path[]> {
    let files = await new Promise<string[]>((resolve, reject) => fs.readdir(this.path, undefined, (err, files) => err ? reject(err) : resolve(files)))
    return files.map(path => this.appendToNew(path))
  }

  iterateFiles(handleFile: (file: Path) => void, recursive: boolean = true) {
    if (this.isDir()) {
      let contents = this.readDir()
      
      for (let content of contents) {
        if (content.isFile()) {
          handleFile(content)
        }
        else if (recursive && content.isDir) {
          content.iterateFiles(handleFile)
        }
      }
    }
  }

  async iterateFilesAsync(handleFile: (file: Path) => Promise<void>, recursive: boolean = true) {
    if (await this.isDirAsync()) {
      let contents = await this.readDirAsync()
      
      for (let content of contents) {
        if (await content.isFileAsync()) {
          await handleFile(content)
        }
        else if (recursive && await content.isDirAsync()) {
          await content.iterateFilesAsync(handleFile)
        }
      }
    }
  }

  readFile(options?: { encoding?: null; flag?: string; } | null): string {
    return this.readFileBytes(options).toString('utf8')
  }

  async readFileAsync(options?: { encoding?: null; flag?: string; } | null): Promise<string> {
    let buffer = await this.readFileBytesAsync(options)
    return buffer.toString('utf8')
  }

  readFileBytes(options?: { encoding?: null; flag?: string; } | null): Buffer {
    return fs.readFileSync(this.path, options)
  }

  async readFileBytesAsync(options?: { encoding?: null; flag?: string; } | null): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => fs.readFile(this.path, options, (err, data) => err ? reject(err) : resolve(data)))
  }

  writeFile(data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) {
    if (! this.exists()) {
      this.touch()
    }

    fs.writeFileSync(this.path, data, options)
  }

  async writeFileAsync(data: string | NodeJS.ArrayBufferView, options: WriteFileOptions = {}) {
    if (! await this.existsAsync()) {
      await this.touchAsync()
    }

    return new Promise<void>((resolve, reject) => fs.writeFile(this.path, data, options, err => err ? reject(err) : resolve()))
  }

  prependFile(data: string, options?: fs.WriteFileOptions) {
    if (! this.exists()) {
      this.touch()
    }

    if (this.isFile()) {
      let existingData = this.readFile()
      this.writeFile(data)
      this.appendFile(existingData)
    }
  }

  async prependFileAsync(data: string, options?: fs.WriteFileOptions) {
    if (! await this.existsAsync()) {
      await this.touchAsync()
    }

    if (await this.isFileAsync()) {
      let existingData = await this.readFileAsync()
      await this.writeFileAsync(data)
      await this.appendFileAsync(existingData)
    }
  }

  appendFile(data: string | Uint8Array, options?: fs.WriteFileOptions) {
    if (! this.exists()) {
      this.touch()
    }

    if (this.isFile()) {
      fs.appendFileSync(this.path, data, options)
    }
  }

  async appendFileAsync(data: any, options: fs.WriteFileOptions = {}) {
    if (! await this.existsAsync()) {
      await this.touchAsync()
    }

    if (await this.isFileAsync()) {
      new Promise<void>((resolve, reject) => fs.appendFile(this.path, data, options, err => err ? reject(err) : resolve()))
    }
  }

  copyTo(...parts: (string|Path)[]) {
    let to = new Path(...parts)

    if (this.isFile()) {
      if (to.isDir()) {
        to.filename = this.filename
      }

      fs.copyFileSync(this.path, to.path)
    }
    else if (this.isDir()) {
      to.append(this.parts[this.parts.length - 1])
      to.mkDir()

      for (let path of this.readDir()) {
        let toPath = to.appendToNew(path.subtractToNew(this))

        if (path.isDir()) {
          toPath.mkDir()
        }

        path.copyFilesTo(toPath)
      }
    }
  }

  async copyToAsync(...parts: (string|Path)[]) {
    let to = new Path(...parts)

    if (await this.isFileAsync()) {
      if (await to.isDirAsync()) {
        to.filename = this.filename
      }

      await new Promise<void>((resolve, reject) => fs.copyFile(this.path, to.path, err => err ? reject(err) : resolve()))
    }
    else if (await this.isDirAsync()) {
      for (let path of await this.readDirAsync()) {
        let toPath = to.appendToNew(path.subtractToNew(this))
        
        if (await path.isDirAsync()) {
          await toPath.mkDirAsync()
        }

        await path.copyToAsync(toPath)
      }
    }
  }

  copyFilesTo(...parts: (string|Path)[]) {
    let to = new Path(...parts)

    if (this.isFile()) {
      if (to.isDir()) {
        to.filename = this.filename
      }

      fs.copyFileSync(this.path, to.path)
    }
    else if (this.isDir()) {
      if (! to.isFile()) {
        to.mkDir()
      }

      for (let path of this.readDir()) {
        let toPath = to.appendToNew(path.subtractToNew(this))

        if (path.isDir()) {
          toPath.mkDir()
        }

        path.copyFilesTo(toPath)
      }
    }
  }

  async copyFilesToAsync(...parts: (string|Path)[]) {
    let to = new Path(...parts)

    if (await this.isFileAsync()) {
      if (await to.isDirAsync()) {
        to.filename = this.filename
      }

      await new Promise<void>((resolve, reject) => fs.copyFile(this.path, to.path, err => err ? reject(err) : resolve()))
    }
    else if (await this.isDirAsync()) {
      if (! await to.isFileAsync()) {
        await to.mkDirAsync()
      }

      for (let path of await this.readDirAsync()) {
        let toPath = to.appendToNew(path.subtractToNew(this))

        if (await path.isDirAsync()) {
          await toPath.mkDirAsync()
        }

        await path.copyFilesToAsync(toPath)
      }
    }
  }

  delete() {
    if (this.exists()) {
      if (this.isDir()) {
        fs.rmdirSync(this.path, { recursive: true })
      }
      else {
        fs.unlinkSync(this.path)
      }
    }
  }

  async deleteAsync() {
    if (await this.existsAsync()) {
      if (await this.isDirAsync()) {
        await new Promise<void>((resolve, reject) => fs.rmdir(this.path, { recursive: true }, err => err ? reject(err) : resolve()))
      }
      else {
        await new Promise<void>((resolve, reject) => fs.unlink(this.path, err => err ? reject(err) : resolve()))
      }
    }
  }

  readStream(options?: string | {
    flags?: string,
    encoding?: BufferEncoding,
    fd?: number,
    mode?: number,
    autoClose?: boolean,
    emitClose?: boolean,
    start?: number,
    end?: number,
    highWaterMark?: number
  }): fs.ReadStream {
    return fs.createReadStream(this.path, options)
  }

  writeStream(options?: string | {
    flags?: string,
    encoding?: BufferEncoding,
    fd?: number,
    mode?: number,
    autoClose?: boolean,
    emitClose?: boolean,
    start?: number,
    end?: number,
    highWaterMark?: number
  }): fs.WriteStream {
    return fs.createWriteStream(this.path, options)
  }

  static split(path: string, preserveRoot: boolean = true): string[] {
    let leadingSep = path[0] == nativePath.sep

    if (leadingSep && path.length == 1) {
      return [ path ]
    }

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
