import autoFocus from '../autoFocus'

describe('autoFocus', () => {
  it('should focus on mount', () => {
    class Dummy {
      props = { autoFocus: true }
      focus = jest.fn()
    }

    let inst = new Dummy()
    autoFocus(inst)

    inst.componentDidMount()
    expect(inst.focus).toHaveBeenCalled()
  })
})
