import { SphereProps, useSphere, useSpring } from "@react-three/cannon"
import { useThree } from "@react-three/fiber"
import { forwardRef, RefObject, useEffect, useRef, useState } from "react"
import { BufferAttribute, Object3D } from "three"

const balloonDistanz = 7

const balloonColors = ["#e74783", "#ff48c2", "#e70074"]

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
            position={[(balloonDistanz / balloons.length / 2) + (balloonDistanz / balloons.length * i) - (balloonDistanz / 2), 2, 0]}
            mass={.5}
            linearDamping={0.7} />)}
        <Anchor
            position={[0, -4, 0]}
            ref={anchorRef} />
    </>
}

const Balloon = ({ anchorRef, ...props }: SphereProps & { anchorRef: RefObject<Object3D> }) => {
    const [color, setColor] = useState(Math.floor(balloonColors.length * Math.random()))
    const [balloonRef, balloonApi] = useSphere(() => ({ ...props }))

    const [spring, setSpring] = useState(Math.random() * 2 + 2)
    useSpring(anchorRef, balloonRef, { damping: 1, restLength: spring, stiffness: 4 })

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
            onDoubleClick={() => {
                const newColor = (color+1) % balloonColors.length
                console.log(newColor)
                setColor(newColor )
            }}
            onPointerMove={event => {
                if (event.nativeEvent.buttons > 0) {
                    balloonApi.position.set((event.spaceX * viewport.width) / 2, (event.spaceY * viewport.height) / 2, 0)
                }
            }} >
            <sphereBufferGeometry />
            <meshLambertMaterial color={balloonColors[color]} />
        </mesh >
        <line
            //@ts-ignore
            ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial color={"#a70090"} linewidth={3} />
        </line>
    </>
}

const Anchor = forwardRef<Object3D, SphereProps>((props, ref) => {
    useSphere(() => ({ type: "Kinematic", ...props, args: [.1] }), ref)

    return <mesh
        ref={ref}>
        <sphereGeometry args={[.1]} />
        <meshStandardMaterial color="#000000" />
    </mesh>
})

Anchor.displayName = 'Anchor';