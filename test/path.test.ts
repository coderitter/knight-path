import { expect } from 'chai'
import 'mocha'
import Path from '../src/path'

describe('Path', function() {
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
})