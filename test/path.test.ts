import { expect } from 'chai'
import 'mocha'
import { Path } from '../src/path'

describe('Path', function() {
  afterEach(function() {
    let testDir = new Path(__dirname, 'testdir')
    testDir.delete()
  })

  describe('constructor', function() {
    it('should accept a string', function() {
      let path1 = new Path('some/path')
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let path2 = new Path('some/path/')
      expect(path2.parts).to.deep.equal(['some', 'path'])

      let path3 = new Path('./some/./path/.')
      expect(path3.parts).to.deep.equal(['some', 'path'])

      let path4 = new Path('some/../path')
      expect(path4.parts).to.deep.equal(['path'])

      let path5 = new Path('/some/path')
      expect(path5.parts).to.deep.equal(['/', 'some', 'path'])

      let path6 = new Path('/some/path/')
      expect(path6.parts).to.deep.equal(['/', 'some', 'path'])

      let path7 = new Path('/some/./path/.')
      expect(path7.parts).to.deep.equal(['/', 'some', 'path'])

      let path8 = new Path('/some/../path')
      expect(path8.parts).to.deep.equal(['/', 'path'])
    })

    it('should accept multiple strings', function() {
      let path1 = new Path('some/path', 'to', 'something')
      expect(path1.parts).to.deep.equal(['some', 'path', 'to', 'something'])

      let path2 = new Path('some/./path/.', '.', './something/.')
      expect(path2.parts).to.deep.equal(['some', 'path', 'something'])

      let path3 = new Path('some/path', '..', 'something')
      expect(path3.parts).to.deep.equal(['some', 'something'])

      let path4 = new Path('/some/path/', '/to/', '/something/')
      expect(path4.parts).to.deep.equal(['/', 'some', 'path', 'to', 'something'])

      let path5 = new Path('/./some/./path/.', '.', './something/.')
      expect(path5.parts).to.deep.equal(['/', 'some', 'path', 'something'])

      let path6 = new Path('/some/path', '..', 'something')
      expect(path6.parts).to.deep.equal(['/', 'some', 'something'])
    })

    it('should accept a path', function() {
      let path1 = new Path(new Path('some/path'))
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let path2 = new Path(new Path('./some/./path/.'))
      expect(path2.parts).to.deep.equal(['some', 'path'])

      let path3 = new Path(new Path('/some/path'))
      expect(path3.parts).to.deep.equal(['/', 'some', 'path'])

      let path4 = new Path(new Path('/./some/./path/.'))
      expect(path4.parts).to.deep.equal(['/', 'some', 'path'])
    })

    it('should accept multiple paths', function() {
      let path = new Path(new Path('some/path'), new Path('to/something'))
      expect(path.parts).to.deep.equal(['some', 'path', 'to', 'something'])

      let path2 = new Path(new Path('./some/./path/.'), new Path('./to/./something/.'))
      expect(path2.parts).to.deep.equal(['some', 'path', 'to', 'something'])

      let path3 = new Path(new Path('some/path'), new Path('..'), new Path('something'))
      expect(path3.parts).to.deep.equal(['some', 'something'])
    })

    it('should accept the root path alone', function() {
      let path1 = new Path('/')
      expect(path1.parts).to.deep.equal(['/'])

      let path2 = new Path('/', 'some')
      expect(path2.parts).to.deep.equal(['/', 'some'])
    })
  })

  describe('path', function() {
    it('should get the current path', function() {
      let path = new Path('some/path')
      expect(path.path).to.equal('some/path')
    })

    it('should set a new path', function() {
      let path = new Path('some/path')

      path.path = 'some/other/path'
      expect(path.parts).to.deep.equal(['some', 'other', 'path'])

      path.path = './some/./path/.'
      expect(path.parts).to.deep.equal(['some', 'path'])

      path.path = 'some/../path'
      expect(path.parts).to.deep.equal(['path'])

      path.path = '/some/other/path'
      expect(path.parts).to.deep.equal(['/', 'some', 'other', 'path'])

      path.path = '/./some/./path/.'
      expect(path.parts).to.deep.equal(['/', 'some', 'path'])

      path.path = '/some/../path'
      expect(path.parts).to.deep.equal(['/', 'path'])
    })
  })

  describe('appendToNew', function() {
    it('should accept a string', function() {
      let path = new Path('some/path')
      let newPath = path.appendToNew('to/somewhere')
      expect(newPath.parts).to.deep.equal(['some', 'path', 'to', 'somewhere'])
    })

    it('should accept a path', function() {
      let path = new Path('some/path')
      let newPath = path.appendToNew(new Path('to/somewhere'))
      expect(newPath.parts).to.deep.equal(['some', 'path', 'to', 'somewhere'])
    })

    it('should resolve .', function() {
      let path1 = new Path('some/path')
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let newPath1 = path1.appendToNew('./to/./somewhere/.')
      expect(newPath1.path).to.equal('some/path/to/somewhere')
      expect(newPath1.parts).to.deep.equal(['some', 'path', 'to', 'somewhere'])

      let path2 = new Path('/some/path')
      expect(path2.parts).to.deep.equal(['/', 'some', 'path'])

      let newPath2 = path2.appendToNew('./to/./somewhere/.')
      expect(newPath2.path).to.equal('/some/path/to/somewhere')
      expect(newPath2.parts).to.deep.equal(['/', 'some', 'path', 'to', 'somewhere'])
    })

    it('should resolve ..', function() {
      let path1 = new Path('some/path')
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let newPath1 = path1.appendToNew('..')
      expect(newPath1.path).to.equal('some')
      expect(newPath1.parts).to.deep.equal(['some'])

      let path2 = new Path('/some/path')
      expect(path2.parts).to.deep.equal(['/', 'some', 'path'])

      let newPath2 = path2.appendToNew('..')
      expect(newPath2.path).to.equal('/some')
      expect(newPath2.parts).to.deep.equal(['/', 'some'])
    })
  })

  describe('filename', function() {
    it('should get the filename', function() {
      let path = new Path('some/directory/awesome.file')
      expect(path.filename).to.equal('awesome.file')
    })

    it('should set a new filename', function() {
      let path = new Path('some/directory/awesome.file')
      path.filename = 'amazing.file'
      expect(path.parts).to.deep.equal(['some', 'directory', 'amazing.file'])
    })
  })

  describe('extension', function() {
    it('should get the extension', function() {
      let path = new Path('some/directory/awesome.file')
      expect(path.extension).to.equal('.file')
    })

    it('should set a new extension', function() {
      let path = new Path('some/directory/awesome.file')

      path.extension = 'ext'
      expect(path.parts).to.deep.equal(['some', 'directory', 'awesome.ext'])

      path.extension = '.file'
      expect(path.parts).to.deep.equal(['some', 'directory', 'awesome.file'])
    })
  })

  describe('filenameWithoutExtension', function() {
    it('should get the filename witout extension', function() {
      let path = new Path('some/directory/awesome.file')
      expect(path.filenameWithoutExtension).to.equal('awesome')
    })

    it('should set a new filename which has no extension', function() {
      let path = new Path('some/directory/awesome.file')
      path.filenameWithoutExtension = 'amazing'
      expect(path.parts).to.deep.equal(['some', 'directory', 'amazing.file'])
    })
  })

  describe('directory', function() {
    it('should get the directory', function() {
      let path = new Path('some/directory/awesome.file')
      expect(path.dir).to.equal('some/directory')
    })

    it('should set a new directory', function() {
      let path = new Path('some/directory/awesome.file')
      path.dir = 'some/other/directory'
      expect(path.parts).to.deep.equal(['some', 'other', 'directory', 'awesome.file'])
    })
  })

  describe('indexOf', function() {
    it('should find an index if the path is contained', function() {
      let path = new Path('path/to/something')

      expect(path.indexOf('path')).to.equal(0)
      expect(path.indexOf('to')).to.equal(1)
      expect(path.indexOf('something')).to.equal(2)

      expect(path.indexOf('path/to')).to.equal(0)
      expect(path.indexOf('to/something')).to.equal(1)

      expect(path.indexOf('path/to/something')).to.equal(0)
    })

    it('should not find an index if the path is not contained', function() {
      let path = new Path('path/to/something')

      expect(path.indexOf('elsewhere')).to.equal(-1)
      expect(path.indexOf('path/something')).to.equal(-1)
      expect(path.indexOf('another/path')).to.equal(-1)
      expect(path.indexOf('something/else')).to.equal(-1)
      expect(path.indexOf('/path')).to.equal(-1)
      expect(path.indexOf('/to')).to.equal(-1)
      expect(path.indexOf('/something')).to.equal(-1)
      expect(path.indexOf('another/path/to/something')).to.equal(-1)
      expect(path.indexOf('path/to/something/else')).to.equal(-1)
    })
  })

  describe('startsWith', function() {
    it('should match if a path starts with another path', function() {
      let p1 = new Path('same/different1')
      let p2 = new Path('same')
      let p3 = new Path('same/different1')

      expect(p1.startsWith(p2)).to.be.true
      expect(p1.startsWith(p3)).to.be.true
    })

    it('should not match if a path does not start with another path', function() {
      let p1 = new Path('same/different1')
      let p2 = new Path('same/differnet2')

      expect(p1.startsWith(p2)).to.be.false
    })

    it('should not match if the path with which to match is longer', function() {
      let p1 = new Path('same/same')
      let p2 = new Path('same/same/more')

      expect(p1.startsWith(p2)).to.be.false
    })
  })

  describe('endsWith', function() {
    it('should match if a path ends with another path', function() {
      let path = new Path('path/to/something')

      expect(path.endsWith('something')).to.be.true
      expect(path.endsWith('to/something')).to.be.true
      expect(path.endsWith('path/to/something')).to.be.true
    })

    it('should not match if a path does not end with another path', function() {
      let path = new Path('path/to/something')
      expect(path.endsWith('path')).to.be.false
      expect(path.endsWith('to')).to.be.false
      expect(path.endsWith('path/to')).to.be.false
      expect(path.endsWith('path/to/nowhere')).to.be.false
    })

    it('should not match if the path with which to match is longer', function() {
      let path = new Path('path/to/something')
      expect(path.endsWith('path/to/something/else')).to.be.false
      expect(path.endsWith('another/path/to/something')).to.be.false
    })
  })

  describe('subtract', function() {
    it('should subtract the sub path', function() {
      let path1 = new Path('path/to/somewhere/cool')
      path1.subtract('path')
      expect(path1.parts).to.deep.equal(['to', 'somewhere', 'cool'])

      let path2 = new Path('path/to/somewhere/cool')
      path2.subtract('path/to')
      expect(path2.parts).to.deep.equal(['somewhere', 'cool'])

      let path3 = new Path('path/to/somewhere/cool')
      path3.subtract('to')
      expect(path3.parts).to.deep.equal(['path', 'somewhere', 'cool'])

      let path4 = new Path('path/to/somewhere/cool')
      path4.subtract('to/somewhere')
      expect(path4.parts).to.deep.equal(['path', 'cool'])

      let path5 = new Path('path/to/somewhere/cool')
      path5.subtract('somewhere/cool')
      expect(path5.parts).to.deep.equal(['path', 'to'])

      let path6 = new Path('path/to/somewhere/cool')
      path6.subtract('cool')
      expect(path6.parts).to.deep.equal(['path', 'to', 'somewhere'])

      let path7 = new Path('path/to/somewhere/cool')
      path7.subtract('cool/')
      expect(path7.parts).to.deep.equal(['path', 'to', 'somewhere'])

      let path8 = new Path('path/to/somewhere/cool')
      path8.subtract('./to/./somewhere/.')
      expect(path8.parts).to.deep.equal(['path', 'cool'])

      let path9 = new Path('path/to/somewhere/cool')
      path9.subtract('to/../somewhere')
      expect(path9.parts).to.deep.equal(['path', 'to', 'cool'])
    })

    it('should subtract a sub path containing the root path', function() {
      let path1 = new Path('/path/to/somewhere/cool')
      path1.subtract('/')
      expect(path1.parts).to.deep.equal(['path', 'to', 'somewhere', 'cool'])

      let path2 = new Path('/path/to/somewhere/cool')
      path2.subtract('/path')
      expect(path2.parts).to.deep.equal(['to', 'somewhere', 'cool'])

      let path3 = new Path('/path/to/somewhere/cool')
      path3.subtract('/./path/.')
      expect(path3.parts).to.deep.equal(['to', 'somewhere', 'cool'])

      let path4 = new Path('/path/to/somewhere/cool')
      path4.subtract('/path/to/..')
      expect(path4.parts).to.deep.equal(['to', 'somewhere', 'cool'])

      let path5 = new Path('/path/to/somewhere/cool')
      path5.subtract('/to')
      expect(path5.parts).to.deep.equal(['/', 'path', 'to', 'somewhere', 'cool'])

      let path6 = new Path('/path/to/somewhere/cool')
      path6.subtract('./to/.')
      expect(path6.parts).to.deep.equal(['/', 'path', 'somewhere', 'cool'])

      let path7 = new Path('/path/to/somewhere/cool')
      path7.subtract('/to/../somehwere')
      expect(path7.parts).to.deep.equal(['/', 'path', 'to', 'somewhere', 'cool'])
    })

    it('should not subtract if the sub path does not match', function() {
      let path1 = new Path('path/to/somewhere/cool')
      path1.subtract('path/somewhere')
      expect(path1.parts).to.deep.equal(['path', 'to', 'somewhere', 'cool'])

      let path2 = new Path('path/to/somewhere/cool')
      path2.subtract('path/to/somewhere/cool/af')
      expect(path2.parts).to.deep.equal(['path', 'to', 'somewhere', 'cool'])

      let path3 = new Path('path/to/somewhere/cool')
      path3.subtract('secret/path/to/somewhere/cool')
      expect(path3.parts).to.deep.equal(['path', 'to', 'somewhere', 'cool'])
    })
  })

  describe('mkdir', function() {
    it('should create non existing directory', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.mkDir()
      expect(testDir.isDir()).to.be.true
    })

    it('should create non existing directory path', function() {
      let testDir = new Path(__dirname, 'testdir', 'subdir')
      testDir.mkDir()
      expect(testDir.isDir()).to.be.true
    })

    it('should not create an existing directory', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.mkDir()
      testDir.mkDir()
    })
  })

  describe('touch', function() {
    it('should create a new file', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.mkDir()
      expect(testDir.isDir()).to.be.true

      let file = testDir.appendToNew('awesome.file')
      file.touch()
      expect(file.isFile()).to.be.true
    })

    it('should create a new file in a sub directory that does not exist', function() {
      let testDir = new Path(__dirname, 'testdir')

      let file = testDir.appendToNew('subdir', 'awesome.file')      
      file.touch()
      expect(file.isFile()).to.be.true
    })
  })

  describe('writeFile', function() {
    it('should write an empty file', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()
      file.writeFile('test')
      expect(file.readFileAsUtf8()).to.equal('test')
    })

    it('should create and write an empty file', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.writeFile('test')
      expect(file.readFileAsUtf8()).to.equal('test')
    })

    it('should overwrite an existing file', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.writeFile('test')
      file.writeFile('test2')
      expect(file.readFileAsUtf8()).to.equal('test2')
    })
  })

  describe('prependToFile', function() {
    it('should prepend to an existing file', async function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()
      file.prependToFile('test')
      expect(file.readFileAsUtf8()).to.equal('test')
      file.prependToFile('before')
      expect(file.readFileAsUtf8()).to.equal('beforetest')
    })

    it('should create a new file and prepend', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.prependToFile('test')
      expect(file.readFileAsUtf8()).to.equal('test')
    })
  })

  describe('appendToFile', function() {
    it('should append to an existing file', async function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.writeFile('test')
      expect(file.readFileAsUtf8()).to.equal('test')
      file.appendToFile('after')
      expect(file.readFileAsUtf8()).to.equal('testafter')
    })

    it('should create a new file and append', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.appendToFile('test')
      expect(file.size()).to.equal(4)
    })
  })

  describe('delete', function() {
    it('should delete a file', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()
      expect(file.isFile()).to.be.true

      file.delete()
      expect(file.exists()).to.be.false
    })

    it('should delete a directory', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.mkDir()
      testDir.delete()
      expect(testDir.exists()).to.be.false
    })

    it('should not delete if nothing is there', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.delete()
    })

    it('should delete a directory with all its contents', function() {
      let testDir = new Path(__dirname, 'testdir')
      testDir.appendToNew('file1.file').touch()
      testDir.appendToNew('subdir/file2.file').touch()
      
      testDir.delete()
      expect(testDir.exists()).to.be.false
    })
  })

  describe('copyTo', function() {
    it('should copy a file into a directory', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()

      let to = new Path(file.dir, 'subdir')
      file.copyTo(to)
      
      expect(file.exists()).to.be.true
    })

    it('should copy a file overwriting an existing file', async function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()
      expect(file.size()).to.equal(0)

      let to = testDir.appendToNew('amazing.file')
      to.appendToFile('abc')
      expect(to.size()).to.equal(3)
      
      file.copyTo(to)

      expect(to.isFile()).to.be.true
      expect(to.size()).to.equal(0)
    })

    it('should copy a whole directory into another one', function() {
      let testDir = new Path(__dirname, 'testdir')
      let from = testDir.appendToNew('from')
      let file1 = from.appendToNew('file1.file')
      let subdir1 = from.appendToNew('subdir1')
      let subdir2 = from.appendToNew('subdir1')
      let file2 = subdir1.appendToNew('file2.file')
      file1.touch()
      file2.touch()
      subdir2.mkDir()

      let to = testDir.appendToNew('to')
      from.copyTo(to)

      to.append('from')

      expect(to.exists()).to.be.true
      expect(to.appendToNew('file1.file').exists()).to.be.true
      expect(to.appendToNew('subdir1').exists()).to.be.true
      expect(to.appendToNew('subdir1/file2.file').exists()).to.be.true
    })
  })

  describe('copyFilesTo', function() {
    it('should copy a file into a directory', function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()

      let to = new Path(file.dir, 'subdir')
      file.copyFilesTo(to)
      
      expect(file.exists()).to.be.true
    })

    it('should copy a file overwriting an existing file', async function() {
      let testDir = new Path(__dirname, 'testdir')
      let file = testDir.appendToNew('awesome.file')
      file.touch()
      expect(file.size()).to.equal(0)

      let to = testDir.appendToNew('amazing.file')
      to.appendToFile('abc')
      expect(to.size()).to.equal(3)
      
      file.copyFilesTo(to)

      expect(to.isFile()).to.be.true
      expect(to.size()).to.equal(0)
    })

    it('should copy a whole directory into another one', function() {
      let testDir = new Path(__dirname, 'testdir')
      let from = testDir.appendToNew('from')
      let file1 = from.appendToNew('file1.file')
      let subdir1 = from.appendToNew('subdir1')
      let subdir2 = from.appendToNew('subdir1')
      let file2 = subdir1.appendToNew('file2.file')
      file1.touch()
      file2.touch()
      subdir2.mkDir()

      let to = testDir.appendToNew('to')
      from.copyFilesTo(to)

      expect(to.exists()).to.be.true
      expect(to.appendToNew('file1.file').exists()).to.be.true
      expect(to.appendToNew('subdir1').exists()).to.be.true
      expect(to.appendToNew('subdir1/file2.file').exists()).to.be.true
    })
  })
})