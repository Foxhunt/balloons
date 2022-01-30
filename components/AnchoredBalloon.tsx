import { SphereProps, useSphere, useSpring } from "@react-three/cannon"
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber"
import { forwardRef, RefObject, useEffect, useRef, useState } from "react"
import { BufferAttribute, Object3D } from "three"

const balloonDistanz = 7

interface props {
    count?: number
}

export default function AnchoredBalloon({ count = 1 }: props) {
    const anchorRef = useRef<Object3D>(null)
    const balloons = (new Array(count)).fill("")

    return <>
        {balloons.map((_, i) => <Balloon
            key={i}
            anchorRef={anchorRef}
            position={[(balloonDistanz / balloons.length / 2) + (balloonDistanz / balloons.length * i) - (balloonDistanz / 2), 0, 0]}
            mass={.5}
            linearDamping={0.7} />)}
        <Anchor
            position={[0, -4, 0]}
            ref={anchorRef} />
    </>
}

const Balloon = ({ anchorRef, ...props }: SphereProps & { anchorRef: RefObject<Object3D> }) => {
    const [balloonRef, balloonApi] = useSphere(() => ({ ...props }))
    useSpring(anchorRef, balloonRef, { damping: 1, restLength: Math.random() * 2 + 1, stiffness: 4 })

    const lineRef = useRef<Object3D>(null)

    useEffect(() => {
        balloonApi.position.subscribe(postition => {
            const balloonPosition = postition
            const anchorPosition = anchorRef.current?.position

            //@ts-ignore
            const vertices = new Float32Array([...Object.values(balloonPosition), ...Object.values(anchorPosition)])
            //@ts-ignore
            lineRef.current?.geometry.setAttribute('position', new BufferAttribute(vertices, 3))
        })
    }, [anchorRef, balloonApi.position])

    const { viewport } = useThree()

    return <>
        <mesh
            ref={balloonRef}
            castShadow
            receiveShadow
            onPointerMove={event => {
                if (event.nativeEvent.buttons > 0) {
                    balloonApi.position.set((event.spaceX * viewport.width) / 2, (event.spaceY * viewport.height) / 2, 0)
                }
            }} >
            <sphereBufferGeometry />
            <meshLambertMaterial color="#ff7b00" />
        </mesh >
        <line
            //@ts-ignore
            ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color={"#000000"} linewidth={3} />
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

Anchor.displayName = 'Anchor';