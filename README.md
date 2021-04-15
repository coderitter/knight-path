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

## Directory or file

```typescript
let dir = new Path('some/directory')
dir.isDir() == true
dir.exists() == true

let file = new Path(dir, 'awesome.file')
file.isFile() == true
file.exists() == true
```

## Directory

```typescript
let dir = new Path('some/directory')

dir.prepend('in')
dir.parts == 'in/some/directory'

dir.append('for/awesome/content')
dir.parts == 'in/some/directory/for/awesome/content'

let awesome = dir.appendToNew('awesome.file')

dir.subtract('some/directory')
dir.path == 'in/for/awesome/content'

dir.equals('in/for') == false
dir.startsWith('in/for') == true

dir.delete() // deletes the whole directory including its contents and sub contents
dir.mkDir() // creates the whole file path if not exists

let recursive = true
dir.iterateFiles((file: Path) => { ... }, recursive)

for (let path of dir.contents()) {
  if (path.isDir()) {

  }
  else {

  }
}
```

## File

```typescript
let file = new Path('some/directory/awesome.file')

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

file.delete()

import * as fs from 'fs'
let writeStream: fs.WriteStream = file.write({ flags: 'a' }) // creates a Node fs.WriteStream in append mode
let readStream: fs.ReadStream = file.read() // creates a Node fs.ReadStream
```