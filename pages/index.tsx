import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, SSAO } from '@react-three/postprocessing'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import AnchoredBalloon from '../components/AnchoredBalloon'

const Home: NextPage = () => {
  const [windDirection, setWindDirection] = useState(.3)
  useEffect(() =>{
    const intervallID = setInterval(() => {
      setWindDirection(direction => direction * -1)
    }, 2500)

    return () => {
      clearInterval(intervallID)
    }
  }, [])

  return (
    <div style={{
      height: "100%"
    }}>
      <Canvas
        frameloop="demand"
        shadows
        gl={{ stencil: false, depth: false, alpha: false, antialias: true }}
        camera={{ position: [0, 0, 10], fov: 50, near: .1, far: 40 }}
      >
        <fog attach="fog" args={["red", 25, 40]} />
        <color attach="background" args={["hsl(330, 91%, 90%)"]} />
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
        <Physics
          gravity={[windDirection, 9.8, 0]} 
          axisIndex={2}>
          <AnchoredBalloon
            count={3}
          />
        </Physics>
        <EffectComposer multisampling={0}>
          <SSAO samples={10} radius={2} intensity={20} luminanceInfluence={2} color="red" />
          <Bloom intensity={.4} kernelSize={4} luminanceThreshold={0.8} luminanceSmoothing={0} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default Home
