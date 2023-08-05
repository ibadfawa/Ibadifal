/*
Implementation of some Native Function in libc.so
@ibadifal
*/
var fopenPtr = Module.findExportByName("libc.so", "fopen");
var fopen = new NativeFunction(fopenPtr, 'pointer', ['pointer', 'pointer']);

var fgetsPtr = Module.findExportByName("libc.so", "fgets");
var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);

var strstrPtr = Module.findExportByName("libc.so", "strstr");
var strstr = new NativeFunction(strstrPtr, 'pointer', ['pointer', 'pointer']);

var fclosePtr = Module.findExportByName("libc.so", "fclose");
var fclose = new NativeFunction(fclosePtr, 'int', ['pointer']);

var filenoPtr = Module.findExportByName("libc.so", "fileno");
var fileno = new NativeFunction(filenoPtr, 'int', ['pointer']);

var readPtr = Module.getExportByName('libc.so', 'read');
var read = new NativeFunction(readPtr, 'int', ['int', 'pointer', 'int']);

var strlenPtr = Module.findExportByName("libc.so", "strlen");
var strlen = new NativeFunction(strlenPtr, 'size_t', ['pointer']);

var FILE = fopen(Memory.allocUtf8String("/proc/self/maps"), Memory.allocUtf8String("r"))
if (FILE == null) {
    console.log("Failed to open /proc/self/maps\n");
    Interceptor.detachAll()
}
var Fd = fileno(FILE)
var buff = Memory.alloc(256)
while (read(Fd, buff, 256)) {
    if (buff.readCString()
        .includes("Finding_String")) {
        console.warn(buff.readCString())
    }
    fclose(FILE);

}