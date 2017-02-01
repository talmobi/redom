import { text } from './text';
import { _mount } from './mount';
import { setAttr } from './setattr';

export function parseArguments (element, args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) {
      continue;
    }

    // support middleware
    if (typeof arg === 'function') {
      arg(element);
    } else if (isString(arg) || isNumber(arg)) {
      element.appendChild(text(arg));
    } else if (isNode(arg) || isNode(arg.el) || isList(arg.el)) {
      _mount(element, arg, undefined, true);
    } else if (arg.length) {
      parseArguments(element, arg);
    } else if (typeof arg === 'object') {
      setAttr(element, arg);
    }
  }
}

export function notifyDown (child, eventName, originalChild, reversed) {
  var childEl = child.el || child;
  var traverse = childEl.firstChild;

  while (traverse) {
    var next = traverse.nextSibling;
    var view = traverse.__redom_view || traverse;
    var event = view[eventName];

    reversed && notifyDown(traverse, eventName, originalChild || child, reversed);

    event && event.call(view, originalChild || child);

    !reversed && notifyDown(traverse, eventName, originalChild || child, reversed);

    traverse = next;
  }
}

export const is = type => a => typeof a === type;

export const isString = is('string');
export const isNumber = is('number');
export const isFunction = is('function');

export const isNode = a => a && a.nodeType;
export const isList = a => a && a.__redom_list;

export const doc = document;
