      /*
     Copyright @ibadifal .
     Script For Bypass Tampering and Signature NP Manager (Beta)
     */

      Java.performNow(function() {

          var HSA = 1973526940

          var OriginSign = "308203473082022fa003020102020427232e58300d06092a864886f70d01010b050030543110300e060355040813076a69616e677375310f300d0603550407130673757a686f75310e300c060355040a13056368696e61310e300c060355040b13056368696e61310f300d060355040313066c69756a756e301e170d3231303330383133343434325a170d3436303330323133343434325a30543110300e060355040813076a69616e677375310f300d0603550407130673757a686f75310e300c060355040a13056368696e61310e300c060355040b13056368696e61310f300d060355040313066c69756a756e30820122300d06092a864886f70d01010105000382010f003082010a0282010100cfe3fc296fe43afffc89a0b3858b33f2b1e26ebfc3c375f18f10a79615f71e9ff24b6b3389cd6e61df9cceef4de88e881437e0ed7c6953af6ad54b1fcc0da54acfa49ba1683631621fe06daf15993d67352ec74dab64b7eaaa12771c5d35046908b7968fa74532e8413b8fb10c81f6cce52c77260652761e8e1b3f0819fb9e81a45df863e45d4e13e8fae6ec4aa32d469e0966544060f290ab22d022727e60307517e6f922152de7be5278fc2e7e3a8f4e0ca3f2699d964f03571ff8f186a57000b7aa908bcb30bc6004f8506bdbed9484b385f512eacbae3b2717d0c2862be7471a37d665def875bbf6fc8b0a6dccc4b9270311cb8ee11f861f7c55f962454d0203010001a321301f301d0603551d0e0416041446ccce120a91fc6d577e7904af21b485cc1480ed300d06092a864886f70d01010b05000382010100ba1ab750fbedc22af87a9b3ccfa0ca725637bcd8f5f76924c375174501006fec4c0cfbf362662491447918463ccba98bb037e1c11e5766fae1ac5b947e61fd5b52d76a1b70525b38726f02eeb90ab0a8d0b19db341dffa2e1877d648bc5c4d0de45a861fa87f6ace580858c770a34ba54d4bc61bddacdbb043653fad3e9130d44de2aec6bcee01c495d2d42b65fefd68ee9aa25220a589f1d062139239cebb755c14e63a4271c62c157e5d7a13611d53d312f14d98f4cdc16af2bcf46a66bd6fd833b43bef0cb97b5974efc11b5cc1ed045cb6b95d4fca39082fa595845798052dc399d61da8043e867b07fdc2a4dd91453332cededfa061582394204646dd83"

          try {

              function HexToArray() {
                  var output = Java.array('byte', HexToByte(OriginSign));
                  return output;
              }

              function ToChar() {
                  var ArraySignChar = Array.from(OriginSign);
                  return ArraySignChar;
              }

              function HexToByte(hex) {
                  for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
                  return bytes;
              }
              var ValidSign = Java.use("java.security.Signature");
              ValidSign.verify.overload("[B")
                  .implementation = function(by) {
                  return true;
              }


              var PmsHook = Java.use("android.content.pm.Signature");

              PmsHook["toByteArray"].overload()
                  .implementation = function() {
                  var OriginArray = HexToArray();

                  return OriginArray;
              };
              PmsHook["hashCode"].overload()
                  .implementation = function() {
                  var ret = this["hashCode"]();
                  return HSA;

              }
              PmsHook["toCharsString"].overload()
                  .implementation = function() {

                  return OriginSign;
              }
          } catch (e) {}
      })



       var oke = 0
       Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
          onEnter: function(args) {
              var library = Memory.readCString(args[0]);
              if (library.includes("lib")) {
                  oke = 1
                  console.warn("Loading : " + library);
              }
          },
          onLeave: function(rett) {
              var HookPtr = Module.findExportByName(null, "fgetc")
              Interceptor.attach(HookPtr, {
                  onEnter: function(args) {
                      //TODO
                  }
              })
          }
      })

          function hook_libart() {

              var symbols = Module.enumerateSymbolsSync("libart.so");
              var addrGetStringUTFChars = null;
              var addrRegisterNatives = null;
              var Hook = 0
              for (var i = 0; i < symbols.length; i++) {
                  var symbol = symbols[i];
                  if (symbol.name.indexOf("art") >= 0 && symbol.name.indexOf("JNI") >= 0 && symbol.name.indexOf("CheckJNI") < 0 && symbol.name.indexOf("_ZN3art3JNIILb0") >= 0) {
                      if (symbol.name.indexOf("GetStringUTFChars") >= 0) {
                          addrGetStringUTFChars = symbol.address;
                          console.log("GetStringUTFChars is at ", symbol.address, symbol.name);
                      }

                  }
              }

              if (addrGetStringUTFChars != null) {
                  Interceptor.attach(addrGetStringUTFChars, {
                      onEnter: function(args) {},
                      onLeave: function(retval) {
                          if (retval != null) {
                              var module = Process.findModuleByAddress(this.returnAddress);
                              try {
                                  if (module.name.indexOf("runtime") >= 0) {

                                      var ret = retval.readCString()

                                      if (ret.includes("base.apk") && ret.indexOf("google") == -1) {
                                          retval.writeUtf8String("/data/user/0/com.wn.app.np/OriginalApk.apk")
                                      }

                                  }
                              } catch {}
                          }
                      }
                  });
              }

          }
      // setImmediate(hook_libart);