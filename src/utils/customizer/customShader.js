import * as THREE from 'three'

var r =
  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
    ? function (t) {
        return typeof t
      }
    : function (t) {
        return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t
      }

function i(t, e) {
  var n = ''
  switch (e) {
    case 'vec4':
      n = ',' + (4 <= t.length ? t[3] : 0) + n
    case 'vec3':
      n = ',' + (3 <= t.length ? t[2] : 0) + n
    case 'vec2':
      n = ',' + (2 <= t.length ? t[1] : 0) + n
    case 'default':
      n = '' + (1 <= t.length ? t[0] : 0) + n
  }
  return n
}

export const customShader = function (t) {
  var e = t.material,
    n = t.shaders,
    o = t.uniforms,
    s = THREE
  if (n && e) {
    var a = ''
    if (
      (['vertex', 'fragment'].forEach(function (t) {
        var e = ''
        if (n[t])
          for (var i in n[t])
            if ('object' === r(n[t][i])) {
              var o = ''
              for (var s in n[t][i]) o += n[t][i][s].replace(/\n/g, '\\n').replace(/\'/g, "\\'")
              e += ".replace('#include <" + i + ">', '" + o + "')"
            } else e += ".replace('#include <" + i + ">', '" + n[t][i].replace(/\n/g, '\\n').replace(/\'/g, "\\'") + "')"
        a += 'shader.' + t + 'Shader = shader.' + t + 'Shader' + e + ';\n'
      }),
      n.defines)
    )
      for (var c in n.defines) {
        var l = new RegExp('\\${' + c + '}', 'g'),
          u = e[c],
          h = n.defines[c].type,
          f = h + '(' + i(n.defines[c].default.split(','), h) + ')'
        ;(f =
          u instanceof s.Color
            ? h + '(' + i([u.r, u.g, u.b], h) + ')'
            : u instanceof s.Vector2 || u instanceof s.Vector3 || u instanceof s.Vector4
            ? h + '(' + i(u.toArray(), h) + ')'
            : 'number' == typeof u
            ? '' + u
            : 'float' == h
            ? '' + i(n.defines[c].default.split(','), h)
            : h + '(' + i(n.defines[c].default.split(','), h) + ')'),
          (a = a.replace(l, f))
      }
    for (var d in (o = o || {})) {
      var p = ''
      switch (o[d].type) {
        case 'i':
          p = 'int ${name}'
          break
        case 'f':
          p = 'float ${name}'
          break
        case 'v2':
          p = 'vec2 ${name}'
          break
        case 'v3':
          p = 'vec3 ${name}'
          break
        case 'v4':
          p = 'vec4 ${name}'
          break
        case 'c':
          p = 'vec3 ${name}'
          break
        case 'm4':
          p = 'mat4 ${name}'
          break
        case 't':
          p = 'sampler2D ${name}'
          break
        case 't3':
          p = 'sampler2DCube ${name}'
          break
        case 'iv1':
          p = 'int ${name}[${size}]'
          break
        case 'iv':
          p = 'ivec3 ${name}[${size}]'
          break
        case 'fv1':
          p = 'float ${name}[${size}]'
          break
        case 'fv':
          p = 'vec3 ${name}[${size}]'
          break
        case 'v2v':
          p = 'vec2 ${name}[${size}]'
          break
        case 'v3v':
          p = 'vec3 ${name}[${size}]'
          break
        case 'v4v':
          p = 'vec4 ${name}[${size}]'
          break
        case 'm4v':
          p = 'mat4 ${name}[${size}]'
          break
        case 'tv':
          p = 'sampler2D ${name}[${size}]'
      }
      ;(a += 'shader.vertexShader = "uniform ' + p.replace('${name}', d).replace('${size}', o[d].size) + ';\\n" + shader.vertexShader;\n'),
        (a += 'shader.fragmentShader = "uniform ' + p.replace('${name}', d).replace('${size}', o[d].size) + ';\\n" + shader.fragmentShader;\n')
    }
    ;(a += 'this.shader = shader;\n'),
      (a += 'if (typeof this.uniforms === "object" && this.uniforms !== null) {\n'),
      (a += '  for (let uniform in this.uniforms) {\n'),
      (a += '    this.shader.uniforms[uniform] = {type:this.uniforms[uniform].type, value:this.uniforms[uniform].value};\n'),
      (a += '  }\n'),
      (a += '}\n'),
      (e.uniforms = o),
      (e.onBeforeCompile = new Function('shader', a)),
      (e.needsUpdate = !0)
  }
  return e
}
