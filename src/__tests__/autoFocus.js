import autoFocus from '../autoFocus'

describe('autoFocus', () => {
  it('should focus on mount', () => {
    class Dummy {
      props = { autoFocus: true }
      focus = jest.fn()
    }

    let inst = new Dummy()
    autoFocus(inst)
    let i = 0

    inst.componentDidMount()
    expect(inst.focus).toHaveBeenCalled()
  })
})
