import smoothScroll from "smoothscroll"

const scroll = (target, ...args) => {
  if (typeof target === "string")
    target = document.querySelector(target)

  target !== undefined && target !== null && smoothScroll(target, ...args)
}

export default typeof window === "undefined" ? () => {} : scroll
