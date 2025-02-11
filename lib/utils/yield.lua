local yieldTime = os.clock()
local function yield()
    if os.clock() - yieldTime > 2 then
        os.queueEvent("yield")
        os.pullEvent()
        yieldTime = os.clock()
    end
end

return yield
