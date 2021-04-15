# Knight Path by Coderitter

## Install

`npm install knight-path`

## Overview

### Create

```typescript
import Path from 'knight-path'

new Path('path/to/something')
new Path('path', 'to', 'something')
new Path('path', 'to/something')

let path = new Path('path/to/something')
path.path = 'path/to/something'
path.parts == ['path', 'to', 'something']

let otherPath = new Path(path, 'which/is', 'awesome')
otherPath.path == 'path/to/something/which/is/awesome'
otherPath.parts == ['path', 'to', 'something', 'which', 'is', 'awesome']

let rootPath = new Path('/path/to/something')
rootPath.path == '/path/to/something'
rootPath.parts == ['/', 'path', 'to', 'something']

path.length == 3
```

### Change

```typescript
let path = new Path('some/path')

path.parts = ['some', 'other', 'path']
path.path = 'some/other/path'
path.setPath('some', new Path('other'), 'path'))
```

## Path

```typescript
path.equals('in/any/directory') == true
path.startsWith('in/any') == true
path.endsWith('any/directory') == true
path.indexOf('any/directory') == 1

path.prepend('in')
path.prependToNew('in')
path.parts == 'in/some/directory'

path.append('for/content')
path.appendToNew('for/content')
path.path == 'in/some/directory/for/content'

path.insert(4, 'awesome')
path.insertToNew(4, 'awesome')
path.path == 'in/some/directory/for/awesome/content'

path.subtract('for/awesome/content')
path.subtractToNew('for/awesome/content')
path.path == 'in/some/directory'

path.replace('some', 'any')
path.replaceToNew('some', 'any')
path.path == 'in/any/directory'
```

## Directory

```typescript
let dir = new Path('some/directory')

dir.exists()
dir.isDir()

dir.mkDir() // creates the whole file path if not exists
dir.delete() // deletes the whole directory including its contents and sub contents
dir.move(new Path('to/another/directory'))

let recursive = true
dir.iterateFiles((file: Path) => { ... }, recursive)

for (let path of dir.dirContent()) {
  // iterate through directories and files
}
```

## File

```typescript
let file = new Path('some/directory/awesome.file')

file.exists()
file.isFile()

file.filename == 'awesome.file'
file.extension == '.file'
file.filenameWithoutExtension == 'awesome'
file.dir == 'some/directory'
file.dirPath == new Path('some/directory')

file.filename = 'amazing.file'
file.path = 'some/directory/amazing.file'

file.extension = 'ext'
file.extension = '.ext'
file.path == 'some/directory/amazing.ext'

file.filenameWithoutExtension = 'awesome'
file.path == 'some/directory/awesome.ext'

file.dir = 'some/other/directory'
file.path == 'some/other/directory/awesome.ext'

file.size()
file.touch()
file.writeFile('some content')
file.prependFile('something before')
file.appendFile('something after')
file.copy(new Path('into/another/directory'))
file.copy(new Path('into/another/directory/to/or/over/a/new/file.ext'))
file.delete()

import * as fs from 'fs'
let writeStream: fs.WriteStream = file.writeStream({ flags: 'a' }) // creates a Node fs.WriteStream in append mode
let readStream: fs.ReadStream = file.readStream() // creates a Node fs.ReadStream
```