// -- List all methods on a thing
// -- for key, value in pairs(mutatron) do
// --     if type(value) == "function" then
// --         print("Method:", key)
// --     end
// -- end

// -- List all items in a storage
// -- local items = mutatron.list()

// -- -- Print the items (this assumes list() returns a table of items)
// -- if items then
// --     for i, item in ipairs(items) do
// --         print("Item " .. i .. ": ", item)
// --     end
// -- else
// --     print("No items found.")
// -- end

// -- -- Print the slots that items exist
// -- if items then
// --     for key, value in pairs(items) do
// --         print(key)
// --     end
// -- else
// --     print("No items found.")
// -- end

// -- Now print items from each mutatron
// -- for _, mutatron in pairs(mutatrons) do

// --     local items = mutatron.list()
// --     -- print("Items in mutatron:", textutils.serialize(items)) -- Debugging output for items

// --     for slot, item in pairs(items) do
// --         if item then
// --             print(string.format("Slot %d: %s (count: %d)", slot, item.name or "No Name", item.count or 0))
// --         else
// --             -- print(string.format("Slot %d: Empty", slot))
// --         end
// --     end
// -- end
