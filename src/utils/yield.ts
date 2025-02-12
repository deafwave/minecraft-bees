
let yieldTime = os.clock()
export const yieldSmart =  () => {
    if (os.clock() - yieldTime > 2) {
        os.queueEvent("yield")
        os.pullEvent()
        yieldTime = os.clock()
    }
}