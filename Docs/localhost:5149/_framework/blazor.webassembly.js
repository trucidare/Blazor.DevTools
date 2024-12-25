!function() {
    "use strict";
    var e;
    let t;
    var n, r;
    !function(e) {
        const t = []
          , n = "__jsObjectId"
          , r = "__dotNetObject"
          , o = "__byte[]"
          , i = "__dotNetStream"
          , s = "__jsStreamReferenceLength";
        let a, c;
        class l {
            constructor(e) {
                this._jsObject = e,
                this._cachedFunctions = new Map
            }
            findFunction(e) {
                const t = this._cachedFunctions.get(e);
                if (t)
                    return t;
                let n, r = this._jsObject;
                if (e.split(".").forEach((t => {
                    if (!(t in r))
                        throw new Error(`Could not find '${e}' ('${t}' was undefined).`);
                    n = r,
                    r = r[t]
                }
                )),
                r instanceof Function)
                    return r = r.bind(n),
                    this._cachedFunctions.set(e, r),
                    r;
                throw new Error(`The value '${e}' is not a function.`)
            }
            getWrappedObject() {
                return this._jsObject
            }
        }
        const u = 0
          , d = {
            [u]: new l(window)
        };
        d[0]._cachedFunctions.set("import", (e => ("string" == typeof e && e.startsWith("./") && (e = new URL(e.substr(2),document.baseURI).toString()),
        import(e))));
        let f, m = 1;
        function h(e) {
            t.push(e)
        }
        function p(e) {
            if (e && "object" == typeof e) {
                d[m] = new l(e);
                const t = {
                    [n]: m
                };
                return m++,
                t
            }
            throw new Error(`Cannot create a JSObjectReference from the value '${e}'.`)
        }
        function g(e) {
            let t = -1;
            if (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
            e instanceof Blob)
                t = e.size;
            else {
                if (!(e.buffer instanceof ArrayBuffer))
                    throw new Error("Supplied value is not a typed array or blob.");
                if (void 0 === e.byteLength)
                    throw new Error(`Cannot create a JSStreamReference from the value '${e}' as it doesn't have a byteLength.`);
                t = e.byteLength
            }
            const r = {
                [s]: t
            };
            try {
                const t = p(e);
                r[n] = t[n]
            } catch (t) {
                throw new Error(`Cannot create a JSStreamReference from the value '${e}'.`)
            }
            return r
        }
        function b(e, n) {
            c = e;
            const r = n ? JSON.parse(n, ( (e, n) => t.reduce(( (t, n) => n(e, t)), n))) : null;
            return c = void 0,
            r
        }
        function y() {
            if (void 0 === a)
                throw new Error("No call dispatcher has been set.");
            if (null === a)
                throw new Error("There are multiple .NET runtimes present, so a default dispatcher could not be resolved. Use DotNetObject to invoke .NET instance methods.");
            return a
        }
        e.attachDispatcher = function(e) {
            const t = new v(e);
            return void 0 === a ? a = t : a && (a = null),
            t
        }
        ,
        e.attachReviver = h,
        e.invokeMethod = function(e, t, ...n) {
            return y().invokeDotNetStaticMethod(e, t, ...n)
        }
        ,
        e.invokeMethodAsync = function(e, t, ...n) {
            return y().invokeDotNetStaticMethodAsync(e, t, ...n)
        }
        ,
        e.createJSObjectReference = p,
        e.createJSStreamReference = g,
        e.disposeJSObjectReference = function(e) {
            const t = e && e[n];
            "number" == typeof t && S(t)
        }
        ,
        function(e) {
            e[e.Default = 0] = "Default",
            e[e.JSObjectReference = 1] = "JSObjectReference",
            e[e.JSStreamReference = 2] = "JSStreamReference",
            e[e.JSVoidResult = 3] = "JSVoidResult"
        }(f = e.JSCallResultType || (e.JSCallResultType = {}));
        class v {
            constructor(e) {
                this._dotNetCallDispatcher = e,
                this._byteArraysToBeRevived = new Map,
                this._pendingDotNetToJSStreams = new Map,
                this._pendingAsyncCalls = {},
                this._nextAsyncCallId = 1
            }
            getDotNetCallDispatcher() {
                return this._dotNetCallDispatcher
            }
            invokeJSFromDotNet(e, t, n, r) {
                const o = b(this, t)
                  , i = N(E(e, r)(...o || []), n);
                return null == i ? null : k(this, i)
            }
            beginInvokeJSFromDotNet(e, t, n, r, o) {
                const i = new Promise((e => {
                    const r = b(this, n);
                    e(E(t, o)(...r || []))
                }
                ));
                e && i.then((t => k(this, [e, !0, N(t, r)]))).then((t => this._dotNetCallDispatcher.endInvokeJSFromDotNet(e, !0, t)), (t => this._dotNetCallDispatcher.endInvokeJSFromDotNet(e, !1, JSON.stringify([e, !1, w(t)]))))
            }
            endInvokeDotNetFromJS(e, t, n) {
                const r = t ? b(this, n) : new Error(n);
                this.completePendingCall(parseInt(e, 10), t, r)
            }
            invokeDotNetStaticMethod(e, t, ...n) {
                return this.invokeDotNetMethod(e, t, null, n)
            }
            invokeDotNetStaticMethodAsync(e, t, ...n) {
                return this.invokeDotNetMethodAsync(e, t, null, n)
            }
            invokeDotNetMethod(e, t, n, r) {
                if (this._dotNetCallDispatcher.invokeDotNetFromJS) {
                    const o = k(this, r)
                      , i = this._dotNetCallDispatcher.invokeDotNetFromJS(e, t, n, o);
                    return i ? b(this, i) : null
                }
                throw new Error("The current dispatcher does not support synchronous calls from JS to .NET. Use invokeDotNetMethodAsync instead.")
            }
            invokeDotNetMethodAsync(e, t, n, r) {
                if (e && n)
                    throw new Error(`For instance method calls, assemblyName should be null. Received '${e}'.`);
                const o = this._nextAsyncCallId++
                  , i = new Promise(( (e, t) => {
                    this._pendingAsyncCalls[o] = {
                        resolve: e,
                        reject: t
                    }
                }
                ));
                try {
                    const i = k(this, r);
                    this._dotNetCallDispatcher.beginInvokeDotNetFromJS(o, e, t, n, i)
                } catch (e) {
                    this.completePendingCall(o, !1, e)
                }
                return i
            }
            receiveByteArray(e, t) {
                this._byteArraysToBeRevived.set(e, t)
            }
            processByteArray(e) {
                const t = this._byteArraysToBeRevived.get(e);
                return t ? (this._byteArraysToBeRevived.delete(e),
                t) : null
            }
            supplyDotNetStream(e, t) {
                if (this._pendingDotNetToJSStreams.has(e)) {
                    const n = this._pendingDotNetToJSStreams.get(e);
                    this._pendingDotNetToJSStreams.delete(e),
                    n.resolve(t)
                } else {
                    const n = new I;
                    n.resolve(t),
                    this._pendingDotNetToJSStreams.set(e, n)
                }
            }
            getDotNetStreamPromise(e) {
                let t;
                if (this._pendingDotNetToJSStreams.has(e))
                    t = this._pendingDotNetToJSStreams.get(e).streamPromise,
                    this._pendingDotNetToJSStreams.delete(e);
                else {
                    const n = new I;
                    this._pendingDotNetToJSStreams.set(e, n),
                    t = n.streamPromise
                }
                return t
            }
            completePendingCall(e, t, n) {
                if (!this._pendingAsyncCalls.hasOwnProperty(e))
                    throw new Error(`There is no pending async call with ID ${e}.`);
                const r = this._pendingAsyncCalls[e];
                delete this._pendingAsyncCalls[e],
                t ? r.resolve(n) : r.reject(n)
            }
        }
        function w(e) {
            return e instanceof Error ? `${e.message}\n${e.stack}` : e ? e.toString() : "null"
        }
        function E(e, t) {
            const n = d[t];
            if (n)
                return n.findFunction(e);
            throw new Error(`JS object instance with ID ${t} does not exist (has it been disposed?).`)
        }
        function S(e) {
            delete d[e]
        }
        e.findJSFunction = E,
        e.disposeJSObjectReferenceById = S;
        class C {
            constructor(e, t) {
                this._id = e,
                this._callDispatcher = t
            }
            invokeMethod(e, ...t) {
                return this._callDispatcher.invokeDotNetMethod(null, e, this._id, t)
            }
            invokeMethodAsync(e, ...t) {
                return this._callDispatcher.invokeDotNetMethodAsync(null, e, this._id, t)
            }
            dispose() {
                this._callDispatcher.invokeDotNetMethodAsync(null, "__Dispose", this._id, null).catch((e => console.error(e)))
            }
            serializeAsArg() {
                return {
                    [r]: this._id
                }
            }
        }
        e.DotNetObject = C,
        h((function(e, t) {
            if (t && "object" == typeof t) {
                if (t.hasOwnProperty(r))
                    return new C(t[r],c);
                if (t.hasOwnProperty(n)) {
                    const e = t[n]
                      , r = d[e];
                    if (r)
                        return r.getWrappedObject();
                    throw new Error(`JS object instance with Id '${e}' does not exist. It may have been disposed.`)
                }
                if (t.hasOwnProperty(o)) {
                    const e = t[o]
                      , n = c.processByteArray(e);
                    if (void 0 === n)
                        throw new Error(`Byte array index '${e}' does not exist.`);
                    return n
                }
                if (t.hasOwnProperty(i)) {
                    const e = t[i]
                      , n = c.getDotNetStreamPromise(e);
                    return new A(n)
                }
            }
            return t
        }
        ));
        class A {
            constructor(e) {
                this._streamPromise = e
            }
            stream() {
                return this._streamPromise
            }
            async arrayBuffer() {
                return new Response(await this.stream()).arrayBuffer()
            }
        }
        class I {
            constructor() {
                this.streamPromise = new Promise(( (e, t) => {
                    this.resolve = e,
                    this.reject = t
                }
                ))
            }
        }
        function N(e, t) {
            switch (t) {
            case f.Default:
                return e;
            case f.JSObjectReference:
                return p(e);
            case f.JSStreamReference:
                return g(e);
            case f.JSVoidResult:
                return null;
            default:
                throw new Error(`Invalid JS call result type '${t}'.`)
            }
        }
        let R = 0;
        function k(e, t) {
            R = 0,
            c = e;
            const n = JSON.stringify(t, D);
            return c = void 0,
            n
        }
        function D(e, t) {
            if (t instanceof C)
                return t.serializeAsArg();
            if (t instanceof Uint8Array) {
                c.getDotNetCallDispatcher().sendByteArray(R, t);
                const e = {
                    [o]: R
                };
                return R++,
                e
            }
            return t
        }
    }(e || (e = {})),
    function(e) {
        e[e.prependFrame = 1] = "prependFrame",
        e[e.removeFrame = 2] = "removeFrame",
        e[e.setAttribute = 3] = "setAttribute",
        e[e.removeAttribute = 4] = "removeAttribute",
        e[e.updateText = 5] = "updateText",
        e[e.stepIn = 6] = "stepIn",
        e[e.stepOut = 7] = "stepOut",
        e[e.updateMarkup = 8] = "updateMarkup",
        e[e.permutationListEntry = 9] = "permutationListEntry",
        e[e.permutationListEnd = 10] = "permutationListEnd"
    }(n || (n = {})),
    function(e) {
        e[e.element = 1] = "element",
        e[e.text = 2] = "text",
        e[e.attribute = 3] = "attribute",
        e[e.component = 4] = "component",
        e[e.region = 5] = "region",
        e[e.elementReferenceCapture = 6] = "elementReferenceCapture",
        e[e.markup = 8] = "markup",
        e[e.namedEvent = 10] = "namedEvent"
    }(r || (r = {}));
    class o {
        constructor(e, t) {
            this.componentId = e,
            this.fieldValue = t
        }
        static fromEvent(e, t) {
            const n = t.target;
            if (n instanceof Element) {
                const t = function(e) {
                    return e instanceof HTMLInputElement ? e.type && "checkbox" === e.type.toLowerCase() ? {
                        value: e.checked
                    } : {
                        value: e.value
                    } : e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement ? {
                        value: e.value
                    } : null
                }(n);
                if (t)
                    return new o(e,t.value)
            }
            return null
        }
    }
    const i = new Map
      , s = new Map
      , a = [];
    function c(e) {
        return i.get(e)
    }
    function l(e) {
        const t = i.get(e);
        return t?.browserEventName || e
    }
    function u(e, t) {
        e.forEach((e => i.set(e, t)))
    }
    function d(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
            const r = e[n];
            t.push({
                identifier: r.identifier,
                clientX: r.clientX,
                clientY: r.clientY,
                screenX: r.screenX,
                screenY: r.screenY,
                pageX: r.pageX,
                pageY: r.pageY
            })
        }
        return t
    }
    function f(e) {
        return {
            detail: e.detail,
            screenX: e.screenX,
            screenY: e.screenY,
            clientX: e.clientX,
            clientY: e.clientY,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
            pageX: e.pageX,
            pageY: e.pageY,
            movementX: e.movementX,
            movementY: e.movementY,
            button: e.button,
            buttons: e.buttons,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
            type: e.type
        }
    }
    u(["input", "change"], {
        createEventArgs: function(e) {
            const t = e.target;
            if (function(e) {
                return -1 !== m.indexOf(e.getAttribute("type"))
            }(t)) {
                const e = function(e) {
                    const t = e.value
                      , n = e.type;
                    switch (n) {
                    case "date":
                    case "month":
                    case "week":
                        return t;
                    case "datetime-local":
                        return 16 === t.length ? t + ":00" : t;
                    case "time":
                        return 5 === t.length ? t + ":00" : t
                    }
                    throw new Error(`Invalid element type '${n}'.`)
                }(t);
                return {
                    value: e
                }
            }
            if (function(e) {
                return e instanceof HTMLSelectElement && "select-multiple" === e.type
            }(t)) {
                const e = t;
                return {
                    value: Array.from(e.options).filter((e => e.selected)).map((e => e.value))
                }
            }
            {
                const e = function(e) {
                    return !!e && "INPUT" === e.tagName && "checkbox" === e.getAttribute("type")
                }(t);
                return {
                    value: e ? !!t.checked : t.value
                }
            }
        }
    }),
    u(["copy", "cut", "paste"], {
        createEventArgs: e => ({
            type: e.type
        })
    }),
    u(["drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop"], {
        createEventArgs: e => {
            return {
                ...f(t = e),
                dataTransfer: t.dataTransfer ? {
                    dropEffect: t.dataTransfer.dropEffect,
                    effectAllowed: t.dataTransfer.effectAllowed,
                    files: Array.from(t.dataTransfer.files).map((e => e.name)),
                    items: Array.from(t.dataTransfer.items).map((e => ({
                        kind: e.kind,
                        type: e.type
                    }))),
                    types: t.dataTransfer.types
                } : null
            };
            var t
        }
    }),
    u(["focus", "blur", "focusin", "focusout"], {
        createEventArgs: e => ({
            type: e.type
        })
    }),
    u(["keydown", "keyup", "keypress"], {
        createEventArgs: e => {
            return {
                key: (t = e).key,
                code: t.code,
                location: t.location,
                repeat: t.repeat,
                ctrlKey: t.ctrlKey,
                shiftKey: t.shiftKey,
                altKey: t.altKey,
                metaKey: t.metaKey,
                type: t.type,
                isComposing: t.isComposing
            };
            var t
        }
    }),
    u(["contextmenu", "click", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "mouseleave", "mouseenter", "dblclick"], {
        createEventArgs: e => f(e)
    }),
    u(["error"], {
        createEventArgs: e => {
            return {
                message: (t = e).message,
                filename: t.filename,
                lineno: t.lineno,
                colno: t.colno,
                type: t.type
            };
            var t
        }
    }),
    u(["loadstart", "timeout", "abort", "load", "loadend", "progress"], {
        createEventArgs: e => {
            return {
                lengthComputable: (t = e).lengthComputable,
                loaded: t.loaded,
                total: t.total,
                type: t.type
            };
            var t
        }
    }),
    u(["touchcancel", "touchend", "touchmove", "touchenter", "touchleave", "touchstart"], {
        createEventArgs: e => {
            return {
                detail: (t = e).detail,
                touches: d(t.touches),
                targetTouches: d(t.targetTouches),
                changedTouches: d(t.changedTouches),
                ctrlKey: t.ctrlKey,
                shiftKey: t.shiftKey,
                altKey: t.altKey,
                metaKey: t.metaKey,
                type: t.type
            };
            var t
        }
    }),
    u(["gotpointercapture", "lostpointercapture", "pointercancel", "pointerdown", "pointerenter", "pointerleave", "pointermove", "pointerout", "pointerover", "pointerup"], {
        createEventArgs: e => {
            return {
                ...f(t = e),
                pointerId: t.pointerId,
                width: t.width,
                height: t.height,
                pressure: t.pressure,
                tiltX: t.tiltX,
                tiltY: t.tiltY,
                pointerType: t.pointerType,
                isPrimary: t.isPrimary
            };
            var t
        }
    }),
    u(["wheel", "mousewheel"], {
        createEventArgs: e => {
            return {
                ...f(t = e),
                deltaX: t.deltaX,
                deltaY: t.deltaY,
                deltaZ: t.deltaZ,
                deltaMode: t.deltaMode
            };
            var t
        }
    }),
    u(["cancel", "close", "toggle"], {
        createEventArgs: () => ({})
    });
    const m = ["date", "datetime-local", "month", "time", "week"]
      , h = new Map;
    let p, g, b = 0;
    const y = {
        async add(e, t, n) {
            if (!n)
                throw new Error("initialParameters must be an object, even if empty.");
            const r = "__bl-dynamic-root:" + (++b).toString();
            h.set(r, e);
            const o = await E().invokeMethodAsync("AddRootComponent", t, r)
              , i = new w(o,g[t]);
            return await i.setParameters(n),
            i
        }
    };
    class v {
        invoke(e) {
            return this._callback(e)
        }
        setCallback(t) {
            this._selfJSObjectReference || (this._selfJSObjectReference = e.createJSObjectReference(this)),
            this._callback = t
        }
        getJSObjectReference() {
            return this._selfJSObjectReference
        }
        dispose() {
            this._selfJSObjectReference && e.disposeJSObjectReference(this._selfJSObjectReference)
        }
    }
    class w {
        constructor(e, t) {
            this._jsEventCallbackWrappers = new Map,
            this._componentId = e;
            for (const e of t)
                "eventcallback" === e.type && this._jsEventCallbackWrappers.set(e.name.toLowerCase(), new v)
        }
        setParameters(e) {
            const t = {}
              , n = Object.entries(e || {})
              , r = n.length;
            for (const [e,r] of n) {
                const n = this._jsEventCallbackWrappers.get(e.toLowerCase());
                n && r ? (n.setCallback(r),
                t[e] = n.getJSObjectReference()) : t[e] = r
            }
            return E().invokeMethodAsync("SetRootComponentParameters", this._componentId, r, t)
        }
        async dispose() {
            if (null !== this._componentId) {
                await E().invokeMethodAsync("RemoveRootComponent", this._componentId),
                this._componentId = null;
                for (const e of this._jsEventCallbackWrappers.values())
                    e.dispose()
            }
        }
    }
    function E() {
        if (!p)
            throw new Error("Dynamic root components have not been enabled in this application.");
        return p
    }
    const S = new Map
      , C = []
      , A = new Map;
    function I(e, t, n) {
        return R(e, t.eventHandlerId, ( () => N(e).invokeMethodAsync("DispatchEventAsync", t, n)))
    }
    function N(e) {
        const t = S.get(e);
        if (!t)
            throw new Error(`No interop methods are registered for renderer ${e}`);
        return t
    }
    let R = (e, t, n) => n();
    const k = O(["abort", "blur", "cancel", "canplay", "canplaythrough", "change", "close", "cuechange", "durationchange", "emptied", "ended", "error", "focus", "load", "loadeddata", "loadedmetadata", "loadend", "loadstart", "mouseenter", "mouseleave", "pointerenter", "pointerleave", "pause", "play", "playing", "progress", "ratechange", "reset", "scroll", "seeked", "seeking", "stalled", "submit", "suspend", "timeupdate", "toggle", "unload", "volumechange", "waiting", "DOMNodeInsertedIntoDocument", "DOMNodeRemovedFromDocument"])
      , D = {
        submit: !0
    }
      , _ = O(["click", "dblclick", "mousedown", "mousemove", "mouseup"]);
    class T {
        static{this.nextEventDelegatorId = 0
        }constructor(e) {
            this.browserRendererId = e,
            this.afterClickCallbacks = [];
            const t = ++T.nextEventDelegatorId;
            this.eventsCollectionKey = `_blazorEvents_${t}`,
            this.eventInfoStore = new F(this.onGlobalEvent.bind(this))
        }
        setListener(e, t, n, r) {
            const o = this.getEventHandlerInfosForElement(e, !0)
              , i = o.getHandler(t);
            if (i)
                this.eventInfoStore.update(i.eventHandlerId, n);
            else {
                const i = {
                    element: e,
                    eventName: t,
                    eventHandlerId: n,
                    renderingComponentId: r
                };
                this.eventInfoStore.add(i),
                o.setHandler(t, i)
            }
        }
        getHandler(e) {
            return this.eventInfoStore.get(e)
        }
        removeListener(e) {
            const t = this.eventInfoStore.remove(e);
            if (t) {
                const e = t.element
                  , n = this.getEventHandlerInfosForElement(e, !1);
                n && n.removeHandler(t.eventName)
            }
        }
        notifyAfterClick(e) {
            this.afterClickCallbacks.push(e),
            this.eventInfoStore.addGlobalListener("click")
        }
        setStopPropagation(e, t, n) {
            this.getEventHandlerInfosForElement(e, !0).stopPropagation(t, n)
        }
        setPreventDefault(e, t, n) {
            this.getEventHandlerInfosForElement(e, !0).preventDefault(t, n)
        }
        onGlobalEvent(e) {
            if (!(e.target instanceof Element))
                return;
            this.dispatchGlobalEventToAllElements(e.type, e);
            const t = (n = e.type,
            s.get(n));
            var n;
            t && t.forEach((t => this.dispatchGlobalEventToAllElements(t, e))),
            "click" === e.type && this.afterClickCallbacks.forEach((t => t(e)))
        }
        dispatchGlobalEventToAllElements(e, t) {
            const n = t.composedPath();
            let r = n.shift()
              , i = null
              , s = !1;
            const a = Object.prototype.hasOwnProperty.call(k, e);
            let l = !1;
            for (; r; ) {
                const f = r
                  , m = this.getEventHandlerInfosForElement(f, !1);
                if (m) {
                    const n = m.getHandler(e);
                    if (n && (u = f,
                    d = t.type,
                    !((u instanceof HTMLButtonElement || u instanceof HTMLInputElement || u instanceof HTMLTextAreaElement || u instanceof HTMLSelectElement) && Object.prototype.hasOwnProperty.call(_, d) && u.disabled))) {
                        if (!s) {
                            const n = c(e);
                            i = n?.createEventArgs ? n.createEventArgs(t) : {},
                            s = !0
                        }
                        Object.prototype.hasOwnProperty.call(D, t.type) && t.preventDefault(),
                        I(this.browserRendererId, {
                            eventHandlerId: n.eventHandlerId,
                            eventName: e,
                            eventFieldInfo: o.fromEvent(n.renderingComponentId, t)
                        }, i)
                    }
                    m.stopPropagation(e) && (l = !0),
                    m.preventDefault(e) && t.preventDefault()
                }
                r = a || l ? void 0 : n.shift()
            }
            var u, d
        }
        getEventHandlerInfosForElement(e, t) {
            return Object.prototype.hasOwnProperty.call(e, this.eventsCollectionKey) ? e[this.eventsCollectionKey] : t ? e[this.eventsCollectionKey] = new L : null
        }
    }
    class F {
        constructor(e) {
            this.globalListener = e,
            this.infosByEventHandlerId = {},
            this.countByEventName = {},
            a.push(this.handleEventNameAliasAdded.bind(this))
        }
        add(e) {
            if (this.infosByEventHandlerId[e.eventHandlerId])
                throw new Error(`Event ${e.eventHandlerId} is already tracked`);
            this.infosByEventHandlerId[e.eventHandlerId] = e,
            this.addGlobalListener(e.eventName)
        }
        get(e) {
            return this.infosByEventHandlerId[e]
        }
        addGlobalListener(e) {
            if (e = l(e),
            Object.prototype.hasOwnProperty.call(this.countByEventName, e))
                this.countByEventName[e]++;
            else {
                this.countByEventName[e] = 1;
                const t = Object.prototype.hasOwnProperty.call(k, e);
                document.addEventListener(e, this.globalListener, t)
            }
        }
        update(e, t) {
            if (Object.prototype.hasOwnProperty.call(this.infosByEventHandlerId, t))
                throw new Error(`Event ${t} is already tracked`);
            const n = this.infosByEventHandlerId[e];
            delete this.infosByEventHandlerId[e],
            n.eventHandlerId = t,
            this.infosByEventHandlerId[t] = n
        }
        remove(e) {
            const t = this.infosByEventHandlerId[e];
            if (t) {
                delete this.infosByEventHandlerId[e];
                const n = l(t.eventName);
                0 == --this.countByEventName[n] && (delete this.countByEventName[n],
                document.removeEventListener(n, this.globalListener))
            }
            return t
        }
        handleEventNameAliasAdded(e, t) {
            if (Object.prototype.hasOwnProperty.call(this.countByEventName, e)) {
                const n = this.countByEventName[e];
                delete this.countByEventName[e],
                document.removeEventListener(e, this.globalListener),
                this.addGlobalListener(t),
                this.countByEventName[t] += n - 1
            }
        }
    }
    class L {
        constructor() {
            this.handlers = {},
            this.preventDefaultFlags = null,
            this.stopPropagationFlags = null
        }
        getHandler(e) {
            return Object.prototype.hasOwnProperty.call(this.handlers, e) ? this.handlers[e] : null
        }
        setHandler(e, t) {
            this.handlers[e] = t
        }
        removeHandler(e) {
            delete this.handlers[e]
        }
        preventDefault(e, t) {
            return void 0 !== t && (this.preventDefaultFlags = this.preventDefaultFlags || {},
            this.preventDefaultFlags[e] = t),
            !!this.preventDefaultFlags && this.preventDefaultFlags[e]
        }
        stopPropagation(e, t) {
            return void 0 !== t && (this.stopPropagationFlags = this.stopPropagationFlags || {},
            this.stopPropagationFlags[e] = t),
            !!this.stopPropagationFlags && this.stopPropagationFlags[e]
        }
    }
    function O(e) {
        const t = {};
        return e.forEach((e => {
            t[e] = !0
        }
        )),
        t
    }
    const M = Symbol()
      , x = Symbol()
      , P = Symbol();
    function B(e, t) {
        if (M in e)
            return e;
        const n = [];
        if (e.childNodes.length > 0) {
            if (!t)
                throw new Error("New logical elements must start empty, or allowExistingContents must be true");
            e.childNodes.forEach((t => {
                const r = B(t, !0);
                r[x] = e,
                n.push(r)
            }
            ))
        }
        return e[M] = n,
        e
    }
    function j(e) {
        const t = K(e);
        for (; t.length; )
            z(e, 0)
    }
    function H(e, t) {
        const n = document.createComment("!");
        return J(n, e, t),
        n
    }
    function J(e, t, n) {
        const r = e;
        let o = e;
        if (e instanceof Comment) {
            const t = K(r);
            if (t?.length > 0) {
                const t = G(r)
                  , n = new Range;
                n.setStartBefore(e),
                n.setEndAfter(t),
                o = n.extractContents()
            }
        }
        const i = $(r);
        if (i) {
            const e = K(i)
              , t = Array.prototype.indexOf.call(e, r);
            e.splice(t, 1),
            delete r[x]
        }
        const s = K(t);
        if (n < s.length) {
            const e = s[n];
            e.parentNode.insertBefore(o, e),
            s.splice(n, 0, r)
        } else
            q(o, t),
            s.push(r);
        r[x] = t,
        M in r || (r[M] = [])
    }
    function z(e, t) {
        const n = K(e).splice(t, 1)[0];
        if (n instanceof Comment) {
            const e = K(n);
            if (e)
                for (; e.length > 0; )
                    z(n, 0)
        }
        const r = n;
        r.parentNode.removeChild(r)
    }
    function $(e) {
        return e[x] || null
    }
    function W(e, t) {
        return K(e)[t]
    }
    function U(e) {
        const t = Y(e);
        return "http://www.w3.org/2000/svg" === t.namespaceURI && "foreignObject" !== t.tagName
    }
    function K(e) {
        return e[M]
    }
    function V(e) {
        const t = K($(e));
        return t[Array.prototype.indexOf.call(t, e) + 1] || null
    }
    function X(e, t) {
        const n = K(e);
        t.forEach((e => {
            e.moveRangeStart = n[e.fromSiblingIndex],
            e.moveRangeEnd = G(e.moveRangeStart)
        }
        )),
        t.forEach((t => {
            const r = document.createComment("marker");
            t.moveToBeforeMarker = r;
            const o = n[t.toSiblingIndex + 1];
            o ? o.parentNode.insertBefore(r, o) : q(r, e)
        }
        )),
        t.forEach((e => {
            const t = e.moveToBeforeMarker
              , n = t.parentNode
              , r = e.moveRangeStart
              , o = e.moveRangeEnd;
            let i = r;
            for (; i; ) {
                const e = i.nextSibling;
                if (n.insertBefore(i, t),
                i === o)
                    break;
                i = e
            }
            n.removeChild(t)
        }
        )),
        t.forEach((e => {
            n[e.toSiblingIndex] = e.moveRangeStart
        }
        ))
    }
    function Y(e) {
        if (e instanceof Element || e instanceof DocumentFragment)
            return e;
        if (e instanceof Comment)
            return e.parentNode;
        throw new Error("Not a valid logical element")
    }
    function q(e, t) {
        if (t instanceof Element || t instanceof DocumentFragment)
            t.appendChild(e);
        else {
            if (!(t instanceof Comment))
                throw new Error(`Cannot append node because the parent is not a valid logical element. Parent: ${t}`);
            {
                const n = V(t);
                n ? n.parentNode.insertBefore(e, n) : q(e, $(t))
            }
        }
    }
    function G(e) {
        if (e instanceof Element || e instanceof DocumentFragment)
            return e;
        const t = V(e);
        if (t)
            return t.previousSibling;
        {
            const t = $(e);
            return t instanceof Element || t instanceof DocumentFragment ? t.lastChild : G(t)
        }
    }
    function Z(e) {
        return `_bl_${e}`
    }
    const Q = "__internalId";
    e.attachReviver(( (e, t) => t && "object" == typeof t && Object.prototype.hasOwnProperty.call(t, Q) && "string" == typeof t[Q] ? function(e) {
        const t = `[${Z(e)}]`;
        return document.querySelector(t)
    }(t[Q]) : t));
    const ee = "_blazorDeferredValue";
    function te(e) {
        return "select-multiple" === e.type
    }
    function ne(e, t) {
        e.value = t || ""
    }
    function re(e, t) {
        e instanceof HTMLSelectElement ? te(e) ? function(e, t) {
            t ||= [];
            for (let n = 0; n < e.options.length; n++)
                e.options[n].selected = -1 !== t.indexOf(e.options[n].value)
        }(e, t) : ne(e, t) : e.value = t
    }
    function oe(e) {
        const t = function(e) {
            for (; e; ) {
                if (e instanceof HTMLSelectElement)
                    return e;
                e = e.parentElement
            }
            return null
        }(e);
        if (!function(e) {
            return !!e && ee in e
        }(t))
            return !1;
        if (te(t))
            e.selected = -1 !== t._blazorDeferredValue.indexOf(e.value);
        else {
            if (t._blazorDeferredValue !== e.value)
                return !1;
            ne(t, e.value),
            delete t._blazorDeferredValue
        }
        return !0
    }
    const ie = document.createElement("template")
      , se = document.createElementNS("http://www.w3.org/2000/svg", "g")
      , ae = new Set
      , ce = Symbol()
      , le = Symbol();
    class ue {
        constructor(e) {
            this.rootComponentIds = new Set,
            this.childComponentLocations = {},
            this.eventDelegator = new T(e),
            this.eventDelegator.notifyAfterClick((e => {
                Se() && function(e) {
                    if (0 !== e.button || function(e) {
                        return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey
                    }(e))
                        return;
                    if (e.defaultPrevented)
                        return;
                    const t = function(e) {
                        const t = e.composedPath && e.composedPath();
                        if (t)
                            for (let e = 0; e < t.length; e++) {
                                const n = t[e];
                                if (n instanceof HTMLAnchorElement || n instanceof SVGAElement)
                                    return n
                            }
                        return null
                    }(e);
                    if (t && function(e) {
                        const t = e.getAttribute("target");
                        return (!t || "_self" === t) && e.hasAttribute("href") && !e.hasAttribute("download")
                    }(t)) {
                        const n = Ee(t.getAttribute("href"));
                        ve(n) && (e.preventDefault(),
                        Fe(n, !0, !1))
                    }
                }(e)
            }
            ))
        }
        getRootComponentCount() {
            return this.rootComponentIds.size
        }
        attachRootComponentToLogicalElement(e, t, n) {
            if (function(e) {
                return e[ce]
            }(t))
                throw new Error(`Root component '${e}' could not be attached because its target element is already associated with a root component`);
            n && (t = H(t, K(t).length)),
            de(t, !0),
            this.attachComponentToElement(e, t),
            this.rootComponentIds.add(e),
            ae.add(t)
        }
        updateComponent(e, t, n, r) {
            const o = this.childComponentLocations[t];
            if (!o)
                throw new Error(`No element is currently associated with component ${t}`);
            ae.delete(o) && (j(o),
            o instanceof Comment && (o.textContent = "!"));
            const i = Y(o)?.getRootNode()
              , s = i && i.activeElement;
            this.applyEdits(e, t, o, 0, n, r),
            s instanceof HTMLElement && i && i.activeElement !== s && s.focus()
        }
        disposeComponent(e) {
            if (this.rootComponentIds.delete(e)) {
                const t = this.childComponentLocations[e];
                de(t, !1),
                !0 === t[le] ? ae.add(t) : j(t)
            }
            delete this.childComponentLocations[e]
        }
        disposeEventHandler(e) {
            this.eventDelegator.removeListener(e)
        }
        attachComponentToElement(e, t) {
            this.childComponentLocations[e] = t
        }
        applyEdits(e, t, r, o, i, s) {
            let a, c = 0, l = o;
            const u = e.arrayBuilderSegmentReader
              , d = e.editReader
              , f = e.frameReader
              , m = u.values(i)
              , h = u.offset(i)
              , p = h + u.count(i);
            for (let i = h; i < p; i++) {
                const u = e.diffReader.editsEntry(m, i)
                  , h = d.editType(u);
                switch (h) {
                case n.prependFrame:
                    {
                        const n = d.newTreeIndex(u)
                          , o = e.referenceFramesEntry(s, n)
                          , i = d.siblingIndex(u);
                        this.insertFrame(e, t, r, l + i, s, o, n);
                        break
                    }
                case n.removeFrame:
                    z(r, l + d.siblingIndex(u));
                    break;
                case n.setAttribute:
                    {
                        const n = d.newTreeIndex(u)
                          , o = e.referenceFramesEntry(s, n)
                          , i = W(r, l + d.siblingIndex(u));
                        if (!(i instanceof Element))
                            throw new Error("Cannot set attribute on non-element child");
                        this.applyAttribute(e, t, i, o);
                        break
                    }
                case n.removeAttribute:
                    {
                        const e = W(r, l + d.siblingIndex(u));
                        if (!(e instanceof Element))
                            throw new Error("Cannot remove attribute from non-element child");
                        {
                            const t = d.removedAttributeName(u);
                            this.setOrRemoveAttributeOrProperty(e, t, null)
                        }
                        break
                    }
                case n.updateText:
                    {
                        const t = d.newTreeIndex(u)
                          , n = e.referenceFramesEntry(s, t)
                          , o = W(r, l + d.siblingIndex(u));
                        if (!(o instanceof Text))
                            throw new Error("Cannot set text content on non-text child");
                        o.textContent = f.textContent(n);
                        break
                    }
                case n.updateMarkup:
                    {
                        const t = d.newTreeIndex(u)
                          , n = e.referenceFramesEntry(s, t)
                          , o = d.siblingIndex(u);
                        z(r, l + o),
                        this.insertMarkup(e, r, l + o, n);
                        break
                    }
                case n.stepIn:
                    r = W(r, l + d.siblingIndex(u)),
                    c++,
                    l = 0;
                    break;
                case n.stepOut:
                    r = $(r),
                    c--,
                    l = 0 === c ? o : 0;
                    break;
                case n.permutationListEntry:
                    a = a || [],
                    a.push({
                        fromSiblingIndex: l + d.siblingIndex(u),
                        toSiblingIndex: l + d.moveToSiblingIndex(u)
                    });
                    break;
                case n.permutationListEnd:
                    X(r, a),
                    a = void 0;
                    break;
                default:
                    throw new Error(`Unknown edit type: ${h}`)
                }
            }
        }
        insertFrame(e, t, n, o, i, s, a) {
            const c = e.frameReader
              , l = c.frameType(s);
            switch (l) {
            case r.element:
                return this.insertElement(e, t, n, o, i, s, a),
                1;
            case r.text:
                return this.insertText(e, n, o, s),
                1;
            case r.attribute:
                throw new Error("Attribute frames should only be present as leading children of element frames.");
            case r.component:
                return this.insertComponent(e, n, o, s),
                1;
            case r.region:
                return this.insertFrameRange(e, t, n, o, i, a + 1, a + c.subtreeLength(s));
            case r.elementReferenceCapture:
                if (n instanceof Element)
                    return u = n,
                    d = c.elementReferenceCaptureId(s),
                    u.setAttribute(Z(d), ""),
                    0;
                throw new Error("Reference capture frames can only be children of element frames.");
            case r.markup:
                return this.insertMarkup(e, n, o, s),
                1;
            case r.namedEvent:
                return 0;
            default:
                throw new Error(`Unknown frame type: ${l}`)
            }
            var u, d
        }
        insertElement(e, t, n, o, i, s, a) {
            const c = e.frameReader
              , l = c.elementName(s)
              , u = "svg" === l || U(n) ? document.createElementNS("http://www.w3.org/2000/svg", l) : document.createElement(l)
              , d = B(u);
            let f = !1;
            const m = a + c.subtreeLength(s);
            for (let s = a + 1; s < m; s++) {
                const a = e.referenceFramesEntry(i, s);
                if (c.frameType(a) !== r.attribute) {
                    J(u, n, o),
                    f = !0,
                    this.insertFrameRange(e, t, d, 0, i, s, m);
                    break
                }
                this.applyAttribute(e, t, u, a)
            }
            var h;
            f || J(u, n, o),
            (h = u)instanceof HTMLOptionElement ? oe(h) : ee in h && re(h, h[ee])
        }
        insertComponent(e, t, n, r) {
            const o = H(t, n)
              , i = e.frameReader.componentId(r);
            this.attachComponentToElement(i, o)
        }
        insertText(e, t, n, r) {
            const o = e.frameReader.textContent(r);
            J(document.createTextNode(o), t, n)
        }
        insertMarkup(e, t, n, r) {
            const o = H(t, n)
              , i = (s = e.frameReader.markupContent(r),
            U(t) ? (se.innerHTML = s || " ",
            se) : (ie.innerHTML = s || " ",
            ie.content.querySelectorAll("script").forEach((e => {
                const t = document.createElement("script");
                t.textContent = e.textContent,
                e.getAttributeNames().forEach((n => {
                    t.setAttribute(n, e.getAttribute(n))
                }
                )),
                e.parentNode.replaceChild(t, e)
            }
            )),
            ie.content));
            var s;
            let a = 0;
            for (; i.firstChild; )
                J(i.firstChild, o, a++)
        }
        applyAttribute(e, t, n, r) {
            const o = e.frameReader
              , i = o.attributeName(r)
              , s = o.attributeEventHandlerId(r);
            if (s) {
                const e = me(i);
                return void this.eventDelegator.setListener(n, e, s, t)
            }
            const a = o.attributeValue(r);
            this.setOrRemoveAttributeOrProperty(n, i, a)
        }
        insertFrameRange(e, t, n, r, o, i, s) {
            const a = r;
            for (let a = i; a < s; a++) {
                const i = e.referenceFramesEntry(o, a);
                r += this.insertFrame(e, t, n, r, o, i, a),
                a += fe(e, i)
            }
            return r - a
        }
        setOrRemoveAttributeOrProperty(e, t, n) {
            (function(e, t, n) {
                switch (t) {
                case "value":
                    return function(e, t) {
                        switch (t && "INPUT" === e.tagName && (t = function(e, t) {
                            switch (t.getAttribute("type")) {
                            case "time":
                                return 8 !== e.length || !e.endsWith("00") && t.hasAttribute("step") ? e : e.substring(0, 5);
                            case "datetime-local":
                                return 19 !== e.length || !e.endsWith("00") && t.hasAttribute("step") ? e : e.substring(0, 16);
                            default:
                                return e
                            }
                        }(t, e)),
                        e.tagName) {
                        case "INPUT":
                        case "SELECT":
                        case "TEXTAREA":
                            return t && e instanceof HTMLSelectElement && te(e) && (t = JSON.parse(t)),
                            re(e, t),
                            e[ee] = t,
                            !0;
                        case "OPTION":
                            return t || "" === t ? e.setAttribute("value", t) : e.removeAttribute("value"),
                            oe(e),
                            !0;
                        default:
                            return !1
                        }
                    }(e, n);
                case "checked":
                    return function(e, t) {
                        return "INPUT" === e.tagName && (e.checked = null !== t,
                        !0)
                    }(e, n);
                default:
                    return !1
                }
            }
            )(e, t, n) || (t.startsWith("__internal_") ? this.applyInternalAttribute(e, t.substring(11), n) : null !== n ? e.setAttribute(t, n) : e.removeAttribute(t))
        }
        applyInternalAttribute(e, t, n) {
            if (t.startsWith("stopPropagation_")) {
                const r = me(t.substring(16));
                this.eventDelegator.setStopPropagation(e, r, null !== n)
            } else {
                if (!t.startsWith("preventDefault_"))
                    throw new Error(`Unsupported internal attribute '${t}'`);
                {
                    const r = me(t.substring(15));
                    this.eventDelegator.setPreventDefault(e, r, null !== n)
                }
            }
        }
    }
    function de(e, t) {
        e[ce] = t
    }
    function fe(e, t) {
        const n = e.frameReader;
        switch (n.frameType(t)) {
        case r.component:
        case r.element:
        case r.region:
            return n.subtreeLength(t) - 1;
        default:
            return 0
        }
    }
    function me(e) {
        if (e.startsWith("on"))
            return e.substring(2);
        throw new Error(`Attribute should be an event name, but doesn't start with 'on'. Value: '${e}'`)
    }
    const he = {};
    let pe, ge, be = !1;
    function ye(e, t, n, r) {
        let o = he[e];
        o || (o = new ue(e),
        he[e] = o),
        o.attachRootComponentToLogicalElement(n, t, r)
    }
    function ve(e) {
        const t = (n = document.baseURI).substring(0, n.lastIndexOf("/"));
        var n;
        const r = e.charAt(t.length);
        return e.startsWith(t) && ("" === r || "/" === r || "?" === r || "#" === r)
    }
    function we(e) {
        document.getElementById(e)?.scrollIntoView()
    }
    function Ee(e) {
        return ge = ge || document.createElement("a"),
        ge.href = e,
        ge.href
    }
    function Se() {
        return void 0 !== pe
    }
    function Ce() {
        return pe
    }
    let Ae = !1
      , Ie = 0
      , Ne = 0;
    const Re = new Map;
    let ke = async function(e) {
        Me();
        const t = je();
        if (t?.hasLocationChangingEventListeners) {
            const n = e.state?._index ?? 0
              , r = e.state?.userState
              , o = n - Ie
              , i = location.href;
            if (await Oe(-o),
            !await xe(i, r, !1, t))
                return;
            await Oe(o)
        }
        await Pe(!0)
    }
      , De = null;
    const _e = {
        listenForNavigationEvents: function(e, t, n) {
            Re.set(e, {
                rendererId: e,
                hasLocationChangingEventListeners: !1,
                locationChanged: t,
                locationChanging: n
            }),
            Ae || (Ae = !0,
            window.addEventListener("popstate", Be),
            Ie = history.state?._index ?? 0)
        },
        enableNavigationInterception: function(e) {
            if (void 0 !== pe && pe !== e)
                throw new Error("Only one interactive runtime may enable navigation interception at a time.");
            pe = e
        },
        setHasLocationChangingListeners: function(e, t) {
            const n = Re.get(e);
            if (!n)
                throw new Error(`Renderer with ID '${e}' is not listening for navigation events`);
            n.hasLocationChangingEventListeners = t
        },
        endLocationChanging: function(e, t) {
            De && e === Ne && (De(t),
            De = null)
        },
        navigateTo: function(e, t) {
            Te(e, t, !0)
        },
        refresh: function(e) {
            location.reload()
        },
        getBaseURI: () => document.baseURI,
        getLocationHref: () => location.href,
        scrollToElement: we
    };
    function Te(e, t, n=!1) {
        const r = Ee(e);
        !t.forceLoad && ve(r) ? He() ? Fe(r, !1, t.replaceHistoryEntry, t.historyEntryState, n) : function() {
            throw new Error("No enhanced programmatic navigation handler has been attached")
        }() : function(e, t) {
            if (location.href === e) {
                const t = e + "?";
                history.replaceState(null, "", t),
                location.replace(e)
            } else
                t ? location.replace(e) : location.href = e
        }(e, t.replaceHistoryEntry)
    }
    async function Fe(e, t, n, r=void 0, o=!1) {
        if (Me(),
        function(e) {
            const t = new URL(e);
            return "" !== t.hash && location.origin === t.origin && location.pathname === t.pathname && location.search === t.search
        }(e))
            return Le(e, n, r),
            void function(e) {
                const t = e.indexOf("#");
                t !== e.length - 1 && we(e.substring(t + 1))
            }(e);
        const i = je();
        (o || !i?.hasLocationChangingEventListeners || await xe(e, r, t, i)) && (be = !0,
        Le(e, n, r),
        await Pe(t))
    }
    function Le(e, t, n=void 0) {
        t ? history.replaceState({
            userState: n,
            _index: Ie
        }, "", e) : (Ie++,
        history.pushState({
            userState: n,
            _index: Ie
        }, "", e))
    }
    function Oe(e) {
        return new Promise((t => {
            const n = ke;
            ke = () => {
                ke = n,
                t()
            }
            ,
            history.go(e)
        }
        ))
    }
    function Me() {
        De && (De(!1),
        De = null)
    }
    function xe(e, t, n, r) {
        return new Promise((o => {
            Me(),
            Ne++,
            De = o,
            r.locationChanging(Ne, e, t, n)
        }
        ))
    }
    async function Pe(e, t) {
        const n = location.href;
        await Promise.all(Array.from(Re, (async ([t,r]) => {
            var o;
            o = t,
            S.has(o) && await r.locationChanged(n, history.state?.userState, e)
        }
        )))
    }
    async function Be(e) {
        ke && He() && await ke(e),
        Ie = history.state?._index ?? 0
    }
    function je() {
        const e = Ce();
        if (void 0 !== e)
            return Re.get(e)
    }
    function He() {
        return Se() || !0
    }
    const Je = {
        focus: function(e, t) {
            if (e instanceof HTMLElement)
                e.focus({
                    preventScroll: t
                });
            else {
                if (!(e instanceof SVGElement))
                    throw new Error("Unable to focus an invalid element.");
                if (!e.hasAttribute("tabindex"))
                    throw new Error("Unable to focus an SVG element that does not have a tabindex.");
                e.focus({
                    preventScroll: t
                })
            }
        },
        focusBySelector: function(e) {
            const t = document.querySelector(e);
            t && (t.hasAttribute("tabindex") || (t.tabIndex = -1),
            t.focus({
                preventScroll: !0
            }))
        }
    }
      , ze = {
        init: function(e, t, n, r=50) {
            const o = We(t);
            (o || document.documentElement).style.overflowAnchor = "none";
            const i = document.createRange();
            f(n.parentElement) && (t.style.display = "table-row",
            n.style.display = "table-row");
            const s = new IntersectionObserver((function(r) {
                r.forEach((r => {
                    if (!r.isIntersecting)
                        return;
                    i.setStartAfter(t),
                    i.setEndBefore(n);
                    const o = i.getBoundingClientRect().height
                      , s = r.rootBounds?.height;
                    r.target === t ? e.invokeMethodAsync("OnSpacerBeforeVisible", r.intersectionRect.top - r.boundingClientRect.top, o, s) : r.target === n && n.offsetHeight > 0 && e.invokeMethodAsync("OnSpacerAfterVisible", r.boundingClientRect.bottom - r.intersectionRect.bottom, o, s)
                }
                ))
            }
            ),{
                root: o,
                rootMargin: `${r}px`
            });
            s.observe(t),
            s.observe(n);
            const a = d(t)
              , c = d(n)
              , {observersByDotNetObjectId: l, id: u} = Ue(e);
            function d(e) {
                const t = {
                    attributes: !0
                }
                  , n = new MutationObserver(( (n, r) => {
                    f(e.parentElement) && (r.disconnect(),
                    e.style.display = "table-row",
                    r.observe(e, t)),
                    s.unobserve(e),
                    s.observe(e)
                }
                ));
                return n.observe(e, t),
                n
            }
            function f(e) {
                return null !== e && (e instanceof HTMLTableElement && "" === e.style.display || "table" === e.style.display || e instanceof HTMLTableSectionElement && "" === e.style.display || "table-row-group" === e.style.display)
            }
            l[u] = {
                intersectionObserver: s,
                mutationObserverBefore: a,
                mutationObserverAfter: c
            }
        },
        dispose: function(e) {
            const {observersByDotNetObjectId: t, id: n} = Ue(e)
              , r = t[n];
            r && (r.intersectionObserver.disconnect(),
            r.mutationObserverBefore.disconnect(),
            r.mutationObserverAfter.disconnect(),
            e.dispose(),
            delete t[n])
        }
    }
      , $e = Symbol();
    function We(e) {
        return e && e !== document.body && e !== document.documentElement ? "visible" !== getComputedStyle(e).overflowY ? e : We(e.parentElement) : null
    }
    function Ue(e) {
        const t = e._callDispatcher
          , n = e._id;
        return t[$e] ??= {},
        {
            observersByDotNetObjectId: t[$e],
            id: n
        }
    }
    const Ke = {
        getAndRemoveExistingTitle: function() {
            const e = document.head ? document.head.getElementsByTagName("title") : [];
            if (0 === e.length)
                return null;
            let t = null;
            for (let n = e.length - 1; n >= 0; n--) {
                const r = e[n]
                  , o = r.previousSibling;
                o instanceof Comment && null !== $(o) || (null === t && (t = r.textContent),
                r.parentNode?.removeChild(r))
            }
            return t
        }
    }
      , Ve = {
        init: function(e, t) {
            t._blazorInputFileNextFileId = 0,
            t.addEventListener("click", (function() {
                t.value = ""
            }
            )),
            t.addEventListener("change", (function() {
                t._blazorFilesById = {};
                const n = Array.prototype.map.call(t.files, (function(e) {
                    const n = {
                        id: ++t._blazorInputFileNextFileId,
                        lastModified: new Date(e.lastModified).toISOString(),
                        name: e.name,
                        size: e.size,
                        contentType: e.type,
                        readPromise: void 0,
                        arrayBuffer: void 0,
                        blob: e
                    };
                    return t._blazorFilesById[n.id] = n,
                    n
                }
                ));
                e.invokeMethodAsync("NotifyChange", n)
            }
            ))
        },
        toImageFile: async function(e, t, n, r, o) {
            const i = Xe(e, t)
              , s = await new Promise((function(e) {
                const t = new Image;
                t.onload = function() {
                    URL.revokeObjectURL(t.src),
                    e(t)
                }
                ,
                t.onerror = function() {
                    t.onerror = null,
                    URL.revokeObjectURL(t.src)
                }
                ,
                t.src = URL.createObjectURL(i.blob)
            }
            ))
              , a = await new Promise((function(e) {
                const t = Math.min(1, r / s.width)
                  , i = Math.min(1, o / s.height)
                  , a = Math.min(t, i)
                  , c = document.createElement("canvas");
                c.width = Math.round(s.width * a),
                c.height = Math.round(s.height * a),
                c.getContext("2d")?.drawImage(s, 0, 0, c.width, c.height),
                c.toBlob(e, n)
            }
            ))
              , c = {
                id: ++e._blazorInputFileNextFileId,
                lastModified: i.lastModified,
                name: i.name,
                size: a?.size || 0,
                contentType: n,
                blob: a || i.blob
            };
            return e._blazorFilesById[c.id] = c,
            c
        },
        readFileData: async function(e, t) {
            return Xe(e, t).blob
        }
    };
    function Xe(e, t) {
        const n = e._blazorFilesById[t];
        if (!n)
            throw new Error(`There is no file with ID ${t}. The file list may have changed. See https://aka.ms/aspnet/blazor-input-file-multiple-selections.`);
        return n
    }
    const Ye = new Set
      , qe = {
        enableNavigationPrompt: function(e) {
            0 === Ye.size && window.addEventListener("beforeunload", Ge),
            Ye.add(e)
        },
        disableNavigationPrompt: function(e) {
            Ye.delete(e),
            0 === Ye.size && window.removeEventListener("beforeunload", Ge)
        }
    };
    function Ge(e) {
        e.preventDefault(),
        e.returnValue = !0
    }
    const Ze = new Map
      , Qe = {
        navigateTo: function(e, t, n=!1) {
            Te(e, t instanceof Object ? t : {
                forceLoad: t,
                replaceHistoryEntry: n
            })
        },
        registerCustomEventType: function(e, t) {
            if (!t)
                throw new Error("The options parameter is required.");
            if (i.has(e))
                throw new Error(`The event '${e}' is already registered.`);
            if (t.browserEventName) {
                const n = s.get(t.browserEventName);
                n ? n.push(e) : s.set(t.browserEventName, [e]),
                a.forEach((n => n(e, t.browserEventName)))
            }
            i.set(e, t)
        },
        rootComponents: y,
        runtime: {},
        _internal: {
            navigationManager: _e,
            domWrapper: Je,
            Virtualize: ze,
            PageTitle: Ke,
            browserRenderers: he,
            InputFile: Ve,
            NavigationLock: qe,
            getJSDataStreamChunk: async function(e, t, n) {
                return e instanceof Blob ? await async function(e, t, n) {
                    const r = e.slice(t, t + n)
                      , o = await r.arrayBuffer();
                    return new Uint8Array(o)
                }(e, t, n) : function(e, t, n) {
                    return new Uint8Array(e.buffer,e.byteOffset + t,n)
                }(e, t, n)
            },
            attachWebRendererInterop: function(t, n, r, o) {
                if (S.has(t))
                    throw new Error(`Interop methods are already registered for renderer ${t}`);
                S.set(t, n),
                r && o && Object.keys(r).length > 0 && function(t, n, r) {
                    if (p)
                        throw new Error("Dynamic root components have already been enabled.");
                    p = t,
                    g = n;
                    for (const [t,o] of Object.entries(r)) {
                        const r = e.findJSFunction(t, 0);
                        for (const e of o)
                            r(e, n[e])
                    }
                }(N(t), r, o),
                A.get(t)?.[0]?.(),
                function(e) {
                    for (const t of C)
                        t(e)
                }(t)
            }
        }
    };
    window.Blazor = Qe;
    const et = navigator
      , tt = et.userAgentData && et.userAgentData.brands
      , nt = tt && tt.length > 0 ? tt.some((e => "Google Chrome" === e.brand || "Microsoft Edge" === e.brand || "Chromium" === e.brand)) : window.chrome
      , rt = et.userAgentData?.platform ?? navigator.platform;
    function ot(e) {
        return 0 !== e.debugLevel && (nt || navigator.userAgent.includes("Firefox"))
    }
    let it = !1;
    function st() {
        const e = document.querySelector("#blazor-error-ui");
        e && (e.style.display = "block"),
        it || (it = !0,
        document.querySelectorAll("#blazor-error-ui .reload").forEach((e => {
            e.onclick = function(e) {
                location.reload(),
                e.preventDefault()
            }
        }
        )),
        document.querySelectorAll("#blazor-error-ui .dismiss").forEach((e => {
            e.onclick = function(e) {
                const t = document.querySelector("#blazor-error-ui");
                t && (t.style.display = "none"),
                e.preventDefault()
            }
        }
        )))
    }
    var at, ct;
    !function(e) {
        e[e.Default = 0] = "Default",
        e[e.Server = 1] = "Server",
        e[e.WebAssembly = 2] = "WebAssembly",
        e[e.WebView = 3] = "WebView"
    }(at || (at = {})),
    function(e) {
        e[e.Trace = 0] = "Trace",
        e[e.Debug = 1] = "Debug",
        e[e.Information = 2] = "Information",
        e[e.Warning = 3] = "Warning",
        e[e.Error = 4] = "Error",
        e[e.Critical = 5] = "Critical",
        e[e.None = 6] = "None"
    }(ct || (ct = {}));
    class lt {
        constructor(e=!0, t, n, r=0) {
            this.singleRuntime = e,
            this.logger = t,
            this.webRendererId = r,
            this.afterStartedCallbacks = [],
            n && this.afterStartedCallbacks.push(...n)
        }
        async importInitializersAsync(e, t) {
            await Promise.all(e.map((e => async function(e, n) {
                const r = function(e) {
                    const t = document.baseURI;
                    return t.endsWith("/") ? `${t}${e}` : `${t}/${e}`
                }(n)
                  , o = await import(r);
                if (void 0 !== o) {
                    if (e.singleRuntime) {
                        const {beforeStart: n, afterStarted: r, beforeWebAssemblyStart: s, afterWebAssemblyStarted: a, beforeServerStart: c, afterServerStarted: l} = o;
                        let u = n;
                        e.webRendererId === at.Server && c && (u = c),
                        e.webRendererId === at.WebAssembly && s && (u = s);
                        let d = r;
                        return e.webRendererId === at.Server && l && (d = l),
                        e.webRendererId === at.WebAssembly && a && (d = a),
                        i(e, u, d, t)
                    }
                    return function(e, t, n) {
                        const o = n[0]
                          , {beforeStart: s, afterStarted: a, beforeWebStart: c, afterWebStarted: l, beforeWebAssemblyStart: u, afterWebAssemblyStarted: d, beforeServerStart: f, afterServerStarted: m} = t
                          , h = !(c || l || u || d || f || m || !s && !a)
                          , p = h && o.enableClassicInitializers;
                        if (h && !o.enableClassicInitializers)
                            e.logger?.log(ct.Warning, `Initializer '${r}' will be ignored because multiple runtimes are available. Use 'before(Web|WebAssembly|Server)Start' and 'after(Web|WebAssembly|Server)Started' instead.`);
                        else if (p)
                            return i(e, s, a, n);
                        if (function(e) {
                            e.webAssembly ? e.webAssembly.initializers || (e.webAssembly.initializers = {
                                beforeStart: [],
                                afterStarted: []
                            }) : e.webAssembly = {
                                initializers: {
                                    beforeStart: [],
                                    afterStarted: []
                                }
                            },
                            e.circuit ? e.circuit.initializers || (e.circuit.initializers = {
                                beforeStart: [],
                                afterStarted: []
                            }) : e.circuit = {
                                initializers: {
                                    beforeStart: [],
                                    afterStarted: []
                                }
                            }
                        }(o),
                        u && o.webAssembly.initializers.beforeStart.push(u),
                        d && o.webAssembly.initializers.afterStarted.push(d),
                        f && o.circuit.initializers.beforeStart.push(f),
                        m && o.circuit.initializers.afterStarted.push(m),
                        l && e.afterStartedCallbacks.push(l),
                        c)
                            return c(o)
                    }(e, o, t)
                }
                function i(e, t, n, r) {
                    if (n && e.afterStartedCallbacks.push(n),
                    t)
                        return t(...r)
                }
            }(this, e))))
        }
        async invokeAfterStartedCallbacks(e) {
            const t = (n = this.webRendererId,
            A.get(n)?.[1]);
            var n;
            t && await t,
            await Promise.all(this.afterStartedCallbacks.map((t => t(e))))
        }
    }
    let ut, dt, ft, mt, ht = null;
    const pt = {
        load: function(e, t) {
            return async function(e, t) {
                const {dotnet: n} = await async function(e) {
                    if ("undefined" == typeof WebAssembly || !WebAssembly.validate)
                        throw new Error("This browser does not support WebAssembly.");
                    let t = "_framework/dotnet.js";
                    if (e.loadBootResource) {
                        const n = "dotnetjs"
                          , r = e.loadBootResource(n, "dotnet.js", t, "", "js-module-dotnet");
                        if ("string" == typeof r)
                            t = r;
                        else if (r)
                            throw new Error(`For a ${n} resource, custom loaders must supply a URI string.`)
                    }
                    const n = new URL(t,document.baseURI).toString();
                    return await import(n)
                }(e)
                  , r = function(e, t) {
                    const n = {
                        maxParallelDownloads: 1e6,
                        enableDownloadRetry: !1,
                        applicationEnvironment: e.environment
                    }
                      , r = {
                        ...window.Module || {},
                        onConfigLoaded: async n => {
                            n.environmentVariables || (n.environmentVariables = {}),
                            "sharded" === n.globalizationMode && (n.environmentVariables.__BLAZOR_SHARDED_ICU = "1"),
                            Qe._internal.getApplicationEnvironment = () => n.applicationEnvironment,
                            t?.(n),
                            mt = await async function(e, t) {
                                if (e.initializers)
                                    return await Promise.all(e.initializers.beforeStart.map((t => t(e)))),
                                    new lt(!1,void 0,e.initializers.afterStarted,at.WebAssembly);
                                {
                                    const n = [e, t.resources?.extensions ?? {}]
                                      , r = new lt(!0,void 0,void 0,at.WebAssembly)
                                      , o = Object.keys(t?.resources?.libraryInitializers || {});
                                    return await r.importInitializersAsync(o, n),
                                    r
                                }
                            }(e, n)
                        }
                        ,
                        onDownloadResourceProgress: gt,
                        config: n,
                        out: yt,
                        err: vt
                    };
                    return r
                }(e, t);
                e.applicationCulture && n.withApplicationCulture(e.applicationCulture),
                e.environment && n.withApplicationEnvironment(e.environment),
                e.loadBootResource && n.withResourceLoader(e.loadBootResource),
                n.withModuleConfig(r),
                e.configureRuntime && e.configureRuntime(n),
                ft = await n.create()
            }(e, t)
        },
        start: function() {
            return async function() {
                if (!ft)
                    throw new Error("The runtime must be loaded it gets configured.");
                const {setModuleImports: t, INTERNAL: n, getConfig: r, invokeLibraryInitializers: o} = ft;
                dt = n,
                function(e) {
                    const t = rt.match(/^Mac/i) ? "Cmd" : "Alt";
                    ot(e) && console.info(`Debugging hotkey: Shift+${t}+D (when application has focus)`),
                    document.addEventListener("keydown", (t => {
                        t.shiftKey && (t.metaKey || t.altKey) && "KeyD" === t.code && (ot(e) ? navigator.userAgent.includes("Firefox") ? async function() {
                            const e = await fetch(`_framework/debug?url=${encodeURIComponent(location.href)}&isFirefox=true`);
                            200 !== e.status && console.warn(await e.text())
                        }() : nt ? function() {
                            const e = document.createElement("a");
                            e.href = `_framework/debug?url=${encodeURIComponent(location.href)}`,
                            e.target = "_blank",
                            e.rel = "noopener noreferrer",
                            e.click()
                        }() : console.error("Currently, only Microsoft Edge (80+), Google Chrome, or Chromium, are supported for debugging.") : console.error("Cannot start debugging, because the application was not compiled with debugging enabled."))
                    }
                    ))
                }(r()),
                Qe.runtime = ft,
                Qe._internal.dotNetCriticalError = vt,
                t("blazor-internal", {
                    Blazor: {
                        _internal: Qe._internal
                    }
                });
                const i = await ft.getAssemblyExports("Microsoft.AspNetCore.Components.WebAssembly");
                return Object.assign(Qe._internal, {
                    dotNetExports: {
                        ...i.Microsoft.AspNetCore.Components.WebAssembly.Services.DefaultWebAssemblyJSRuntime
                    }
                }),
                ut = e.attachDispatcher({
                    beginInvokeDotNetFromJS: (e, t, n, r, o) => {
                        if (wt(),
                        !r && !t)
                            throw new Error("Either assemblyName or dotNetObjectId must have a non null value.");
                        const i = r ? r.toString() : t;
                        Qe._internal.dotNetExports.BeginInvokeDotNet(e ? e.toString() : null, i, n, o)
                    }
                    ,
                    endInvokeJSFromDotNet: (e, t, n) => {
                        Qe._internal.dotNetExports.EndInvokeJS(n)
                    }
                    ,
                    sendByteArray: (e, t) => {
                        Qe._internal.dotNetExports.ReceiveByteArrayFromJS(e, t)
                    }
                    ,
                    invokeDotNetFromJS: (e, t, n, r) => (wt(),
                    Qe._internal.dotNetExports.InvokeDotNet(e || null, t, n ?? 0, r))
                }),
                {
                    invokeLibraryInitializers: o
                }
            }()
        },
        callEntryPoint: async function() {
            try {
                await ft.runMain(ft.getConfig().mainAssemblyName, [])
            } catch (e) {
                console.error(e),
                st()
            }
        },
        getArrayEntryPtr: function(e, t, n) {
            const r = function(e) {
                return e + 12
            }(e) + 4 + t * n;
            return r
        },
        getObjectFieldsBaseAddress: function(e) {
            return e + 8
        },
        readInt16Field: function(e, t) {
            return ft.getHeapI16(e + (t || 0))
        },
        readInt32Field: function(e, t) {
            return ft.getHeapI32(e + (t || 0))
        },
        readUint64Field: function(e, t) {
            return ft.getHeapU52(e + (t || 0))
        },
        readObjectField: function(e, t) {
            return ft.getHeapU32(e + (t || 0))
        },
        readStringField: function(e, t, n) {
            const r = ft.getHeapU32(e + (t || 0));
            if (0 === r)
                return null;
            if (n) {
                const e = dt.monoObjectAsBoolOrNullUnsafe(r);
                if ("boolean" == typeof e)
                    return e ? "" : null
            }
            return dt.monoStringToStringUnsafe(r)
        },
        readStructField: function(e, t) {
            return e + (t || 0)
        },
        beginHeapLock: function() {
            return wt(),
            ht = Et.create(),
            ht
        },
        invokeWhenHeapUnlocked: function(e) {
            ht ? ht.enqueuePostReleaseAction(e) : e()
        }
    };
    function gt(e, t) {
        const n = e / t * 100;
        document.documentElement.style.setProperty("--blazor-load-percentage", `${n}%`),
        document.documentElement.style.setProperty("--blazor-load-percentage-text", `"${Math.floor(n)}%"`)
    }
    const bt = ["DEBUGGING ENABLED"]
      , yt = e => bt.indexOf(e) < 0 && console.log(e)
      , vt = e => {
        console.error(e || "(null)"),
        st()
    }
    ;
    function wt() {
        if (ht)
            throw new Error("Assertion failed - heap is currently locked")
    }
    class Et {
        enqueuePostReleaseAction(e) {
            this.postReleaseActions || (this.postReleaseActions = []),
            this.postReleaseActions.push(e)
        }
        release() {
            if (ht !== this)
                throw new Error("Trying to release a lock which isn't current");
            for (dt.mono_wasm_gc_unlock(),
            ht = null; this.postReleaseActions?.length; )
                this.postReleaseActions.shift()(),
                wt()
        }
        static create() {
            return dt.mono_wasm_gc_lock(),
            new Et
        }
    }
    class St {
        constructor(e) {
            this.batchAddress = e,
            this.arrayRangeReader = Ct,
            this.arrayBuilderSegmentReader = At,
            this.diffReader = It,
            this.editReader = Nt,
            this.frameReader = Rt
        }
        updatedComponents() {
            return t.readStructField(this.batchAddress, 0)
        }
        referenceFrames() {
            return t.readStructField(this.batchAddress, Ct.structLength)
        }
        disposedComponentIds() {
            return t.readStructField(this.batchAddress, 2 * Ct.structLength)
        }
        disposedEventHandlerIds() {
            return t.readStructField(this.batchAddress, 3 * Ct.structLength)
        }
        updatedComponentsEntry(e, t) {
            return kt(e, t, It.structLength)
        }
        referenceFramesEntry(e, t) {
            return kt(e, t, Rt.structLength)
        }
        disposedComponentIdsEntry(e, n) {
            const r = kt(e, n, 4);
            return t.readInt32Field(r)
        }
        disposedEventHandlerIdsEntry(e, n) {
            const r = kt(e, n, 8);
            return t.readUint64Field(r)
        }
    }
    const Ct = {
        structLength: 8,
        values: e => t.readObjectField(e, 0),
        count: e => t.readInt32Field(e, 4)
    }
      , At = {
        structLength: 12,
        values: e => {
            const n = t.readObjectField(e, 0)
              , r = t.getObjectFieldsBaseAddress(n);
            return t.readObjectField(r, 0)
        }
        ,
        offset: e => t.readInt32Field(e, 4),
        count: e => t.readInt32Field(e, 8)
    }
      , It = {
        structLength: 4 + At.structLength,
        componentId: e => t.readInt32Field(e, 0),
        edits: e => t.readStructField(e, 4),
        editsEntry: (e, t) => kt(e, t, Nt.structLength)
    }
      , Nt = {
        structLength: 20,
        editType: e => t.readInt32Field(e, 0),
        siblingIndex: e => t.readInt32Field(e, 4),
        newTreeIndex: e => t.readInt32Field(e, 8),
        moveToSiblingIndex: e => t.readInt32Field(e, 8),
        removedAttributeName: e => t.readStringField(e, 16)
    }
      , Rt = {
        structLength: 36,
        frameType: e => t.readInt16Field(e, 4),
        subtreeLength: e => t.readInt32Field(e, 8),
        elementReferenceCaptureId: e => t.readStringField(e, 16),
        componentId: e => t.readInt32Field(e, 12),
        elementName: e => t.readStringField(e, 16),
        textContent: e => t.readStringField(e, 16),
        markupContent: e => t.readStringField(e, 16),
        attributeName: e => t.readStringField(e, 16),
        attributeValue: e => t.readStringField(e, 24, !0),
        attributeEventHandlerId: e => t.readUint64Field(e, 8)
    };
    function kt(e, n, r) {
        return t.getArrayEntryPtr(e, n, r)
    }
    const Dt = /^\s*Blazor-WebAssembly-Component-State:(?<state>[a-zA-Z0-9+/=]+)$/;
    function _t(e) {
        return Tt(e, Dt)
    }
    function Tt(e, t, n="state") {
        if (e.nodeType === Node.COMMENT_NODE) {
            const r = e.textContent || ""
              , o = t.exec(r)
              , i = o && o.groups && o.groups[n];
            return i && e.parentNode?.removeChild(e),
            i
        }
        if (!e.hasChildNodes())
            return;
        const r = e.childNodes;
        for (let e = 0; e < r.length; e++) {
            const o = Tt(r[e], t, n);
            if (o)
                return o
        }
    }
    function Ft(e, t) {
        const n = []
          , r = new $t(e.childNodes);
        for (; r.next() && r.currentElement; ) {
            const e = Ot(r, t);
            if (e)
                n.push(e);
            else if (r.currentElement.hasChildNodes()) {
                const e = Ft(r.currentElement, t);
                for (let t = 0; t < e.length; t++) {
                    const r = e[t];
                    n.push(r)
                }
            }
        }
        return n
    }
    const Lt = new RegExp(/^\s*Blazor:[^{]*(?<descriptor>.*)$/);
    function Ot(e, t) {
        const n = e.currentElement;
        var r, o, i;
        if (n && n.nodeType === Node.COMMENT_NODE && n.textContent) {
            const s = Lt.exec(n.textContent)
              , a = s && s.groups && s.groups.descriptor;
            if (!a)
                return;
            !function(e) {
                if (e.parentNode instanceof Document)
                    throw new Error("Root components cannot be marked as interactive. The <html> element must be rendered statically so that scripts are not evaluated multiple times.")
            }(n);
            try {
                const s = function(e) {
                    const t = JSON.parse(e)
                      , {type: n} = t;
                    if ("server" !== n && "webassembly" !== n && "auto" !== n)
                        throw new Error(`Invalid component type '${n}'.`);
                    return t
                }(a)
                  , c = function(e, t, n) {
                    const {prerenderId: r} = e;
                    if (r) {
                        for (; n.next() && n.currentElement; ) {
                            const e = n.currentElement;
                            if (e.nodeType !== Node.COMMENT_NODE)
                                continue;
                            if (!e.textContent)
                                continue;
                            const t = Lt.exec(e.textContent)
                              , o = t && t[1];
                            if (o)
                                return zt(o, r),
                                e
                        }
                        throw new Error(`Could not find an end component comment for '${t}'.`)
                    }
                }(s, n, e);
                if (t !== s.type)
                    return;
                switch (s.type) {
                case "webassembly":
                    return o = n,
                    i = c,
                    Jt(r = s),
                    {
                        ...r,
                        uniqueId: jt++,
                        start: o,
                        end: i
                    };
                case "server":
                    return function(e, t, n) {
                        return Ht(e),
                        {
                            ...e,
                            uniqueId: jt++,
                            start: t,
                            end: n
                        }
                    }(s, n, c);
                case "auto":
                    return function(e, t, n) {
                        return Ht(e),
                        Jt(e),
                        {
                            ...e,
                            uniqueId: jt++,
                            start: t,
                            end: n
                        }
                    }(s, n, c)
                }
            } catch (e) {
                throw new Error(`Found malformed component comment at ${n.textContent}`)
            }
        }
    }
    let Mt, xt, Pt, Bt, jt = 0;
    function Ht(e) {
        const {descriptor: t, sequence: n} = e;
        if (!t)
            throw new Error("descriptor must be defined when using a descriptor.");
        if (void 0 === n)
            throw new Error("sequence must be defined when using a descriptor.");
        if (!Number.isInteger(n))
            throw new Error(`Error parsing the sequence '${n}' for component '${JSON.stringify(e)}'`)
    }
    function Jt(e) {
        const {assembly: t, typeName: n} = e;
        if (!t)
            throw new Error("assembly must be defined when using a descriptor.");
        if (!n)
            throw new Error("typeName must be defined when using a descriptor.");
        e.parameterDefinitions = e.parameterDefinitions && atob(e.parameterDefinitions),
        e.parameterValues = e.parameterValues && atob(e.parameterValues)
    }
    function zt(e, t) {
        const n = JSON.parse(e);
        if (1 !== Object.keys(n).length)
            throw new Error(`Invalid end of component comment: '${e}'`);
        const r = n.prerenderId;
        if (!r)
            throw new Error(`End of component comment must have a value for the prerendered property: '${e}'`);
        if (r !== t)
            throw new Error(`End of component comment prerendered property must match the start comment prerender id: '${t}', '${r}'`)
    }
    class $t {
        constructor(e) {
            this.childNodes = e,
            this.currentIndex = -1,
            this.length = e.length
        }
        next() {
            return this.currentIndex++,
            this.currentIndex < this.length ? (this.currentElement = this.childNodes[this.currentIndex],
            !0) : (this.currentElement = void 0,
            !1)
        }
    }
    class Wt {
        constructor(e) {
            this.componentManager = e
        }
        resolveRegisteredElement(e) {
            const t = Number.parseInt(e);
            if (!Number.isNaN(t))
                return function(e) {
                    const {start: t, end: n} = e
                      , r = t[P];
                    if (r) {
                        if (r !== e)
                            throw new Error("The start component comment was already associated with another component descriptor.");
                        return t
                    }
                    const o = t.parentNode;
                    if (!o)
                        throw new Error(`Comment not connected to the DOM ${t.textContent}`);
                    const i = B(o, !0)
                      , s = K(i);
                    t[x] = i,
                    t[P] = e;
                    const a = B(t);
                    if (n) {
                        const e = K(a)
                          , r = Array.prototype.indexOf.call(s, a) + 1;
                        let o = null;
                        for (; o !== n; ) {
                            const n = s.splice(r, 1)[0];
                            if (!n)
                                throw new Error("Could not find the end component comment in the parent logical node list");
                            n[x] = t,
                            e.push(n),
                            o = n
                        }
                    }
                    return a
                }(this.componentManager.resolveRootComponent(t))
        }
        getParameterValues(e) {
            return this.componentManager.initialComponents[e].parameterValues
        }
        getParameterDefinitions(e) {
            return this.componentManager.initialComponents[e].parameterDefinitions
        }
        getTypeName(e) {
            return this.componentManager.initialComponents[e].typeName
        }
        getAssembly(e) {
            return this.componentManager.initialComponents[e].assembly
        }
        getCount() {
            return this.componentManager.initialComponents.length
        }
    }
    new Promise((e => {
        Bt = e
    }
    ));
    const Ut = new Promise((e => {}
    ));
    let Kt;
    const Vt = new Promise((e => {
        Kt = e
    }
    ));
    function Xt(e) {
        if (Mt)
            throw new Error("WebAssembly options have already been configured.");
        !async function(e) {
            const t = await e;
            Mt = t,
            Kt()
        }(e)
    }
    function Yt(e) {
        if (void 0 !== Pt)
            throw new Error("Blazor WebAssembly has already started.");
        return Pt = new Promise(qt.bind(null, e)),
        Pt
    }
    async function qt(e, n, r) {
        (function() {
            if (window.parent !== window && !window.opener && window.frameElement) {
                const e = window.sessionStorage && window.sessionStorage["Microsoft.AspNetCore.Components.WebAssembly.Authentication.CachedAuthSettings"]
                  , t = e && JSON.parse(e);
                return t && t.redirect_uri && location.href.startsWith(t.redirect_uri)
            }
            return !1
        }
        )() && await new Promise(( () => {}
        ));
        const o = Gt();
        !function() {
            const e = R;
            R = (t, n, r) => {
                ( (e, t, n) => {
                    const r = function(e) {
                        return he[e]
                    }(e);
                    r?.eventDelegator.getHandler(t) && pt.invokeWhenHeapUnlocked(n)
                }
                )(t, n, ( () => e(t, n, r)))
            }
        }(),
        Qe._internal.applyHotReload = (e, t, n, r, o) => {
            ut.invokeDotNetStaticMethod("Microsoft.AspNetCore.Components.WebAssembly", "ApplyHotReloadDelta", e, t, n, r, o ?? null)
        }
        ,
        Qe._internal.getApplyUpdateCapabilities = () => ut.invokeDotNetStaticMethod("Microsoft.AspNetCore.Components.WebAssembly", "GetApplyUpdateCapabilities"),
        Qe._internal.invokeJSJson = Zt,
        Qe._internal.endInvokeDotNetFromJS = Qt,
        Qe._internal.receiveWebAssemblyDotNetDataStream = en,
        Qe._internal.receiveByteArray = tn;
        const i = (t = pt,
        t);
        Qe.platform = i,
        Qe._internal.renderBatch = (e, t) => {
            const n = pt.beginHeapLock();
            try {
                !function(e, t) {
                    const n = he[e];
                    if (!n)
                        throw new Error(`There is no browser renderer with ID ${e}.`);
                    const r = t.arrayRangeReader
                      , o = t.updatedComponents()
                      , i = r.values(o)
                      , s = r.count(o)
                      , a = t.referenceFrames()
                      , c = r.values(a)
                      , l = t.diffReader;
                    for (let e = 0; e < s; e++) {
                        const r = t.updatedComponentsEntry(i, e)
                          , o = l.componentId(r)
                          , s = l.edits(r);
                        n.updateComponent(t, o, s, c)
                    }
                    const u = t.disposedComponentIds()
                      , d = r.values(u)
                      , f = r.count(u);
                    for (let e = 0; e < f; e++) {
                        const r = t.disposedComponentIdsEntry(d, e);
                        n.disposeComponent(r)
                    }
                    const m = t.disposedEventHandlerIds()
                      , h = r.values(m)
                      , p = r.count(m);
                    for (let e = 0; e < p; e++) {
                        const r = t.disposedEventHandlerIdsEntry(h, e);
                        n.disposeEventHandler(r)
                    }
                    be && (be = !1,
                    window.scrollTo && window.scrollTo(0, 0))
                }(e, new St(t))
            } finally {
                n.release()
            }
        }
        ,
        Qe._internal.navigationManager.listenForNavigationEvents(at.WebAssembly, (async (e, t, n) => {
            await ut.invokeDotNetStaticMethodAsync("Microsoft.AspNetCore.Components.WebAssembly", "NotifyLocationChanged", e, t, n)
        }
        ), (async (e, t, n, r) => {
            const o = await ut.invokeDotNetStaticMethodAsync("Microsoft.AspNetCore.Components.WebAssembly", "NotifyLocationChangingAsync", t, n, r);
            Qe._internal.navigationManager.endLocationChanging(e, o)
        }
        ));
        const s = new Wt(e);
        Qe._internal.registeredComponents = {
            getRegisteredComponentsCount: () => s.getCount(),
            getAssembly: e => s.getAssembly(e),
            getTypeName: e => s.getTypeName(e),
            getParameterDefinitions: e => s.getParameterDefinitions(e) || "",
            getParameterValues: e => s.getParameterValues(e) || ""
        },
        Qe._internal.getPersistedState = () => _t(document) || "",
        Qe._internal.getInitialComponentsUpdate = () => Ut,
        Qe._internal.updateRootComponents = e => Qe._internal.dotNetExports?.UpdateRootComponentsCore(e),
        Qe._internal.endUpdateRootComponents = t => e.onAfterUpdateRootComponents?.(t),
        Qe._internal.attachRootComponentToElement = (e, t, n) => {
            const r = s.resolveRegisteredElement(e);
            r ? ye(n, r, t, !1) : function(e, t, n) {
                const r = "::before";
                let o = !1;
                if (e.endsWith("::after"))
                    e = e.slice(0, -7),
                    o = !0;
                else if (e.endsWith(r))
                    throw new Error(`The '${r}' selector is not supported.`);
                const i = function(e) {
                    const t = h.get(e);
                    if (t)
                        return h.delete(e),
                        t
                }(e) || document.querySelector(e);
                if (!i)
                    throw new Error(`Could not find any element matching selector '${e}'.`);
                ye(n, B(i, !0), t, o)
            }(e, t, n)
        }
        ;
        try {
            await o,
            await i.start()
        } catch (e) {
            throw new Error(`Failed to start platform. Reason: ${e}`)
        }
        i.callEntryPoint(),
        mt.invokeAfterStartedCallbacks(Qe),
        n()
    }
    function Gt() {
        return xt ??= (async () => {
            await Vt;
            const e = Mt ?? {}
              , t = Mt?.configureRuntime;
            e.configureRuntime = e => {
                t?.(e)
            }
            ,
            await pt.load(e, Bt)
        }
        )(),
        xt
    }
    function Zt(e, t, n, r, o) {
        return 0 !== o ? (ut.beginInvokeJSFromDotNet(o, e, r, n, t),
        null) : ut.invokeJSFromDotNet(e, r, n, t)
    }
    function Qt(e, t, n) {
        ut.endInvokeDotNetFromJS(e, t, n)
    }
    function en(e, t, n, r) {
        !function(e, t, n, r, o) {
            let i = Ze.get(t);
            if (!i) {
                const n = new ReadableStream({
                    start(e) {
                        Ze.set(t, e),
                        i = e
                    }
                });
                e.supplyDotNetStream(t, n)
            }
            o ? (i.error(o),
            Ze.delete(t)) : 0 === r ? (i.close(),
            Ze.delete(t)) : i.enqueue(n.length === r ? n : n.subarray(0, r))
        }(ut, e, t, n, r)
    }
    function tn(e, t) {
        ut.receiveByteArray(e, t)
    }
    class nn {
        constructor(e) {
            this.initialComponents = e
        }
        resolveRootComponent(e) {
            return this.initialComponents[e]
        }
    }
    class rn {
        constructor() {
            this._eventListeners = new Map
        }
        static create(e) {
            const t = new rn;
            return e.addEventListener = t.addEventListener.bind(t),
            e.removeEventListener = t.removeEventListener.bind(t),
            t
        }
        addEventListener(e, t) {
            let n = this._eventListeners.get(e);
            n || (n = new Set,
            this._eventListeners.set(e, n)),
            n.add(t)
        }
        removeEventListener(e, t) {
            this._eventListeners.get(e)?.delete(t)
        }
        dispatchEvent(e, t) {
            const n = this._eventListeners.get(e);
            if (!n)
                return;
            const r = {
                ...t,
                type: e
            };
            for (const e of n)
                e(r)
        }
    }
    let on = !1;
    async function sn(e) {
        if (on)
            throw new Error("Blazor has already started.");
        on = !0,
        Xt(Promise.resolve(e || {})),
        rn.create(Qe);
        const t = Ft(document, "webassembly")
          , n = new nn(t);
        await Yt(n)
    }
    Qe.start = sn,
    window.DotNet = e,
    document && document.currentScript && "false" !== document.currentScript.getAttribute("autostart") && sn().catch(vt)
}();
