document.body.innerHTML += `
<template id="x-btn">
  <style>
    :host{
      display: inline-flex;
      width: 100px;
      height: 40px;
      margin-left: 10px;
      margin-top: 10px;
    }
    button{
      position:relative;
      display: flex;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor:pointer;
      box-shadow:0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
      overflow:hidden;
      user-select: none;
      transition: all 0.3s cubic-bezier(0.25,0.8,0.5,1);
      border: none;
      background: #fff;
      font-size: 16px;
    }
    button:focus-visible{
      outline: none;
    }
    button:active{
      box-shadow:0 3px 5px -1px rgba(0,0,0,.2), 0 5px 8px rgba(0,0,0,.14), 0 1px 14px rgba(0,0,0,.12);
    }
    button.round{
      border-radius: 50%;
    }
    button.loading::after{
      position:absolute;
      content: '';
      width: 100%;
      height: 100%;
      left: 0;
      right:0;
      background: rgba(255,255,255,.7);
    }
  </style>
  <button>
    <slot></slot>
  </button>
</template>
`

export default class XBtn extends HTMLDivElement {
  #shadowDOM

  constructor() {
    super()
    const attributes = ['color', 'bg', 'round']
    const shadowDOM = this.#shadowDOM = this.attachShadow({ mode: 'open' })
    shadowDOM.append(document.getElementById('x-btn')
      .content
      .cloneNode(true))

    attributes.forEach(name => {
      const attr = this.getAttribute(name)
      if (attr !== null) {
        this[name] = attr
      }
    })
  }

  get color() {
    return this.getAttribute('color')
  }

  set color(color) {
    color && this.setAttribute('color', color)
    this.#shadowDOM.querySelector('button')
      .style
      .setProperty('color', color)
  }

  get bg() {
    return this.getAttribute('bg')
  }

  set bg(color) {
    color && this.setAttribute('bg', color)
    this.#shadowDOM.querySelector('button')
      .style
      .setProperty('background', color)
  }

  get round() {
    return this.getAttribute('round')
  }

  set round(round) {
    const btn = this.#shadowDOM.querySelector('button')
    const {
      clientWidth,
      clientHeight,
      style
    } = this
    round && this.setAttribute('round', round)
    if (round === '' || round === 'true') {
      btn.classList.add('round')
      setSize()
    } else if (parseFloat(round)) {
      btn.style.setProperty('border-radius', round)
    } else {
      btn.classList.remove('round')
    }

    function setSize() {
      const size = Math.min(clientWidth, clientHeight)
      style.setProperty('width', `${size}px`)
      style.setProperty('height', `${size}px`)
    }
  }

  loading() {
    const btn = this.#shadowDOM.querySelector('button')
    btn.style.setProperty('cursor', 'progress')
    btn.classList.add('loading')
  }

  hideLoading() {
    const btn = this.#shadowDOM.querySelector('button')
    btn.style.setProperty('cursor', 'pointer')
    btn.classList.remove('loading')
  }
}
