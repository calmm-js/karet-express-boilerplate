import smoothScroll from 'smoothscroll'

export const scroll =
  typeof window === 'undefined'
    ? () => {}
    : (target, ...args) => {
        if (typeof target === 'string') target = document.querySelector(target)

        target !== undefined && target !== null && smoothScroll(target, ...args)
      }
