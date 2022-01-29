import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, SSAO } from '@react-three/postprocessing'
import type { NextPage } from 'next'
import AnchoredBaloon from '../components/AnchoredBaloon'

const Home: NextPage = () => {
  return (
    <div style={{
      height: "500px"
    }}>
      <Canvas
        frameloop="demand"
        shadows
        gl={{ stencil: false, depth: false, alpha: false, antialias: false }}
        camera={{ position: [0, 0, 10], fov: 50, near: 1, far: 40 }}
      >
        <fog attach="fog" args={["red", 25, 40]} />
        <color attach="background" args={["#ffdd41"]} />
        <ambientLight intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <directionalLight
          castShadow
          intensity={2}
          position={[50, 50, 25]}
          shadow-mapSize={[256, 256]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Physics gravity={[0, 9.8, 0]} axisIndex={2}>
          <AnchoredBaloon
            count={3}
          />
        </Physics>
        <EffectComposer multisampling={0}>
          <SSAO samples={2} radius={2} intensity={10} luminanceInfluence={0.6} color="red" />
          <Bloom intensity={.5} kernelSize={2} luminanceThreshold={0.8} luminanceSmoothing={0.0} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default Home
