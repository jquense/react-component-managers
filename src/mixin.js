
export function mixin(componentClass, {
  propTypes,
  contextTypes,
  childContextTypes,
  getChildContext,
  ...protoSpec
}) {

  if (propTypes)
    componentClass.propTypes = {
      ...componentClass.propTypes,
      ...propTypes,
    }

  if (contextTypes)
    componentClass.contextTypes = {
      ...componentClass.contextTypes,
      ...contextTypes
    }

  if (childContextTypes)
    componentClass.childContextTypes = {
      ...componentClass.childContextTypes,
      ...childContextTypes
    }

  if (getChildContext) {
    let baseGCContext = componentClass.prototype.getChildContext;

    componentClass.prototype.getChildContext = function $getChildContext() {
      return {
        ...baseGCContext && baseGCContext.call(this),
        ...getChildContext.call(this)
      }
    }
  }

  Object.assign(componentClass.prototype, protoSpec);

  return componentClass;
}

export default function mixIntoClass(spec) {
  return componentClass => mixin(componentClass, spec)
}
