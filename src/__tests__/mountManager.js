import mountManager from '../mountManager'

describe('mountManager', () => {
  it('should track mounts', () => {
    class Dummy {}
    let inst = new Dummy()
    let isMounted = mountManager(inst)

    expect(isMounted()).toEqual(true)
    inst.componentWillUnmount()
    expect(isMounted()).toEqual(false)
  })
})
