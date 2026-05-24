"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL fragment-shader river background.
 *
 * Renders a flowing, multi-octave noise field tinted with Riverline brand
 * colors. Single fullscreen quad, no geometry — all the motion happens in
 * the shader so it stays smooth even on lower-end devices.
 */
export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    // ─── Shaders ─────────────────────────────────────────────
    const vertSrc = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_pointer;

      // ─── 2D simplex noise ───────────────────────
      vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                                + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        for (int i=0; i<5; i++){
          v += a * snoise(p);
          p = p * 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = v_uv;
        vec2 p  = uv;
        p.x *= u_res.x / u_res.y;

        // Slow drift, parallaxed time
        float t = u_time * 0.06;

        // Pointer-aware warp
        vec2 ptr = (u_pointer / u_res);
        ptr.x *= u_res.x / u_res.y;
        float dist = distance(p, ptr);
        float warp = exp(-dist*2.5) * 0.10;

        // Two stacked noise fields → river ribbons
        float n1 = fbm(p*1.6 + vec2(t, t*0.5) + warp);
        float n2 = fbm(p*2.4 + vec2(-t*0.7, t*0.9) + warp*1.5);

        // Brand palette
        vec3 cream  = vec3(0.961, 0.953, 0.933); // page bg
        vec3 lilac  = vec3(0.949, 0.929, 1.000); // soft purple
        vec3 sky    = vec3(0.902, 0.941, 1.000); // soft blue
        vec3 violet = vec3(0.357, 0.184, 0.878); // primary
        vec3 river  = vec3(0.106, 0.435, 0.902); // river

        float band1 = smoothstep(0.10, 0.55, n1);
        float band2 = smoothstep(0.15, 0.60, n2);

        vec3 col = cream;
        col = mix(col, lilac, band1 * 0.55);
        col = mix(col, sky,   band2 * 0.45);
        // Subtle accent ribbons
        col = mix(col, violet, smoothstep(0.78, 0.92, n1) * 0.06);
        col = mix(col, river,  smoothstep(0.78, 0.92, n2) * 0.05);

        // Gentle vignette
        float vig = smoothstep(1.2, 0.4, length(uv - 0.5));
        col *= 0.94 + 0.06 * vig;

        // Tiny grain
        float grain = fract(sin(dot(uv * u_res, vec2(12.9898,78.233))) * 43758.5453);
        col += (grain - 0.5) * 0.012;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.warn("Shader error:", gl!.getShaderInfoLog(sh));
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Fullscreen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");

    let pointer: [number, number] = [0, 0];
    let targetPointer: [number, number] = [0, 0];

    const onPointer = (e: PointerEvent) => {
      targetPointer = [e.clientX, window.innerHeight - e.clientY];
    };
    window.addEventListener("pointermove", onPointer);

    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl!.viewport(0, 0, canvas.width, canvas.height);
      targetPointer = [w / 2, h / 2];
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      // Easing pointer toward target for buttery parallax
      pointer[0] += (targetPointer[0] - pointer[0]) * 0.06;
      pointer[1] += (targetPointer[1] - pointer[1]) * 0.06;

      const elapsed = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(
        uPointer,
        pointer[0] * (window.devicePixelRatio || 1),
        pointer[1] * (window.devicePixelRatio || 1),
      );
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
