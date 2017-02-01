import { isList, notifyDown } from './util';

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

  if (!innerCall) {
    if (child.isMounted) {
      child.remount && child.remount();
      notifyDown(child, 'remount', parent);
    } else {
      child.mount && child.mount();
      notifyDown(child, 'mount', parent);
    }
  }

  if (before) {
    parentEl.insertBefore(childEl, before.el || before);
  } else {
    parentEl.appendChild(childEl);
  }

  if (!innerCall) {
    if (child.isMounted) {
      child.remounted && child.remounted();
      notifyDown(child, 'remounted', parent);
    } else {
      child.isMounted = true;
      child.mounted && child.mounted();
      notifyDown(child, 'mounted', parent);
    }
  }

  return child;
}

export function mount (parent, child, before) {
  return _mount(parent, child, before);
}

export function unmount (parent, child) {
  const parentEl = parent.el || parent;
  const childEl = child.el || child;

  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }

  notifyDown(child, 'unmount', parent, true); // true = reversed
  child.unmount && child.unmount();

  parentEl.removeChild(childEl);

  notifyDown(child, 'unmounted', parent, true); // true = reversed
  child.isMounted = false;
  child.unmounted && child.unmounted();

  return child;
}
