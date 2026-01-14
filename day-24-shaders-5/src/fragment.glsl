uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vY;
varying vec3 vNormal;

void main() {

  // base vertical gradient  [vUv.y chi value khali 0 (Black) aste ani var 1 (White) aste.]
  vec3 baseColor = vec3(vUv.y);

  // animated RGB color
  vec3 timeColor = vec3(
  // generates random colors based on time and y position
    sin(uTime + vY) * 0.5 + 0.5,     
    sin(uTime + vY + 2.0) * 0.5 + 0.5,
    sin(uTime + vY + 4.0) * 0.5 + 0.5
    // sin() is a trigonometric function that returns a value between -1 and 1
    // * 0.5 + 0.5 is used to convert the value between 0 and 1 (normalized)
    // +2.0 and +4.0 are used because they should be some variation in clr or else all clrs will change at same time . 
  );
  // //plain black and white shading clrs
  // vec3 timeColor = vec3(1,1,1);

  // energy bands [Step A: Base ani Rainbow mix kara based on Stripes]
  float band = step(0.0, sin(vUv.y * 10.0 + uTime));
  /*
  Logic: Jithe band 1 aahe (Stripe aahe), tithe Rainbow Color disel. Jithe band 0 aahe (Gap aahe), tithe Base Gradient disel.

  Result: Aata tumchya paas Black-White background var Rangit Patte aahet.
  */

  // smooth mouse mask
  float dist = distance(vUv, uMouse);
  float mouseMask = smoothstep(0.4, 0.0, dist)*0.3;

  // blend colors
  vec3 color = mix(baseColor, timeColor, band);   //Jithe Mouse aahe (mouseMask), tithe timeColor (Rainbow) vapra, pan tyala 1.5 times brighter kara.
  color = mix(color, timeColor * 1.5, mouseMask);     //here mouseMask creates glowing effect using mouse position and [1.5] is the strength of the glow

  // safety clamp
  color = clamp(color, 0.0, 5.0);

  gl_FragColor = vec4(color, 1.0);
}
