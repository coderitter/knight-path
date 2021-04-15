import { expect } from 'chai'
import 'mocha'
import Path from '../src/path'

describe('Path', function() {
  describe('constructor', function() {
    it('should accept a string', function() {
      let path1 = new Path('some/path')
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let path2 = new Path('some/path/')
      expect(path2.parts).to.deep.equal(['some', 'path'])

      let path3 = new Path('/some/path')
      expect(path3.parts).to.deep.equal(['/', 'some', 'path'])

      let path4 = new Path('/some/path/')
      expect(path4.parts).to.deep.equal(['/', 'some', 'path'])
    })

    it('should accept a multiple strings', function() {
      let path1 = new Path('some/path', 'to', 'something')
      expect(path1.parts).to.deep.equal(['some', 'path', 'to', 'something'])

      let path2 = new Path('/some/path/', '/to/', '/something/')
      expect(path2.parts).to.deep.equal(['/', 'some', 'path', 'to', 'something'])
    })

    it('should accept a path', function() {
      let path1 = new Path(new Path('some/path'))
      expect(path1.parts).to.deep.equal(['some', 'path'])

      let path2 = new Path(new Path('/some/path'))
      expect(path2.parts).to.deep.equal(['/', 'some', 'path'])
    })

    it('should accept multiple paths', function() {
      let pathParameter1 = new Path('some/path')
      let pathParameter2 = new Path('to/something')

      let path = new Path(pathParameter1, pathParameter2)
      expect(path.parts).to.deep.equal(['some', 'path', 'to', 'something'])
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

  describe('copy', function() {
    it('should copy a file into a directory', function() {

    })
  })
})