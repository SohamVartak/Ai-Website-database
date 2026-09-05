(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/App.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function DashboardPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$App$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["App"], {}, void 0, false, {
            fileName: "[project]/app/dashboard/page.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/materialHarmonization.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findCompanyMatches",
    ()=>findCompanyMatches,
    "findThreeCompanyHarmonization",
    ()=>findThreeCompanyHarmonization,
    "harmonizeMaterial",
    ()=>harmonizeMaterial
]);
function normalize(value) {
    return (value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function words(value) {
    const stopWords = new Set([
        'the',
        'and',
        'for',
        'with',
        'of',
        'in',
        'to',
        'type',
        'size',
        'item',
        'material',
        'as',
        'a'
    ]);
    return new Set(normalize(value).split(' ').filter((word)=>word.length >= 3 && !stopWords.has(word)));
}
function similarity(a, b) {
    const aWords = words(a);
    const bWords = words(b);
    if (aWords.size === 0 || bWords.size === 0) return 0;
    let common = 0;
    for (const word of aWords){
        if (bWords.has(word)) common++;
    }
    const union = new Set([
        ...aWords,
        ...bWords
    ]).size;
    return union === 0 ? 0 : common / union * 100;
}
function harmonizeMaterial(source, target) {
    const descriptionScore = similarity(source.description, target.description);
    const specificationScore = similarity(source.specifications, target.specifications);
    const categoryScore = source.category && target.category && normalize(source.category) === normalize(target.category) ? 100 : 0;
    const similarityScore = Math.round(descriptionScore * 0.45 + specificationScore * 0.45 + categoryScore * 0.10);
    const matchedFields = [];
    const differences = [];
    if (descriptionScore >= 50) {
        matchedFields.push('Description');
    } else {
        differences.push('Description differs');
    }
    if (specificationScore >= 50) {
        matchedFields.push('Specifications');
    } else {
        differences.push('Specifications differ');
    }
    if (categoryScore === 100) {
        matchedFields.push('Category');
    } else if (source.category && target.category) {
        differences.push('Category differs');
    }
    let recommendation;
    if (similarityScore >= 80) {
        recommendation = 'LIKELY_MATCH';
    } else if (similarityScore >= 45) {
        recommendation = 'REVIEW';
    } else {
        recommendation = 'NO_MATCH';
    }
    return {
        source,
        target,
        similarityScore,
        matchedFields,
        differences,
        recommendation
    };
}
function findCompanyMatches(source, materials, targetCompany) {
    return materials.filter((material)=>material.company?.trim().toUpperCase() === targetCompany.toUpperCase() && material.id !== source.id).map((material)=>harmonizeMaterial(source, material)).sort((a, b)=>b.similarityScore - a.similarityScore);
}
function findThreeCompanyHarmonization(source, materials) {
    const hpcl = findCompanyMatches(source, materials, 'HPCL')[0] || null;
    const iocl = findCompanyMatches(source, materials, 'IOCL')[0] || null;
    return {
        source,
        hpcl,
        iocl
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://cqnigcleoqspvtaxglzz.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_fCs_oR_vbyVcMmMjNKApFg_eTIr3XyM"));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_11fhx2b._.js.map