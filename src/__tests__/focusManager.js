import React from 'react'
import { render, findDOMNode } from 'react-dom'

import focusManager from '../focusManager'

describe('focusManager', () => {
  let container
  class Dummy {
    props = {}
  }

  class Input extends React.Component {
    constructor(props) {
      super(props)
      let { handleBlur, handleFocus } = focusManager(this, this.props.config)
      this.handleBlur = jest.fn(handleBlur)
      this.handleFocus = jest.fn(handleFocus)
    }
    render() {
      return (
        <div tabIndex="01" onBlur={this.handleBlur} onFocus={this.handleFocus}>
          <input />
          <input />
        </div>
      )
    }
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should return handlers', () => {
    let inst = new Dummy()
    let { handleBlur, handleFocus } = focusManager(inst)

    expect(typeof handleBlur).toEqual('function')
    expect(typeof handleFocus).toEqual('function')
  })
  it.only('should call handlers on event', () => {
    let inst = render(<Input />, container)
    let node = findDOMNode(inst)
    node.firstChild.focus()

    expect(inst.handleFocus).toHaveBeenCalledTimes(1)
    node.lastChild.focus()
    expect(inst.handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should call willHandle', () => {
    const willHandle = jest.fn()

    let inst = render(<Input config={{ willHandle }} />, container)
    let node = findDOMNode(inst)

    node.firstChild.focus()
    expect(willHandle).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ type: 'focus' })
    )

    node.lastChild.focus()

    expect(willHandle).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ type: 'blur' })
    )
    expect(willHandle).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ type: 'focus' })
    )
  })

  it('should call didHandle', done => {
    const didHandle = jest.fn()

    let inst = render(<Input config={{ didHandle }} />, container)
    let node = findDOMNode(inst)

    node.firstChild.focus()

    setTimeout(() => {
      expect(didHandle).toHaveBeenLastCalledWith(
        true,
        expect.objectContaining({ type: 'focus' })
      )
      node.lastChild.focus()
      setTimeout(() => {
        expect(didHandle).not.toHaveBeenCalledWith(
          false,
          expect.objectContaining({ type: 'blur' })
        )
        expect(didHandle).toHaveBeenLastCalledWith(
          true,
          expect.objectContaining({ type: 'focus' })
        )
        done()
      })
    })
  })
})
