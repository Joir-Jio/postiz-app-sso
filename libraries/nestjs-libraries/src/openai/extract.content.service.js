"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractContentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jsdom_1 = require("jsdom");
function findDepth(element) {
    let depth = 0;
    let elementer = element;
    while (elementer.parentNode) {
        depth++;
        elementer = elementer.parentNode;
    }
    return depth;
}
let ExtractContentService = class ExtractContentService {
    async extractContent(url) {
        var _a, _b;
        const load = await (await fetch(url)).text();
        const dom = new jsdom_1.JSDOM(load);
        const allTitles = Array.from(dom.window.document.querySelectorAll('*'))
            .filter((f) => {
            return (f.querySelector('h1') ||
                f.querySelector('h2') ||
                f.querySelector('h3') ||
                f.querySelector('h4') ||
                f.querySelector('h5') ||
                f.querySelector('h6'));
        })
            .reverse();
        const findTheOneWithMostTitles = allTitles.reduce((all, current) => {
            const depth = findDepth(current);
            const calculate = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].reduce((total, tag) => {
                if (current.querySelector(tag)) {
                    return total + 1;
                }
                return total;
            }, 0);
            if (calculate > all.total) {
                return { total: calculate, depth, element: current };
            }
            if (depth > all.depth) {
                return { total: calculate, depth, element: current };
            }
            return all;
        }, { total: 0, depth: 0, element: null });
        return (_b = (_a = findTheOneWithMostTitles === null || findTheOneWithMostTitles === void 0 ? void 0 : findTheOneWithMostTitles.element) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');
    }
};
exports.ExtractContentService = ExtractContentService;
exports.ExtractContentService = ExtractContentService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ExtractContentService);
//# sourceMappingURL=extract.content.service.js.map