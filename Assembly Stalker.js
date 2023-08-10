var Terload = null;
var lib = "libfoo.so"
Interceptor.attach(Module.findExportByName("libc.so", "android_dlopen_ext"), {
    onEnter: function(args) {
        var library_path = args[0].readCString();
        if (library_path.indexOf(lib) >= 0) {
            console.warn("[...] Loading library : " + library_path);
            Terload = 1
        }
    },
    onLeave: function(args) {
        if (Terload == 1) {
            var bas = Module.findBaseAddress(lib)
            console.warn("Base Address:", bas)
            Stalk(bas)
        }
    }
})



function Stalk(base_addr) {
    Stalker.follow(Process.getCurrentThreadId(), {
        transform: function(iterator) {
            let instruction = iterator.next();
            do {
                try {
                    if (instruction.toString()
                        .includes("svc")) {
                        console.warn("Asm:", instruction.address.sub(base_addr) + "  | " + instruction)
                        console.log("gmn", gmn(instruction.address))
                    }

                } catch {}
                iterator.keep();
            } while ((instruction = iterator.next()) !== null);

        }
    });
}