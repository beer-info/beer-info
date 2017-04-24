'use strict';

export const log = (...args) => (__DEVELOPMENT__ || __DEBUG__) && console.log.apply(console, args)
export const warn = (...args) => (__DEVELOPMENT__ || __DEBUG__) && console.warn.apply(console, args)
export const error = (...args) => console.error.apply(console, args)

