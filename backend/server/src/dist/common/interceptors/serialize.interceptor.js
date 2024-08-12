"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Serialize: function() {
        return Serialize;
    },
    SerializeInterceptor: function() {
        return SerializeInterceptor;
    }
});
const _common = require("@nestjs/common");
const _classtransformer = require("class-transformer");
const _rxjs = require("rxjs");
let SerializeInterceptor = class SerializeInterceptor {
    intercept(context, handler) {
        return handler.handle().pipe((0, _rxjs.map)((data)=>{
            return (0, _classtransformer.plainToInstance)(this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    }
    constructor(dto){
        this.dto = dto;
    }
};
function Serialize(dto) {
    return (0, _common.UseInterceptors)(new SerializeInterceptor(dto));
}

//# sourceMappingURL=serialize.interceptor.js.map