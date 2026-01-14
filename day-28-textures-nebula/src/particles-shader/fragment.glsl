void main(){
  float d = distance(gl_PointCoord, vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}