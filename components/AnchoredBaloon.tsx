import { SphereProps, useSphere, useSpring } from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"
import { forwardRef, RefObject, useEffect, useRef, useState } from "react"
import { BufferAttribute, Object3D } from "three"

const ballonDistanz = 7

interface props {
    count?: number
}

export default function AnchoredBaloon({ count = 1 }: props) {
    const anchorRef = useRef<Object3D>(null)
    const balloons = (new Array(count)).fill("")

    return <>
        {balloons.map((_, i) => <Baloon
            key={i}
            anchorRef={anchorRef}
            position={[(ballonDistanz / balloons.length / 2) + (ballonDistanz / balloons.length * i) - (ballonDistanz / 2), 0, 0]}
        mass={.5}
        linearDamping={0.7} />)}
        <Anchor
            position={[0, -4, 0]}
            ref={anchorRef} />
    </>
}

const Baloon = ({ anchorRef, ...props }: SphereProps & { anchorRef: RefObject<Object3D> }) => {
    const [ballonRef, ballonApi] = useSphere(() => ({ ...props }))
    useSpring(anchorRef, ballonRef, { damping: 1, restLength: Math.random() * 2 + 1, stiffness: 4 })

    const lineRef = useRef<Object3D>(null)

    const [isDown, setIsDown] = useState(false)
    useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
        if (isDown) {
            ballonApi.position.set((x * width) / 2, (y * height) / 2, 0)
        }
    })

    useEffect(() => {
        ballonApi.position.subscribe(postition => {
            const ballonPosition = postition
            const anchorPosition = anchorRef.current?.position

            const vertices = new Float32Array([...Object.values(ballonPosition), ...Object.values(anchorPosition)])
            lineRef.current?.geometry.setAttribute('position', new BufferAttribute(vertices, 3))
        })
    }, [])

    return <>
        <mesh
            ref={ballonRef}
            castShadow
            receiveShadow
            onPointerDown={() => setIsDown(true)}
            onPointerUp={() => setIsDown(false)} >
            <sphereBufferGeometry />
            <meshLambertMaterial color="#ff7b00" />
        </mesh >
        <line
            ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color={"#000000"} linewidth={30} />
        </line>
    </>
}

const Anchor = forwardRef<Object3D, SphereProps>((props, ref) => {
    useSphere(() => ({ type: "Kinematic", ...props }), ref)

    return <mesh
        ref={ref}
        scale={.2} >
        <sphereGeometry />
        <meshStandardMaterial color="#000000" />
    </mesh>
})