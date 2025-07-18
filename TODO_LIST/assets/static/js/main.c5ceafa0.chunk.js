(this.webpackJsonpweb = this.webpackJsonpweb || []).push([
  [0],
  {
    24: function (e, t, n) {},
    25: function (e, t, n) {},
    45: function (e, t, n) {
      'use strict';
      n.r(t);
      var r = n(0),
        a = n(1),
        o = n.n(a),
        c = n(18),
        u = n.n(c),
        i = (n(24), n(25), n(4)),
        s = n.n(i),
        d = n(5),
        l = n(2),
        b = n(6),
        f = n.n(b),
        j = 'http://'.concat(location.host) + '/api',
        p = {
          getTodos: function () {
            return f.a.get(''.concat(j, '/todos'), {
              headers: {
                authorization: 'Bearer '.concat(localStorage.getItem('token')),
              },
            });
          },
          addTodo: function (e) {
            return f.a.post(
              ''.concat(j, '/todos'),
              { value: e },
              {
                headers: {
                  authorization: 'Bearer '.concat(
                    localStorage.getItem('token')
                  ),
                },
              }
            );
          },
          editTodo: (function () {
            var e = Object(d.a)(
              s.a.mark(function e(t) {
                var n,
                  r,
                  a,
                  o,
                  c = arguments;
                return s.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          ((n = c.length > 1 && void 0 !== c[1] ? c[1] : {}),
                          (r = n.order),
                          (a = n.value),
                          (o = n.done),
                          r || a || void 0 !== o)
                        ) {
                          e.next = 3;
                          break;
                        }
                        return e.abrupt('return');
                      case 3:
                        return e.abrupt(
                          'return',
                          f.a.patch(
                            ''.concat(j, '/todos/').concat(t),
                            { value: a, order: r, done: o },
                            {
                              headers: {
                                authorization: 'Bearer '.concat(
                                  localStorage.getItem('token')
                                ),
                              },
                            }
                          )
                        );
                      case 4:
                      case 'end':
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (t) {
              return e.apply(this, arguments);
            };
          })(),
          deleteTodo: function (e) {
            return f.a.delete(''.concat(j, '/todos/').concat(e), {
              headers: {
                authorization: 'Bearer '.concat(localStorage.getItem('token')),
              },
            });
          },
          register: function (e) {
            var t = e.email,
              n = e.password,
              r = e.confirmPassword,
              a = e.nickname;
            return f.a.post(''.concat(j, '/users'), {
              email: t,
              password: n,
              confirmPassword: r,
              nickname: a,
            });
          },
          login: function (e) {
            var t = e.email,
              n = e.password;
            return f.a.post(''.concat(j, '/auth'), { email: t, password: n });
          },
          getSelf: function () {
            return f.a.get(''.concat(j, '/users/me'), {
              headers: {
                authorization: 'Bearer '.concat(localStorage.getItem('token')),
              },
            });
          },
        },
        h = function (e) {
          var t = Object(a.useState)(!1),
            n = Object(l.a)(t, 2),
            r = n[0],
            o = n[1],
            c = Object(a.useState)(null),
            u = Object(l.a)(c, 2),
            i = u[0],
            b = u[1],
            f = Object(a.useState)(null),
            j = Object(l.a)(f, 2),
            p = j[0],
            h = j[1];
          return [
            Object(a.useCallback)(
              Object(d.a)(
                s.a.mark(function t() {
                  var n,
                    r,
                    a,
                    c = arguments;
                  return s.a.wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              h(null),
                              b(null),
                              o(!0),
                              (t.prev = 3),
                              (t.next = 6),
                              e.apply(void 0, c)
                            );
                          case 6:
                            ((n = t.sent),
                              b(null === n || void 0 === n ? void 0 : n.data),
                              (t.next = 17));
                            break;
                          case 10:
                            if (
                              ((t.prev = 10),
                              (t.t0 = t.catch(3)),
                              400 !==
                                (null === (r = t.t0.response) || void 0 === r
                                  ? void 0
                                  : r.status))
                            ) {
                              t.next = 16;
                              break;
                            }
                            (h(
                              null === (a = t.t0.response) || void 0 === a
                                ? void 0
                                : a.data
                            ),
                              (t.next = 17));
                            break;
                          case 16:
                            throw t.t0;
                          case 17:
                            return ((t.prev = 17), o(!1), t.finish(17));
                          case 20:
                          case 'end':
                            return t.stop();
                        }
                    },
                    t,
                    null,
                    [[3, 10, 17, 20]]
                  );
                })
              ),
              [e]
            ),
            i,
            r,
            p,
          ];
        },
        v =
          (n(7),
          n(9),
          function (e) {
            var t = e.onUp,
              n = e.onDown,
              o = e.onDelete,
              c = e.onChange,
              u = e.done,
              i = e.disabled,
              s = e.children,
              d = Object(a.useState)(!1),
              b = Object(l.a)(d, 2),
              f = b[0],
              j = b[1],
              p = Object(a.useState)(''),
              h = Object(l.a)(p, 2),
              v = h[0],
              O = h[1];
            return Object(r.jsxs)(r.Fragment, {
              children: [
                Object(r.jsx)('input', {
                  type: 'checkbox',
                  checked: u,
                  onChange: function () {
                    return c && c({ done: !u });
                  },
                }),
                !f &&
                  Object(r.jsx)('span', {
                    onDoubleClick: function () {
                      return O(String(s)) || j(!0);
                    },
                    children: s,
                  }),
                f &&
                  Object(r.jsx)('input', {
                    value: v,
                    onChange: function (e) {
                      return O(e.target.value);
                    },
                    onBlur: function () {
                      (v !== String(s) && c && c({ value: v }), j(!1));
                    },
                  }),
                Object(r.jsx)('button', {
                  onClick: function () {
                    return t();
                  },
                  disabled: !t || i,
                  children: 'up',
                }),
                Object(r.jsx)('button', {
                  onClick: function () {
                    return n();
                  },
                  disabled: !n || i,
                  children: 'down',
                }),
                Object(r.jsx)('button', {
                  onClick: function () {
                    return o();
                  },
                  disabled: !o || i,
                  children: '\uc0ad\uc81c',
                }),
              ],
            });
          }),
        O = function () {
          var e = Object(a.useState)(''),
            t = Object(l.a)(e, 2),
            n = t[0],
            o = t[1],
            c = h(p.getTodos),
            u = Object(l.a)(c, 3),
            i = u[0],
            b = u[1],
            f = u[2],
            j = h(p.addTodo),
            O = Object(l.a)(j, 3),
            g = O[0],
            x = O[2],
            m = h(p.editTodo),
            k = Object(l.a)(m, 3),
            w = k[0],
            S = k[2],
            C = h(p.deleteTodo),
            T = Object(l.a)(C, 3),
            B = T[0],
            y = T[2],
            F = f || x || S || y;
          Object(a.useEffect)(
            function () {
              i();
            },
            [i]
          );
          var I = (function () {
              var e = Object(d.a)(
                s.a.mark(function e(t) {
                  return s.a.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (t) {
                            e.next = 3;
                            break;
                          }
                          return (
                            alert(
                              '\uac12\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694'
                            ),
                            e.abrupt('return')
                          );
                        case 3:
                          return ((e.next = 5), g(t));
                        case 5:
                          return ((e.next = 7), i());
                        case 7:
                          o('');
                        case 8:
                        case 'end':
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function (t) {
                return e.apply(this, arguments);
              };
            })(),
            D = (function () {
              var e = Object(d.a)(
                s.a.mark(function e(t, n) {
                  return s.a.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.next = 2), w(t, n));
                        case 2:
                          return ((e.next = 4), i());
                        case 4:
                        case 'end':
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function (t, n) {
                return e.apply(this, arguments);
              };
            })(),
            z = (function () {
              var e = Object(d.a)(
                s.a.mark(function e(t) {
                  return s.a.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.next = 2), B(t));
                        case 2:
                          return ((e.next = 4), i());
                        case 4:
                        case 'end':
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function (t) {
                return e.apply(this, arguments);
              };
            })();
          return Object(r.jsxs)(r.Fragment, {
            children: [
              Object(r.jsx)('input', {
                value: n,
                onChange: function (e) {
                  return o(e.target.value);
                },
              }),
              Object(r.jsx)('button', {
                onClick: function () {
                  return I(n);
                },
                disabled: F,
                children: '\ucd94\uac00',
              }),
              Object(r.jsx)('ul', {
                className: 'list-group',
                children: (
                  (null === b || void 0 === b ? void 0 : b.todos) || []
                ).map(function (e, t) {
                  return Object(r.jsx)(
                    'li',
                    {
                      className: 'list-group-item',
                      children: Object(r.jsx)(v, {
                        onUp:
                          0 !== t &&
                          function () {
                            return D(e.id, { order: e.order + 1 });
                          },
                        onDown:
                          t !==
                            (null === b || void 0 === b
                              ? void 0
                              : b.todos.length) -
                              1 &&
                          function () {
                            return D(e.id, { order: e.order - 1 });
                          },
                        onDelete: function () {
                          return z(e.id);
                        },
                        disabled: F,
                        done: Boolean(e.doneAt),
                        onChange: function (t) {
                          return D(e.id, t);
                        },
                        children: e.value,
                      }),
                    },
                    e.id
                  );
                }),
              }),
            ],
          });
        },
        g = function () {
          return Object(r.jsx)(r.Fragment, { children: Object(r.jsx)(O, {}) });
        };
      var x = function () {
          return Object(r.jsx)('div', {
            className: 'App',
            children: Object(r.jsx)(g, {}),
          });
        },
        m = function (e) {
          e &&
            e instanceof Function &&
            n
              .e(3)
              .then(n.bind(null, 46))
              .then(function (t) {
                var n = t.getCLS,
                  r = t.getFID,
                  a = t.getFCP,
                  o = t.getLCP,
                  c = t.getTTFB;
                (n(e), r(e), a(e), o(e), c(e));
              });
        };
      (u.a.render(
        Object(r.jsx)(o.a.StrictMode, { children: Object(r.jsx)(x, {}) }),
        document.getElementById('root')
      ),
        m());
    },
  },
  [[45, 1, 2]],
]);
//# sourceMappingURL=main.c5ceafa0.chunk.js.map
