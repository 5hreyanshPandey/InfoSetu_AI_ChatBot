! function(e, t, n, i) {
    "use strict";
    var o = n("html"),
        a = n(e),
        r = n(t),
        s = n.fancybox = function() {
            s.open.apply(this, arguments)
        },
        l = navigator.userAgent.match(/msie/i),
        c = null,
        d = t.createTouch !== i,
        p = function(e) {
            return e && e.hasOwnProperty && e instanceof n
        },
        h = function(e) {
            return e && "string" === n.type(e)
        },
        f = function(e) {
            return h(e) && e.indexOf("%") > 0
        },
        u = function(e) {
            return e && !(e.style.overflow && "hidden" === e.style.overflow) && (e.clientWidth && e.scrollWidth > e.clientWidth || e.clientHeight && e.scrollHeight > e.clientHeight)
        },
        g = function(e, t) {
            var n = parseInt(e, 10) || 0;
            return t && f(e) && (n = s.getViewport()[t] / 100 * n), Math.ceil(n)
        },
        m = function(e, t) {
            return g(e, t) + "px"
        };
    n.extend(s, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !d,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3e3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                wmode: "transparent",
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    //  13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [27],
                play: [32],
                toggle: [70]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (l ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'

            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: n.noop,
            beforeLoad: n.noop,
            afterLoad: n.noop,
            beforeShow: n.noop,
            afterShow: n.noop,
            beforeChange: n.noop,
            beforeClose: n.noop,
            afterClose: n.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(e, t) {
            return e && (n.isPlainObject(t) || (t = {}), !1 !== s.close(!0)) ? (n.isArray(e) || (e = p(e) ? n(e).get() : [e]), n.each(e, function(o, a) {
                var r, l, c, d, f, u, g, m = {};
                "object" === n.type(a) && (a.nodeType && (a = n(a)), p(a) ? (m = {
                    href: a.data("fancybox-href") || a.attr("href"),
                    title: a.data("fancybox-title") || a.attr("title"),
                    isDom: !0,
                    element: a
                }, n.metadata && n.extend(!0, m, a.metadata())) : m = a), r = t.href || m.href || (h(a) ? a : null), l = t.title !== i ? t.title : m.title || "", c = t.content || m.content, d = c ? "html" : t.type || m.type, !d && m.isDom && (d = a.data("fancybox-type"), d || (f = a.prop("class").match(/fancybox\.(\w+)/), d = f ? f[1] : null)), h(r) && (d || (s.isImage(r) ? d = "image" : s.isSWF(r) ? d = "swf" : "#" === r.charAt(0) ? d = "inline" : h(a) && (d = "html", c = a)), "ajax" === d && (u = r.split(/\s+/, 2), r = u.shift(), g = u.shift())), c || ("inline" === d ? r ? c = n(h(r) ? r.replace(/.*(?=#[^\s]+$)/, "") : r) : m.isDom && (c = a) : "html" === d ? c = r : d || r || !m.isDom || (d = "inline", c = a)), n.extend(m, {
                    href: r,
                    type: d,
                    content: c,
                    title: l,
                    selector: g
                }), e[o] = m
            }), s.opts = n.extend(!0, {}, s.defaults, t), t.keys !== i && (s.opts.keys = t.keys ? n.extend({}, s.defaults.keys, t.keys) : !1), s.group = e, s._start(s.opts.index)) : void 0
        },
        cancel: function() {
            var e = s.coming;
            e && !1 !== s.trigger("onCancel") && (s.hideLoading(), s.ajaxLoad && s.ajaxLoad.abort(), s.ajaxLoad = null, s.imgPreload && (s.imgPreload.onload = s.imgPreload.onerror = null), e.wrap && e.wrap.stop(!0, !0).trigger("onReset").remove(), s.coming = null, s.current || s._afterZoomOut(e))
        },
        close: function(e) {
            s.cancel(), !1 !== s.trigger("beforeClose") && (s.unbindEvents(), s.isActive && (s.isOpen && e !== !0 ? (s.isOpen = s.isOpened = !1, s.isClosing = !0, n(".fancybox-item, .fancybox-nav").remove(), s.wrap.stop(!0, !0).removeClass("fancybox-opened"), s.transitions[s.current.closeMethod]()) : (n(".fancybox-wrap").stop(!0).trigger("onReset").remove(), s._afterZoomOut())))
        },
        play: function(e) {
            var t = function() {
                    clearTimeout(s.player.timer)
                },
                n = function() {
                    t(), s.current && s.player.isActive && (s.player.timer = setTimeout(s.next, s.current.playSpeed))
                },
                i = function() {
                    t(), r.unbind(".player"), s.player.isActive = !1, s.trigger("onPlayEnd")
                },
                o = function() {
                    s.current && (s.current.loop || s.current.index < s.group.length - 1) && (s.player.isActive = !0, r.bind({
                        "onCancel.player beforeClose.player": i,
                        "onUpdate.player": n,
                        "beforeLoad.player": t
                    }), n(), s.trigger("onPlayStart"))
                };
            e === !0 || !s.player.isActive && e !== !1 ? o() : i()
        },
        next: function(e) {
            var t = s.current;
            t && (h(e) || (e = t.direction.next), s.jumpto(t.index + 1, e, "next"))
        },
        prev: function(e) {
            var t = s.current;
            t && (h(e) || (e = t.direction.prev), s.jumpto(t.index - 1, e, "prev"))
        },
        jumpto: function(e, t, n) {
            var o = s.current;
            o && (e = g(e), s.direction = t || o.direction[e >= o.index ? "next" : "prev"], s.router = n || "jumpto", o.loop && (0 > e && (e = o.group.length + e % o.group.length), e %= o.group.length), o.group[e] !== i && (s.cancel(), s._start(e)))
        },
        reposition: function(e, t) {
            var i, o = s.current,
                a = o ? o.wrap : null;
            a && (i = s._getPosition(t), e && "scroll" === e.type ? (delete i.position, a.stop(!0, !0).animate(i, 200)) : (a.css(i), o.pos = n.extend({}, o.dim, i)))
        },
        update: function(e) {
            var t = e && e.type,
                n = !t || "orientationchange" === t;
            n && (clearTimeout(c), c = null), s.isOpen && !c && (c = setTimeout(function() {
                var i = s.current;
                i && !s.isClosing && (s.wrap.removeClass("fancybox-tmp"), (n || "load" === t || "resize" === t && i.autoResize) && s._setDimension(), "scroll" === t && i.canShrink || s.reposition(e), s.trigger("onUpdate"), c = null)
            }, n && !d ? 0 : 300))
        },
        toggle: function(e) {
            s.isOpen && (s.current.fitToView = "boolean" === n.type(e) ? e : !s.current.fitToView, d && (s.wrap.removeAttr("style").addClass("fancybox-tmp"), s.trigger("onUpdate")), s.update())
        },
        hideLoading: function() {
            r.unbind(".loading"), n("#fancybox-loading").remove()
        },
        showLoading: function() {
            var e, t;
            s.hideLoading(), e = n('<div id="fancybox-loading"><div></div></div>').click(s.cancel).appendTo("body"), r.bind("keydown.loading", function(e) {
                27 === (e.which || e.keyCode) && (e.preventDefault(), s.cancel())
            }), s.defaults.fixed || (t = s.getViewport(), e.css({
                position: "absolute",
                top: .5 * t.h + t.y,
                left: .5 * t.w + t.x
            }))
        },
        getViewport: function() {
            var t = s.current && s.current.locked || !1,
                n = {
                    x: a.scrollLeft(),
                    y: a.scrollTop()
                };
            return t ? (n.w = t[0].clientWidth, n.h = t[0].clientHeight) : (n.w = d && e.innerWidth ? e.innerWidth : a.width(), n.h = d && e.innerHeight ? e.innerHeight : a.height()), n
        },
        unbindEvents: function() {
            s.wrap && p(s.wrap) && s.wrap.unbind(".fb"), r.unbind(".fb"), a.unbind(".fb")
        },
        bindEvents: function() {
            var e, t = s.current;
            t && (a.bind("orientationchange.fb" + (d ? "" : " resize.fb") + (t.autoCenter && !t.locked ? " scroll.fb" : ""), s.update), e = t.keys, e && r.bind("keydown.fb", function(o) {
                var a = o.which || o.keyCode,
                    r = o.target || o.srcElement;
                return 27 === a && s.coming ? !1 : void(o.ctrlKey || o.altKey || o.shiftKey || o.metaKey || r && (r.type || n(r).is("[contenteditable]")) || n.each(e, function(e, r) {
                    return t.group.length > 1 && r[a] !== i ? (s[e](r[a]), o.preventDefault(), !1) : n.inArray(a, r) > -1 ? (s[e](), o.preventDefault(), !1) : void 0
                }))
            }), n.fn.mousewheel && t.mouseWheel && s.wrap.bind("mousewheel.fb", function(e, i, o, a) {
                for (var r = e.target || null, l = n(r), c = !1; l.length && !(c || l.is(".fancybox-skin") || l.is(".fancybox-wrap"));) c = u(l[0]), l = n(l).parent();
                0 === i || c || s.group.length > 1 && !t.canShrink && (a > 0 || o > 0 ? s.prev(a > 0 ? "down" : "left") : (0 > a || 0 > o) && s.next(0 > a ? "up" : "right"), e.preventDefault())
            }))
        },
        trigger: function(e, t) {
            var i, o = t || s.coming || s.current;
            if (o) {
                if (n.isFunction(o[e]) && (i = o[e].apply(o, Array.prototype.slice.call(arguments, 1))), i === !1) return !1;
                o.helpers && n.each(o.helpers, function(t, i) {
                    i && s.helpers[t] && n.isFunction(s.helpers[t][e]) && s.helpers[t][e](n.extend(!0, {}, s.helpers[t].defaults, i), o)
                }), r.trigger(e)
            }
        },
        isImage: function(e) {
            return h(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
        },
        isSWF: function(e) {
            return h(e) && e.match(/\.(swf)((\?|#).*)?$/i)
        },
        _start: function(e) {
            var t, i, o, a, r, l = {};
            if (e = g(e), t = s.group[e] || null, !t) return !1;
            if (l = n.extend(!0, {}, s.opts, t), a = l.margin, r = l.padding, "number" === n.type(a) && (l.margin = [a, a, a, a]), "number" === n.type(r) && (l.padding = [r, r, r, r]), l.modal && n.extend(!0, l, {
                    closeBtn: !1,
                    closeClick: !1,
                    nextClick: !1,
                    arrows: !1,
                    mouseWheel: !1,
                    keys: null,
                    helpers: {
                        overlay: {
                            closeClick: !1
                        }
                    }
                }), l.autoSize && (l.autoWidth = l.autoHeight = !0), "auto" === l.width && (l.autoWidth = !0), "auto" === l.height && (l.autoHeight = !0), l.group = s.group, l.index = e, s.coming = l, !1 === s.trigger("beforeLoad")) return void(s.coming = null);
            if (o = l.type, i = l.href, !o) return s.coming = null, s.current && s.router && "jumpto" !== s.router ? (s.current.index = e, s[s.router](s.direction)) : !1;
            if (s.isActive = !0, ("image" === o || "swf" === o) && (l.autoHeight = l.autoWidth = !1, l.scrolling = "visible"), "image" === o && (l.aspectRatio = !0), "iframe" === o && d && (l.scrolling = "scroll"), l.wrap = n(l.tpl.wrap).addClass("fancybox-" + (d ? "mobile" : "desktop") + " fancybox-type-" + o + " fancybox-tmp " + l.wrapCSS).appendTo(l.parent || "body"), n.extend(l, {
                    skin: n(".fancybox-skin", l.wrap),
                    outer: n(".fancybox-outer", l.wrap),
                    inner: n(".fancybox-inner", l.wrap)
                }), n.each(["Top", "Right", "Bottom", "Left"], function(e, t) {
                    l.skin.css("padding" + t, m(l.padding[e]))
                }), s.trigger("onReady"), "inline" === o || "html" === o) {
                if (!l.content || !l.content.length) return s._error("content")
            } else if (!i) return s._error("href");
            "image" === o ? s._loadImage() : "ajax" === o ? s._loadAjax() : "iframe" === o ? s._loadIframe() : s._afterLoad()
        },
        _error: function(e) {
            n.extend(s.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: e,
                content: s.coming.tpl.error
            }), s._afterLoad()
        },
        _loadImage: function() {
            var e = s.imgPreload = new Image;
            e.onload = function() {
                this.onload = this.onerror = null, s.coming.width = this.width / s.opts.pixelRatio, s.coming.height = this.height / s.opts.pixelRatio, s._afterLoad()
            }, e.onerror = function() {
                this.onload = this.onerror = null, s._error("image")
            }, e.src = s.coming.href, e.complete !== !0 && s.showLoading()
        },
        _loadAjax: function() {
            var e = s.coming;
            s.showLoading(), s.ajaxLoad = n.ajax(n.extend({}, e.ajax, {
                url: e.href,
                error: function(e, t) {
                    s.coming && "abort" !== t ? s._error("ajax", e) : s.hideLoading()
                },
                success: function(t, n) {
                    "success" === n && (e.content = t, s._afterLoad())
                }
            }))
        },
        _loadIframe: function() {
            var e = s.coming,
                t = n(e.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", d ? "auto" : e.iframe.scrolling).attr("src", e.href);
            n(e.wrap).bind("onReset", function() {
                try {
                    n(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                } catch (e) {}
            }), e.iframe.preload && (s.showLoading(), t.one("load", function() {
                n(this).data("ready", 1), d || n(this).bind("load.fb", s.update), n(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), s._afterLoad()
            })), e.content = t.appendTo(e.inner), e.iframe.preload || s._afterLoad()
        },
        _preloadImages: function() {
            var e, t, n = s.group,
                i = s.current,
                o = n.length,
                a = i.preload ? Math.min(i.preload, o - 1) : 0;
            for (t = 1; a >= t; t += 1) e = n[(i.index + t) % o], "image" === e.type && e.href && ((new Image).src = e.href)
        },
        _afterLoad: function() {
            var e, t, i, o, a, r, l = s.coming,
                c = s.current,
                d = "fancybox-placeholder";
            if (s.hideLoading(), l && s.isActive !== !1) {
                if (!1 === s.trigger("afterLoad", l, c)) return l.wrap.stop(!0).trigger("onReset").remove(), void(s.coming = null);
                switch (c && (s.trigger("beforeChange", c), c.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()), s.unbindEvents(), e = l, t = l.content, i = l.type, o = l.scrolling, n.extend(s, {
                    wrap: e.wrap,
                    skin: e.skin,
                    outer: e.outer,
                    inner: e.inner,
                    current: e,
                    previous: c
                }), a = e.href, i) {
                    case "inline":
                    case "ajax":
                    case "html":
                        e.selector ? t = n("<div>").html(t).find(e.selector) : p(t) && (t.data(d) || t.data(d, n('<div class="' + d + '"></div>').insertAfter(t).hide()), t = t.show().detach(), e.wrap.bind("onReset", function() {
                            n(this).find(t).length && t.hide().replaceAll(t.data(d)).data(d, !1)
                        }));
                        break;
                    case "image":
                        t = e.tpl.image.replace("{href}", a);
                        break;
                    case "swf":
                        t = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + a + '"></param>', r = "", n.each(e.swf, function(e, n) {
                            t += '<param name="' + e + '" value="' + n + '"></param>', r += " " + e + '="' + n + '"'
                        }), t += '<embed src="' + a + '" type="application/x-shockwave-flash" width="100%" height="100%"' + r + "></embed></object>"
                }
                p(t) && t.parent().is(e.inner) || e.inner.append(t), s.trigger("beforeShow"), e.inner.css("overflow", "yes" === o ? "scroll" : "no" === o ? "hidden" : o), s._setDimension(), s.reposition(), s.isOpen = !1, s.coming = null, s.bindEvents(), s.isOpened ? c.prevMethod && s.transitions[c.prevMethod]() : n(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove(), s.transitions[s.isOpened ? e.nextMethod : e.openMethod](), s._preloadImages()
            }
        },
        _setDimension: function() {
            var e, t, i, o, a, r, l, c, d, p, h, u, y, x, v, w = s.getViewport(),
                b = 0,
                k = !1,
                C = !1,
                O = s.wrap,
                W = s.skin,
                _ = s.inner,
                S = s.current,
                T = S.width,
                L = S.height,
                E = S.minWidth,
                R = S.minHeight,
                j = S.maxWidth,
                P = S.maxHeight,
                H = S.scrolling,
                M = S.scrollOutside ? S.scrollbarWidth : 0,
                A = S.margin,
                I = g(A[1] + A[3]),
                D = g(A[0] + A[2]);
            if (O.add(W).add(_).width("auto").height("auto").removeClass("fancybox-tmp"), e = g(W.outerWidth(!0) - W.width()), t = g(W.outerHeight(!0) - W.height()), i = I + e, o = D + t, a = f(T) ? (w.w - i) * g(T) / 100 : T, r = f(L) ? (w.h - o) * g(L) / 100 : L, "iframe" === S.type) {
                if (x = S.content, S.autoHeight && 1 === x.data("ready")) try {
                    x[0].contentWindow.document.location && (_.width(a).height(9999), v = x.contents().find("body"), M && v.css("overflow-x", "hidden"), r = v.outerHeight(!0))
                } catch (z) {}
            } else(S.autoWidth || S.autoHeight) && (_.addClass("fancybox-tmp"), S.autoWidth || _.width(a), S.autoHeight || _.height(r), S.autoWidth && (a = _.width()), S.autoHeight && (r = _.height()), _.removeClass("fancybox-tmp"));
            if (T = g(a), L = g(r), d = a / r, E = g(f(E) ? g(E, "w") - i : E), j = g(f(j) ? g(j, "w") - i : j), R = g(f(R) ? g(R, "h") - o : R), P = g(f(P) ? g(P, "h") - o : P), l = j, c = P, S.fitToView && (j = Math.min(w.w - i, j), P = Math.min(w.h - o, P)), u = w.w - I, y = w.h - D, S.aspectRatio ? (T > j && (T = j, L = g(T / d)), L > P && (L = P, T = g(L * d)), E > T && (T = E, L = g(T / d)), R > L && (L = R, T = g(L * d))) : (T = Math.max(E, Math.min(T, j)), S.autoHeight && "iframe" !== S.type && (_.width(T), L = _.height()), L = Math.max(R, Math.min(L, P))), S.fitToView)
                if (_.width(T).height(L), O.width(T + e), p = O.width(), h = O.height(), S.aspectRatio)
                    for (;
                        (p > u || h > y) && T > E && L > R && !(b++ > 19);) L = Math.max(R, Math.min(P, L - 10)), T = g(L * d), E > T && (T = E, L = g(T / d)), T > j && (T = j, L = g(T / d)), _.width(T).height(L), O.width(T + e), p = O.width(), h = O.height();
                else T = Math.max(E, Math.min(T, T - (p - u))), L = Math.max(R, Math.min(L, L - (h - y)));
            M && "auto" === H && r > L && u > T + e + M && (T += M), _.width(T).height(L), O.width(T + e), p = O.width(), h = O.height(), k = (p > u || h > y) && T > E && L > R, C = S.aspectRatio ? l > T && c > L && a > T && r > L : (l > T || c > L) && (a > T || r > L), n.extend(S, {
                dim: {
                    width: m(p),
                    height: m(h)
                },
                origWidth: a,
                origHeight: r,
                canShrink: k,
                canExpand: C,
                wPadding: e,
                hPadding: t,
                wrapSpace: h - W.outerHeight(!0),
                skinSpace: W.height() - L
            }), !x && S.autoHeight && L > R && P > L && !C && _.height("auto")
        },
        _getPosition: function(e) {
            var t = s.current,
                n = s.getViewport(),
                i = t.margin,
                o = s.wrap.width() + i[1] + i[3],
                a = s.wrap.height() + i[0] + i[2],
                r = {
                    position: "absolute",
                    top: i[0],
                    left: i[3]
                };
            return t.autoCenter && t.fixed && !e && a <= n.h && o <= n.w ? r.position = "fixed" : t.locked || (r.top += n.y, r.left += n.x), r.top = m(Math.max(r.top, r.top + (n.h - a) * t.topRatio)), r.left = m(Math.max(r.left, r.left + (n.w - o) * t.leftRatio)), r
        },
        _afterZoomIn: function() {
            var e = s.current;
            e && (s.isOpen = s.isOpened = !0, s.wrap.css("overflow", "visible").addClass("fancybox-opened"), s.update(), (e.closeClick || e.nextClick && s.group.length > 1) && s.inner.css("cursor", "pointer").bind("click.fb", function(t) {
                n(t.target).is("a") || n(t.target).parent().is("a") || (t.preventDefault(), s[e.closeClick ? "close" : "next"]())
            }), e.closeBtn && n(e.tpl.closeBtn).appendTo(s.skin).bind("click.fb", function(e) {
                e.preventDefault(), s.close()
            }), e.arrows && s.group.length > 1 && ((e.loop || e.index > 0) && n(e.tpl.prev).appendTo(s.outer).bind("click.fb", s.prev), (e.loop || e.index < s.group.length - 1) && n(e.tpl.next).appendTo(s.outer).bind("click.fb", s.next)), s.trigger("afterShow"), e.loop || e.index !== e.group.length - 1 ? s.opts.autoPlay && !s.player.isActive && (s.opts.autoPlay = !1, s.play()) : s.play(!1))
        },
        _afterZoomOut: function(e) {
            e = e || s.current, n(".fancybox-wrap").trigger("onReset").remove(), n.extend(s, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            }), s.trigger("afterClose", e)
        }
    }), s.transitions = {
        getOrigPosition: function() {
            var e = s.current,
                t = e.element,
                n = e.orig,
                i = {},
                o = 50,
                a = 50,
                r = e.hPadding,
                l = e.wPadding,
                c = s.getViewport();
            return !n && e.isDom && t.is(":visible") && (n = t.find("img:first"), n.length || (n = t)), p(n) ? (i = n.offset(), n.is("img") && (o = n.outerWidth(), a = n.outerHeight())) : (i.top = c.y + (c.h - a) * e.topRatio, i.left = c.x + (c.w - o) * e.leftRatio), ("fixed" === s.wrap.css("position") || e.locked) && (i.top -= c.y, i.left -= c.x), i = {
                top: m(i.top - r * e.topRatio),
                left: m(i.left - l * e.leftRatio),
                width: m(o + l),
                height: m(a + r)
            }
        },
        step: function(e, t) {
            var n, i, o, a = t.prop,
                r = s.current,
                l = r.wrapSpace,
                c = r.skinSpace;
            ("width" === a || "height" === a) && (n = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start), s.isClosing && (n = 1 - n), i = "width" === a ? r.wPadding : r.hPadding, o = e - i, s.skin[a](g("width" === a ? o : o - l * n)), s.inner[a](g("width" === a ? o : o - l * n - c * n)))
        },
        zoomIn: function() {
            var e = s.current,
                t = e.pos,
                i = e.openEffect,
                o = "elastic" === i,
                a = n.extend({
                    opacity: 1
                }, t);
            delete a.position, o ? (t = this.getOrigPosition(), e.openOpacity && (t.opacity = .1)) : "fade" === i && (t.opacity = .1), s.wrap.css(t).animate(a, {
                duration: "none" === i ? 0 : e.openSpeed,
                easing: e.openEasing,
                step: o ? this.step : null,
                complete: s._afterZoomIn
            })
        },
        zoomOut: function() {
            var e = s.current,
                t = e.closeEffect,
                n = "elastic" === t,
                i = {
                    opacity: .1
                };
            n && (i = this.getOrigPosition(), e.closeOpacity && (i.opacity = .1)), s.wrap.animate(i, {
                duration: "none" === t ? 0 : e.closeSpeed,
                easing: e.closeEasing,
                step: n ? this.step : null,
                complete: s._afterZoomOut
            })
        },
        changeIn: function() {
            var e, t = s.current,
                n = t.nextEffect,
                i = t.pos,
                o = {
                    opacity: 1
                },
                a = s.direction,
                r = 200;
            i.opacity = .1, "elastic" === n && (e = "down" === a || "up" === a ? "top" : "left", "down" === a || "right" === a ? (i[e] = m(g(i[e]) - r), o[e] = "+=" + r + "px") : (i[e] = m(g(i[e]) + r), o[e] = "-=" + r + "px")), "none" === n ? s._afterZoomIn() : s.wrap.css(i).animate(o, {
                duration: t.nextSpeed,
                easing: t.nextEasing,
                complete: s._afterZoomIn
            })
        },
        changeOut: function() {
            var e = s.previous,
                t = e.prevEffect,
                i = {
                    opacity: .1
                },
                o = s.direction,
                a = 200;
            "elastic" === t && (i["down" === o || "up" === o ? "top" : "left"] = ("up" === o || "left" === o ? "-" : "+") + "=" + a + "px"), e.wrap.animate(i, {
                duration: "none" === t ? 0 : e.prevSpeed,
                easing: e.prevEasing,
                complete: function() {
                    n(this).trigger("onReset").remove()
                }
            })
        }
    }, s.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !d,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        el: n("html"),
        create: function(e) {
            e = n.extend({}, this.defaults, e), this.overlay && this.close(), this.overlay = n('<div class="fancybox-overlay"></div>').appendTo(s.coming ? s.coming.parent : e.parent), this.fixed = !1, e.fixed && s.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        },
        open: function(e) {
            var t = this;
            e = n.extend({}, this.defaults, e), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(e), this.fixed || (a.bind("resize.overlay", n.proxy(this.update, this)), this.update()), e.closeClick && this.overlay.bind("click.overlay", function(e) {
                return n(e.target).hasClass("fancybox-overlay") ? (s.isActive ? s.close() : t.close(), !1) : void 0
            }), this.overlay.css(e.css).show()
        },
        close: function() {
            var e, t;
            a.unbind("resize.overlay"), this.el.hasClass("fancybox-lock") && (n(".fancybox-margin").removeClass("fancybox-margin"), e = a.scrollTop(), t = a.scrollLeft(), this.el.removeClass("fancybox-lock"), a.scrollTop(e).scrollLeft(t)), n(".fancybox-overlay").remove().hide(), n.extend(this, {
                overlay: null,
                fixed: !1
            })
        },
        update: function() {
            var e, n = "100%";
            this.overlay.width(n).height("100%"), l ? (e = Math.max(t.documentElement.offsetWidth, t.body.offsetWidth), r.width() > e && (n = r.width())) : r.width() > a.width() && (n = r.width()), this.overlay.width(n).height(r.height())
        },
        onReady: function(e, t) {
            var i = this.overlay;
            n(".fancybox-overlay").stop(!0, !0), i || this.create(e), e.locked && this.fixed && t.fixed && (i || (this.margin = r.height() > a.height() ? n("html").css("margin-right").replace("px", "") : !1), t.locked = this.overlay.append(t.wrap), t.fixed = !1), e.showEarly === !0 && this.beforeShow.apply(this, arguments)
        },
        beforeShow: function(e, t) {
            var i, o;
            t.locked && (this.margin !== !1 && (n("*").filter(function() {
                return "fixed" === n(this).css("position") && !n(this).hasClass("fancybox-overlay") && !n(this).hasClass("fancybox-wrap")
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), i = a.scrollTop(), o = a.scrollLeft(), this.el.addClass("fancybox-lock"), a.scrollTop(i).scrollLeft(o)), this.open(e)
        },
        onUpdate: function() {
            this.fixed || this.update()
        },
        afterClose: function(e) {
            this.overlay && !s.coming && this.overlay.fadeOut(e.speedOut, n.proxy(this.close, this))
        }
    }, s.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(e) {
            var t, i, o = s.current,
                a = o.title,
                r = e.type;
            if (n.isFunction(a) && (a = a.call(o.element, o)), h(a) && "" !== n.trim(a)) {
                switch (t = n('<div class="fancybox-title fancybox-title-' + r + '-wrap">' + a + "</div>"), r) {
                    case "inside":
                        i = s.skin;
                        break;
                    case "outside":
                        i = s.wrap;
                        break;
                    case "over":
                        i = s.inner;
                        break;
                    default:
                        i = s.skin, t.appendTo("body"), l && t.width(t.width()), t.wrapInner('<span class="child"></span>'), s.current.margin[2] += Math.abs(g(t.css("margin-bottom")))
                }
                t["top" === e.position ? "prependTo" : "appendTo"](i)
            }
        }
    }, n.fn.fancybox = function(e) {
        var t, i = n(this),
            o = this.selector || "",
            a = function(a) {
                var r, l, c = n(this).blur(),
                    d = t;
                a.ctrlKey || a.altKey || a.shiftKey || a.metaKey || c.is(".fancybox-wrap") || (r = e.groupAttr || "data-fancybox-group", l = c.attr(r), l || (r = "rel", l = c.get(0)[r]), l && "" !== l && "nofollow" !== l && (c = o.length ? n(o) : i, c = c.filter("[" + r + '="' + l + '"]'), d = c.index(this)), e.index = d, s.open(c, e) !== !1 && a.preventDefault())
            };
        return e = e || {}, t = e.index || 0, o && e.live !== !1 ? r.undelegate(o, "click.fb-start").delegate(o + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", a) : i.unbind("click.fb-start").bind("click.fb-start", a), this.filter("[data-fancybox-start=1]").trigger("click"), this
    }, r.ready(function() {
        var t, a;
        n.scrollbarWidth === i && (n.scrollbarWidth = function() {
            var e = n('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),
                t = e.children(),
                i = t.innerWidth() - t.height(99).innerWidth();
            return e.remove(), i
        }), n.support.fixedPosition === i && (n.support.fixedPosition = function() {
            var e = n('<div style="position:fixed;top:20px;"></div>').appendTo("body"),
                t = 20 === e[0].offsetTop || 15 === e[0].offsetTop;
            return e.remove(), t
        }()), n.extend(s.defaults, {
            scrollbarWidth: n.scrollbarWidth(),
            fixed: n.support.fixedPosition,
            parent: n("body")
        }), t = n(e).width(), o.addClass("fancybox-lock-test"), a = n(e).width(), o.removeClass("fancybox-lock-test"), n("<style type='text/css'>.fancybox-margin{margin-right:" + (a - t) + "px;}</style>").appendTo("head")
    })
}(window, document, jQuery);