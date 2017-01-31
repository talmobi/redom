import { isList } from './util';

let willTimeout = [];

const needTimeout = handler => {
  if (!willTimeout.length) {
    setTimeout(() => {
      for (let i = 0; i < willTimeout.length; i++) {
        willTimeout[i]();
      }
      willTimeout = [];
    }, 0);
  }
  willTimeout.push(handler);
};

export function mount (parent, child, before) {
  _mount(parent, child, before);
}

export function _mount (parent, child, before, innerCall) {
  const parentEl = parent.el || parent;
  let childEl = child.el || child;

  if (isList(childEl)) {
    childEl = childEl.el;
  }

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  if (child !== childEl) {
    childEl.__redom_view = child;
  }
  if (child.isMounted) {
    child.remount && child.remount();
  } else {
    child.mount && child.mount();
  }
  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }
  if (child.isMounted) {
    child.remounted && needTimeout(() => { child.remounted(); });
  } else {
    child.isMounted = true;
    child.mounted && needTimeout(() => { child.mounted(); });
  }

  return child;
}

export function unmount (parent, child) {
  const parentEl = parent.el || parent;
  const childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  child.unmount && child.unmount();

  parentEl.removeChild(childEl);

  child.isMounted = false;
  child.unmounted && needTimeout(() => { child.unmounted(); });

  return child;
}
