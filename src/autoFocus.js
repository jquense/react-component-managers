import { bool } from 'prop-types'
import { findDOMNode } from 'react-dom'
import spyOnComponent from 'spy-on-component'

export const PropTypes = {
  autoFocus: bool,
}

export default function makeAutoFocusable(instance) {
  spyOnComponent(instance, {
    componentDidMount() {
      let { autoFocus } = this.props

      if (autoFocus) this.focus ? this.focus() : findDOMNode(this).focus()
    },
  })
}
