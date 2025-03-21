// eslint-disable-next-line @typescript-eslint/no-use-before-define
const BMapLib = (window.BMapLib = BMapLib || {})
const INFOBOX_AT_TOP = 1
const INFOBOX_AT_RIGHT = 2
const INFOBOX_AT_BOTTOM = 3
const INFOBOX_AT_LEFT = 4;
(function() {
  let b
  const a = (b = a || { version: '1.5.0' })
  a.guid = '$BAIDU$';
  (function() {
    window[a.guid] = window[a.guid] || {}
    a.lang = a.lang || {}
    a.lang.isString = function(d) {
      return Object.prototype.toString.call(d) == '[object String]'
    }
    a.lang.isFunction = function(d) {
      return Object.prototype.toString.call(d) == '[object Function]'
    }
    a.lang.Event = function(d, e) {
      this.type = d
      this.returnValue = true
      this.target = e || null
      this.currentTarget = null
    }
    a.object = a.object || {}
    a.extend = a.object.extend = function(f, d) {
      for (const e in d) {
        if (d.hasOwnProperty(e)) {
          f[e] = d[e]
        }
      }
      return f
    }
    a.event = a.event || {}
    a.event._listeners = a.event._listeners || []
    a.dom = a.dom || {}
    a.dom._g = function(d) {
      if (a.lang.isString(d)) {
        return document.getElementById(d)
      }
      return d
    }
    a._g = a.dom._g
    a.event.on = function(e, h, j) {
      h = h.replace(/^on/i, '')
      e = a.dom._g(e)
      let i = function(l) {
        j.call(e, l)
      }
      const d = a.event._listeners
      const g = a.event._eventFilter
      let k
      let f = h
      h = h.toLowerCase()
      if (g && g[h]) {
        k = g[h](e, h, i)
        f = k.type
        i = k.listener
      }
      if (e.addEventListener) {
        e.addEventListener(f, i, false)
      } else {
        if (e.attachEvent) {
          e.attachEvent('on' + f, i)
        }
      }
      d[d.length] = [e, h, j, i, f]
      return e
    }
    a.on = a.event.on
    a.event.un = function(f, i, e) {
      f = a.dom._g(f)
      i = i.replace(/^on/i, '').toLowerCase()
      const l = a.event._listeners
      let g = l.length
      const h = !e
      let k
      let j
      let d
      while (g--) {
        k = l[g]
        if (k[1] === i && k[0] === f && (h || k[2] === e)) {
          j = k[4]
          d = k[3]
          if (f.removeEventListener) {
            f.removeEventListener(j, d, false)
          } else {
            if (f.detachEvent) {
              f.detachEvent('on' + j, d)
            }
          }
          l.splice(g, 1)
        }
      }
      return f
    }
    a.un = a.event.un
    a.dom.g = function(d) {
      if (typeof d === 'string' || d instanceof String) {
        return document.getElementById(d)
      } else {
        if (d && d.nodeName && (d.nodeType == 1 || d.nodeType == 9)) {
          return d
        }
      }
      return null
    }
    a.g = a.G = a.dom.g
    a.dom._styleFixer = a.dom._styleFixer || {}
    a.dom._styleFilter = a.dom._styleFilter || []
    a.dom._styleFilter.filter = function(e, h, j) {
      for (var d = 0, g = a.dom._styleFilter, f; (f = g[d]); d++) {
        if ((f = f[j])) {
          h = f(e, h)
        }
      }
      return h
    }
    a.string = a.string || {}
    a.string.toCamelCase = function(d) {
      if (d.indexOf('-') < 0 && d.indexOf('_') < 0) {
        return d
      }
      return d.replace(/[-_][^-_]/g, function(e) {
        return e.charAt(1).toUpperCase()
      })
    }
    a.dom.setStyle = function(f, e, g) {
      const h = a.dom
      let d
      f = h.g(f)
      e = a.string.toCamelCase(e)
      if ((d = h._styleFilter)) {
        g = d.filter(e, g, 'set')
      }
      d = h._styleFixer[e]
      d && d.set ? d.set(f, g) : (f.style[d || e] = g)
      return f
    }
    a.setStyle = a.dom.setStyle
    a.dom.setStyles = function(e, f) {
      e = a.dom.g(e)
      for (const d in f) {
        a.dom.setStyle(e, d, f[d])
      }
      return e
    }
    a.setStyles = a.dom.setStyles
    a.browser = a.browser || {}
    a.browser.ie = a.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent)
      ? document.documentMode || +RegExp.$1
      : undefined
    a.dom._NAME_ATTRS = (function() {
      const d = {
        cellpadding: 'cellPadding',
        cellspacing: 'cellSpacing',
        colspan: 'colSpan',
        rowspan: 'rowSpan',
        valign: 'vAlign',
        usemap: 'useMap',
        frameborder: 'frameBorder'
      }
      if (a.browser.ie < 8) {
        d.for = 'htmlFor'
        d.class = 'className'
      } else {
        d.htmlFor = 'for'
        d.className = 'class'
      }
      return d
    })()
    a.dom.setAttr = function(e, d, f) {
      e = a.dom.g(e)
      if (d == 'style') {
        e.style.cssText = f
      } else {
        d = a.dom._NAME_ATTRS[d] || d
        e.setAttribute(d, f)
      }
      return e
    }
    a.setAttr = a.dom.setAttr
    a.dom.setAttrs = function(f, d) {
      f = a.dom.g(f)
      for (const e in d) {
        a.dom.setAttr(f, e, d[e])
      }
      return f
    }
    a.setAttrs = a.dom.setAttrs
    a.dom.create = function(f, d) {
      const g = document.createElement(f)
      const e = d || {}
      return a.dom.setAttrs(g, e)
    }
    b.undope = true
  })()
  const c = (BMapLib.InfoBox = function(f, e, d) {
    this._content = e || ''
    this._isOpen = false
    this._map = f
    this._opts = d = d || {}
    this._opts.offset = d.offset || new BMap.Size(0, 0)
    this._opts.boxClass = d.boxClass || 'infoBox'
    this._opts.boxStyle = d.boxStyle || {}
    this._opts.closeIconMargin = d.closeIconMargin || '2px'
    this._opts.closeIconUrl = d.closeIconUrl || 'close.png'
    this._opts.enableAutoPan = !!d.enableAutoPan
    this._opts.align = d.align || INFOBOX_AT_TOP
  })
  c.prototype = new BMap.Overlay()
  c.prototype.initialize = function(e) {
    const d = this
    const g = (this._div = a.dom.create('div', { class: this._opts.boxClass }))
    a.dom.setStyles(g, this._opts.boxStyle)
    g.style.position = 'absolute'
    this._setContent(this._content)
    const f = e.getPanes().floatPane
    f.style.width = 'auto'
    f.appendChild(g)
    this._getInfoBoxSize()
    a.event.on(g, 'onmousedown', function(h) {
      d._stopBubble(h)
    })
    a.event.on(g, 'onmouseover', function(h) {
      d._stopBubble(h)
    })
    a.event.on(g, 'click', function(h) {
      d._stopBubble(h)
    })
    a.event.on(g, 'dblclick', function(h) {
      d._stopBubble(h)
    })
    return g
  }
  c.prototype.draw = function() {
    this._isOpen && this._adjustPosition(this._point)
  }
  c.prototype.open = function(d) {
    const e = this
    let f
    if (!this._isOpen) {
      this._map.addOverlay(this)
      this._isOpen = true
      setTimeout(function() {
        e._dispatchEvent(e, 'open', { point: e._point })
      }, 10)
    }
    if (d instanceof BMap.Point) {
      f = d
      this._removeMarkerEvt()
    } else {
      if (d instanceof BMap.Marker) {
        if (this._marker) {
          this._removeMarkerEvt()
        }
        f = d.getPosition()
        this._marker = d
        !this._markerDragend &&
          this._marker.addEventListener(
            'dragend',
            (this._markerDragend = function(g) {
              e._point = g.point
              e._adjustPosition(e._point)
              e._panBox()
              e.show()
            })
          )
        !this._markerDragging &&
          this._marker.addEventListener(
            'dragging',
            (this._markerDragging = function() {
              e.hide()
              e._point = e._marker.getPosition()
              e._adjustPosition(e._point)
            })
          )
      }
    }
    this.show()
    this._point = f
    this._panBox()
    this._adjustPosition(this._point)
  }
  c.prototype.close = function() {
    if (this._isOpen) {
      this._map.removeOverlay(this)
      this._remove()
      this._isOpen = false
      this._dispatchEvent(this, 'close', { point: this._point })
    }
  }
  c.prototype.enableAutoPan = function() {
    this._opts.enableAutoPan = true
  }
  c.prototype.disableAutoPan = function() {
    this._opts.enableAutoPan = false
  }
  c.prototype.setContent = function(d) {
    this._setContent(d)
    this._getInfoBoxSize()
    this._adjustPosition(this._point)
  }
  c.prototype.setPosition = function(d) {
    this._point = d
    this._adjustPosition(d)
    this._removeMarkerEvt()
  }
  c.prototype.getPosition = function() {
    return this._point
  };
  (c.prototype.getOffset = function() {
    return this._opts.offset
  }),
  (c.prototype._remove = function() {
    const d = this
    if (this.domElement && this.domElement.parentNode) {
      a.event.un(this._div.firstChild, 'click', d._closeHandler())
      this.domElement.parentNode.removeChild(this.domElement)
    }
    this.domElement = null
    this._isOpen = false
    this.dispatchEvent('onremove')
  }),
  a.object.extend(c.prototype, {
    _getCloseIcon: function() {
      const d =
          "<img src='" +
          this._opts.closeIconUrl +
          "' align='right' style='position:absolute;right:0px;cursor:pointer;margin:" +
          this._opts.closeIconMargin +
          "'/>"
      return d
    },
    _setContent: function(e) {
      if (!this._div) {
        return
      }
      const d = this._getCloseIcon()
      if (typeof e.nodeType === 'undefined') {
        this._div.innerHTML = d + e
      } else {
        this._div.innerHTML = d
        this._div.appendChild(e)
      }
      this._content = e
      this._addEventToClose()
    },
    _adjustPosition: function(f) {
      const d = this._getPointPosition(f)
      const e = this._marker && this._marker.getIcon()
      switch (this._opts.align) {
        case INFOBOX_AT_TOP:
          if (this._marker) {
            this._div.style.bottom =
                -(
                  d.y -
                  this._opts.offset.height -
                  e.anchor.height +
                  e.infoWindowAnchor.height
                ) -
                this._marker.getOffset().height +
                2 +
                'px'
          } else {
            this._div.style.bottom = -(d.y - this._opts.offset.height) + 'px'
          }
          break
        case INFOBOX_AT_BOTTOM:
          if (this._marker) {
            this._div.style.top =
                d.y +
                this._opts.offset.height -
                e.anchor.height +
                e.infoWindowAnchor.height +
                this._marker.getOffset().height +
                'px'
          } else {
            this._div.style.top = d.y + this._opts.offset.height + 'px'
          }
          break
      }
      if (this._marker) {
        this._div.style.left =
            d.x -
            e.anchor.width +
            this._marker.getOffset().width +
            e.infoWindowAnchor.width -
            this._boxWidth / 2 +
            'px'
      } else {
        this._div.style.left = d.x - this._boxWidth / 2 + 'px'
      }
    },
    _getPointPosition: function(d) {
      this._pointPosition = this._map.pointToOverlayPixel(d)
      return this._pointPosition
    },
    _getInfoBoxSize: function() {
      this._boxWidth = parseInt(this._div.offsetWidth, 10)
      this._boxHeight = parseInt(this._div.offsetHeight, 10)
    },
    _addEventToClose: function() {
      const d = this
      a.event.on(this._div.firstChild, 'click', d._closeHandler())
      this._hasBindEventClose = true
    },
    _closeHandler: function() {
      const d = this
      return function(f) {
        d.close()
      }
    },
    _stopBubble: function(d) {
      if (d && d.stopPropagation) {
        d.stopPropagation()
      } else {
        window.event.cancelBubble = true
      }
    },
    _panBox: function() {
      if (!this._opts.enableAutoPan) {
        return
      }
      const i = parseInt(this._map.getContainer().offsetHeight, 10)
      const o = parseInt(this._map.getContainer().offsetWidth, 10)
      const j = this._boxHeight
      const d = this._boxWidth
      if (j >= i || d >= o) {
        return
      }
      if (!this._map.getBounds().containsPoint(this._point)) {
        this._map.setCenter(this._point)
      }
      const e = this._map.pointToPixel(this._point)
      let p
      let m
      let l
      const g = d / 2 - e.x
      const n = d / 2 + e.x - o
      if (this._marker) {
        var k = this._marker.getIcon()
      }
      switch (this._opts.align) {
        case INFOBOX_AT_TOP:
          var f = this._marker
            ? k.anchor.height +
                this._marker.getOffset().height -
                k.infoWindowAnchor.height
            : 0
          p = j - e.y + this._opts.offset.height + f + 2
          break
        case INFOBOX_AT_BOTTOM:
          var f = this._marker
            ? -k.anchor.height +
                k.infoWindowAnchor.height +
                this._marker.getOffset().height +
                this._opts.offset.height
            : 0
          m = j + e.y - i + f + 4
          break
      }
      panX = g > 0 ? g : n > 0 ? -n : 0
      l = p > 0 ? p : m > 0 ? -m : 0
      this._map.panBy(panX, l)
    },
    _removeMarkerEvt: function() {
      this._markerDragend &&
          this._marker.removeEventListener('dragend', this._markerDragend)
      this._markerDragging &&
          this._marker.removeEventListener('dragging', this._markerDragging)
      this._markerDragend = this._markerDragging = null
    },
    _dispatchEvent: function(d, e, g) {
      e.indexOf('on') != 0 && (e = 'on' + e)
      const f = new a.lang.Event(e)
      if (g) {
        for (const h in g) {
          f[h] = g[h]
        }
      }
      d.dispatchEvent(f)
    }
  })
})()
