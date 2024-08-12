/**
 * Modified from https://github.com/vercel/ms/blob/main/src/parse.test.ts
 */ "use strict";
const _msutil = require("./ms.util");
describe('parse(string)', ()=>{
    it('should not throw an error', ()=>{
        expect(()=>{
            (0, _msutil.parse)('1m');
        }).not.toThrow();
    });
    it('should preserve ms', ()=>{
        expect((0, _msutil.parse)('100')).toBe(100);
    });
    it('should convert from m to ms', ()=>{
        expect((0, _msutil.parse)('1m')).toBe(60000);
    });
    it('should convert from h to ms', ()=>{
        expect((0, _msutil.parse)('1h')).toBe(3600000);
    });
    it('should convert d to ms', ()=>{
        expect((0, _msutil.parse)('2d')).toBe(172800000);
    });
    it('should convert w to ms', ()=>{
        expect((0, _msutil.parse)('3w')).toBe(1814400000);
    });
    it('should convert s to ms', ()=>{
        expect((0, _msutil.parse)('1s')).toBe(1000);
    });
    it('should convert ms to ms', ()=>{
        expect((0, _msutil.parse)('100ms')).toBe(100);
    });
    it('should convert y to ms', ()=>{
        expect((0, _msutil.parse)('1y')).toBe(31557600000);
    });
    it('should work with ms', ()=>{
        expect((0, _msutil.parse)('1.5h')).toBe(5400000);
    });
    it('should work with multiple spaces', ()=>{
        expect((0, _msutil.parse)('1   s')).toBe(1000);
    });
    it('should return NaN if invalid', ()=>{
        expect(isNaN((0, _msutil.parse)('☃'))).toBe(true);
        expect(isNaN((0, _msutil.parse)('10-.5'))).toBe(true);
        expect(isNaN((0, _msutil.parse)('foo'))).toBe(true);
    });
    it('should be case-insensitive', ()=>{
        expect((0, _msutil.parse)('1.5H')).toBe(5400000);
    });
    it('should work with numbers starting with .', ()=>{
        expect((0, _msutil.parse)('.5ms')).toBe(0.5);
    });
    it('should work with negative integers', ()=>{
        expect((0, _msutil.parse)('-100ms')).toBe(-100);
    });
    it('should work with negative decimals', ()=>{
        expect((0, _msutil.parse)('-1.5h')).toBe(-5400000);
        expect((0, _msutil.parse)('-10.5h')).toBe(-37800000);
    });
    it('should work with negative decimals starting with "."', ()=>{
        expect((0, _msutil.parse)('-.5h')).toBe(-1800000);
    });
});
// long strings
describe('parse(long string)', ()=>{
    it('should not throw an error', ()=>{
        expect(()=>{
            (0, _msutil.parse)('53 milliseconds');
        }).not.toThrow();
    });
    it('should convert milliseconds to ms', ()=>{
        expect((0, _msutil.parse)('53 milliseconds')).toBe(53);
    });
    it('should convert msecs to ms', ()=>{
        expect((0, _msutil.parse)('17 msecs')).toBe(17);
    });
    it('should convert sec to ms', ()=>{
        expect((0, _msutil.parse)('1 sec')).toBe(1000);
    });
    it('should convert from min to ms', ()=>{
        expect((0, _msutil.parse)('1 min')).toBe(60000);
    });
    it('should convert from hr to ms', ()=>{
        expect((0, _msutil.parse)('1 hr')).toBe(3600000);
    });
    it('should convert days to ms', ()=>{
        expect((0, _msutil.parse)('2 days')).toBe(172800000);
    });
    it('should convert weeks to ms', ()=>{
        expect((0, _msutil.parse)('1 week')).toBe(604800000);
    });
    it('should convert years to ms', ()=>{
        expect((0, _msutil.parse)('1 year')).toBe(31557600000);
    });
    it('should work with decimals', ()=>{
        expect((0, _msutil.parse)('1.5 hours')).toBe(5400000);
    });
    it('should work with negative integers', ()=>{
        expect((0, _msutil.parse)('-100 milliseconds')).toBe(-100);
    });
    it('should work with negative decimals', ()=>{
        expect((0, _msutil.parse)('-1.5 hours')).toBe(-5400000);
    });
    it('should work with negative decimals starting with "."', ()=>{
        expect((0, _msutil.parse)('-.5 hr')).toBe(-1800000);
    });
});
// invalid inputs
describe('parse(invalid inputs)', ()=>{
    it('should throw an error, when parse("")', ()=>{
        expect(()=>{
            (0, _msutil.parse)('');
        }).toThrow();
    });
    it('should throw an error, when parse(undefined)', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)(undefined);
        }).toThrow();
    });
    it('should throw an error, when parse(null)', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)(null);
        }).toThrow();
    });
    it('should throw an error, when parse([])', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)([]);
        }).toThrow();
    });
    it('should throw an error, when parse({})', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)({});
        }).toThrow();
    });
    it('should throw an error, when parse(NaN)', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)(NaN);
        }).toThrow();
    });
    it('should throw an error, when parse(Infinity)', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)(Infinity);
        }).toThrow();
    });
    it('should throw an error, when parse(-Infinity)', ()=>{
        expect(()=>{
            // @ts-expect-error - We expect this to throw.
            (0, _msutil.parse)(-Infinity);
        }).toThrow();
    });
});

//# sourceMappingURL=ms.util.spec.js.map