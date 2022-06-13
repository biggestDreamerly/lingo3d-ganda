import { Client } from "colyseus.js"
import { types, createProxy, loop } from "lingo3d-vue"
import { reactive, Ref, watchEffect, ref, watch, toRefs } from "vue"

export default (dummyRef: Ref<types.Dummy | undefined>, Token: any) => {
    const client = new Client("ws://localhost:2567")
    const state = reactive<any | undefined>({
        dummyProxies: {}
    })
    const dummyProxies = ref<Record<string, types.Dummy>>({})
    watchEffect(async cleanup => {
        const dummy = dummyRef.value
        if (!dummy) return

        const room = await client.joinOrCreate<any>("my_room")

        room.state.players.onAdd = (player: any, sessionId: string) => {
            console.log("player joined", player)

            const isMe = room.sessionId === sessionId
            if (isMe) {
                console.log("I am", sessionId)
                return
            }
            const dummyProxy = state.dummyProxies[sessionId] = createProxy<any>()
            player.onChange = () => {
                Object.assign(dummyProxy, player)
                console.log(state.dummyProxies, "  dummyProxies.value")
            }
        }
        watch(dummyProxies, (newProps, oldProps) => {
            console.error(newProps, "dummyProxies to hook ");
        },
            {
                deep: true
            });
        room.state.players.onRemove = (_: any, sessionId: string) => {
            console.log("player left", sessionId)

            delete state.dummyProxies[sessionId]
        }

        const handle = loop(() => {
            const { x, y, z, rotationX, rotationY, rotationZ, animation } = dummy
            const { Types } = Token
            room.send("updatePlayer", { x, y, z, rotationX, rotationY, rotationZ, animation, Types })
        })

        cleanup(() => {
            handle.cancel()
            room.leave()
        })
    })

    return state


}