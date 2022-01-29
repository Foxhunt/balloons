import { SphereProps, useSphere, useSpring } from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"
import { forwardRef, RefObject, useRef, useState } from "react"
import { Object3D } from "three"

interface props {
    count?: number
}

export default function AnchoredBaloon({ count = 1 }: props) {
    const anchorRef = useRef<Object3D>(null)
    const balloons = (new Array(count)).fill("")

    return <group>
        {balloons.map((_, i) => <Baloon
            key={i}
            anchorRef={anchorRef}
            position={[10 / balloons.length * i - 5, 3, 0]}
            mass={.5}
            linearDamping={0.7} />)}
        <Anchor
            ref={anchorRef} />
    </group >
}

const Baloon = ({ anchorRef, ...props }: SphereProps & { anchorRef: RefObject<Object3D> }) => {
    const [ballonRef, ballonApi] = useSphere(() => ({ ...props }))
    useSpring(anchorRef, ballonRef, { damping: 1, restLength: 2, stiffness: 4 })

    const [isDown, setIsDown] = useState(false)
    useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
        if (isDown) {
            ballonApi.position.set((x * width) / 2, (y * height) / 2, 0)
        }
    })

    return <mesh
        ref={ballonRef}
        castShadow
        receiveShadow
        onPointerDown={() => setIsDown(true)}
        onPointerUp={() => setIsDown(false)} >
        <sphereBufferGeometry />
        <meshLambertMaterial color="#ff7b00" />
    </mesh >
}

const Anchor = forwardRef<Object3D, SphereProps>((props, ref) => {
    useSphere(() => ({ type: "Kinematic", ...props }), ref)

    return <mesh
        ref={ref}
        scale={.5} >
        <sphereGeometry />
        <meshStandardMaterial color="#ffffff" />
    </mesh>
})