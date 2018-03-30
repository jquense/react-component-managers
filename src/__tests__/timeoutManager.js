import timeoutManager from '../timeoutManager'

describe('timeoutManager', () => {
  class Dummy {}

  it('should track timeouts', done => {
    let inst = new Dummy()
    let manager = timeoutManager(inst)
    let i = 0
    let finish = () => ++i >= 2 && done()

    manager.set('timeout', finish, 5)
    manager.set('other', finish, 5)
  })
  it('should clear timeouts', done => {
    let inst = new Dummy()
    let manager = timeoutManager(inst)

    manager.set('timeout', () => done(new Error('NO!')), 0)
    manager.clear('timeout')
    manager.set('other', done, 5)
  })
  it('should override timeouts', done => {
    let inst = new Dummy()
    let manager = timeoutManager(inst)

    manager.set('timeout', () => done(new Error('NO!')), 0)
    manager.set('timeout', done, 5)
  })

  it('should clear on mount', done => {
    let inst = new Dummy()
    let manager = timeoutManager(inst)

    manager.set('timeout', () => done(new Error('NO!')), 0)

    inst.componentWillUnmount()

    setTimeout(done, 5)
  })
})
