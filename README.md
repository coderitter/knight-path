# Mega Nice Path

## Install

`npm install mega-nice-path`

## Overview

### Create

```typescript
import Path from 'mega-nice-path'

new Path('path/to/something')
new Path('path', 'to', 'something')
new Path('path', 'to/something')

let path = new Path('path/to/something')
let otherPath = new Path(path, 'which/is', 'awesome')
```

## Directory or file

```typescript
let dir = new Path('some/directory')
let file = new Path(dir, 'awesome.file')

dir.isDir() == true
dir.exists() == true

file.isFile() == true
file.exists() == true

dir.path == 'some/directory'
dir.part(0) == 'some'

file.path == 'some/directory/awesome.file'
file.part(2) == 'awesome.file'
```

## Directory

```typescript
let dir = new Path('some/directory')

dir.prepend('in')
dir.append('for/awesome/content')
dir.path == 'in/some/directory/for/awesome/content')
dir.split() == ['in', 'some', 'directory', 'for', 'awesome', 'content']

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
file.filenameWithoutExtension == 'awesome'
file.dir == 'some/directory'
file.dirPath() == new Path('some/directory')
file.split() == ['some', 'directory', 'awesome.file']

file.delete()

import * as fs from 'fs'
let writeStream: fs.WriteStream = file.write({ flags: 'a' }) // creates a Node fs.WriteStream in append mode
let readStream: fs.ReadStream = file.read() // creates a Node fs.ReadStream
```