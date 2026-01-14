varying float vNoise;

void main() {
    vec3 colorDeep = vec3(0.2, 0.0, 0.5); 
    vec3 colorHigh = vec3(0.0, 1.0, 1.0);
    float misStrength = vNoise * 0.5 + 0.5;
    vec3 finalColor = mix(colorDeep, colorHigh, misStrength);
    finalColor += step(0.8, misStrength) * 0.3;
    gl_FragColor = vec4(finalColor, 1.0); 
}