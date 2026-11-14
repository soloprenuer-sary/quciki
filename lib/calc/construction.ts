import { money, num } from "../format";
import type { CalcDef } from "./types";

/*
 * Construction calculators (US units: feet, inches, cubic yards, short tons).
 * Material weights are typical planning values; real products vary, so every
 * calculator exposes density or price as an editable input.
 */

const BRAND = "#0f766e";
const AMBER = "#f59e0b";
const SLATE = "#64748b";
const VIOLET = "#8b5cf6";
const BLUE = "#3b82f6";

const FT3_PER_YD3 = 27;

/** Round up, ignoring floating-point noise (55.00000000000001 should count as 55). */
const ceil = (x: number) => Math.ceil(x - 1e-9);

/* ------------------------------------------------------------------ */
/* Gravel                                                              */
/* ------------------------------------------------------------------ */
const gravel: CalcDef = {
  inputs: [
    { key: "length", label: "Length", group: "Area", default: 20, min: 1, max: 2000, step: 1, suffix: "ft" },
    { key: "width", label: "Width", group: "Area", default: 10, min: 1, max: 500, step: 1, suffix: "ft" },
    { key: "depth", label: "Depth", group: "Area", default: 3, min: 0.5, max: 24, step: 0.5, suffix: "in" },
    { key: "waste", label: "Extra for settling and spillage", group: "Material", default: 5, min: 0, max: 25, step: 1, suffix: "%" },
    { key: "density", label: "Material weight", group: "Material", default: 1.4, min: 0.8, max: 2, step: 0.05, suffix: "tons/yd³", help: "Crushed stone and gravel are usually 1.3 to 1.5 tons per cubic yard (about 2,600 to 3,000 lb)." },
    { key: "price", label: "Price per ton", group: "Cost", default: 40, min: 0, max: 300, step: 1, prefix: "$", help: "Ask your supplier for the delivered price." },
  ],
  compute(v) {
    const ft3 = (v.length * v.width * v.depth) / 12;
    const yd3 = (ft3 / FT3_PER_YD3) * (1 + v.waste / 100);
    const tons = yd3 * v.density;
    const bags = (ft3 * (1 + v.waste / 100)) / 0.5;
    const cost = tons * v.price;
    return {
      verdict: {
        tone: "neutral",
        text: `To cover ${num(v.length, 0)} × ${num(v.width, 0)} ft at ${num(v.depth)} in deep you need about ${num(yd3, 2)} cubic yards, or ${num(tons, 2)} tons of gravel. At ${money(v.price)} a ton that is roughly ${money(cost)}.`,
      },
      kpis: [
        { label: "Cubic yards", value: num(yd3, 2) },
        { label: "Tons", value: num(tons, 2) },
        { label: "Bags (0.5 cu ft)", value: num(ceil(bags), 0), hint: "For small jobs sold by the bag" },
        { label: "Estimated cost", value: money(cost) },
      ],
      table: {
        title: "Same area at other depths",
        columns: ["Depth", "Cubic yards", "Tons", "Cost"],
        rows: [1, 2, 3, 4, 6, 8].map((d) => {
          const y = ((v.length * v.width * d) / 12 / FT3_PER_YD3) * (1 + v.waste / 100);
          return [`${d} in`, num(y, 2), num(y * v.density, 2), money(y * v.density * v.price)];
        }),
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Gravel driveway                                                     */
/* ------------------------------------------------------------------ */
const gravelDriveway: CalcDef = {
  inputs: [
    { key: "length", label: "Driveway length", group: "Size", default: 60, min: 5, max: 3000, step: 5, suffix: "ft" },
    { key: "width", label: "Driveway width", group: "Size", default: 12, min: 6, max: 40, step: 1, suffix: "ft", help: "A single lane is about 10 to 12 ft. Two lanes need 18 to 24 ft." },
    { key: "baseDepth", label: "Base layer depth", group: "Layers", default: 4, min: 0, max: 12, step: 0.5, suffix: "in", help: "Large crushed stone (such as #3 or #57) that gives the drive its strength." },
    { key: "surfaceDepth", label: "Surface layer depth", group: "Layers", default: 2, min: 0, max: 6, step: 0.5, suffix: "in", help: "Smaller stone or crusher run that packs tightly on top." },
    { key: "waste", label: "Extra for compaction", group: "Layers", default: 15, min: 0, max: 30, step: 1, suffix: "%", help: "Stone compacts when rolled, so order extra." },
    { key: "density", label: "Material weight", group: "Material", default: 1.4, min: 0.8, max: 2, step: 0.05, suffix: "tons/yd³" },
    { key: "basePrice", label: "Base stone price", group: "Cost", default: 35, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
    { key: "surfacePrice", label: "Surface stone price", group: "Cost", default: 42, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
    { key: "delivery", label: "Delivery fees", group: "Cost", default: 150, min: 0, max: 2000, step: 10, prefix: "$" },
  ],
  compute(v) {
    const area = v.length * v.width;
    const layer = (depth: number) => ((area * depth) / 12 / FT3_PER_YD3) * (1 + v.waste / 100);
    const baseYd = layer(v.baseDepth);
    const surfYd = layer(v.surfaceDepth);
    const baseTons = baseYd * v.density;
    const surfTons = surfYd * v.density;
    const baseCost = baseTons * v.basePrice;
    const surfCost = surfTons * v.surfacePrice;
    const total = baseCost + surfCost + v.delivery;
    return {
      verdict: {
        tone: "neutral",
        text: `A ${num(v.length, 0)} × ${num(v.width, 0)} ft driveway (${num(area, 0)} sq ft) needs about ${num(baseTons + surfTons, 1)} tons of stone (${num(baseYd + surfYd, 1)} cubic yards). Estimated cost with delivery is ${money(total)}, or $${(total / Math.max(area, 1)).toFixed(2)} per square foot.`,
      },
      kpis: [
        { label: "Total tons", value: num(baseTons + surfTons, 1) },
        { label: "Total cubic yards", value: num(baseYd + surfYd, 1) },
        { label: "Total depth", value: `${num(v.baseDepth + v.surfaceDepth)} in`, hint: "6 to 8 in is common for driveways" },
        { label: "Estimated cost", value: money(total) },
      ],
      breakdown: {
        title: "Cost breakdown",
        total: Math.max(total, 1),
        items: [
          { label: "Base layer", value: baseCost, color: SLATE },
          { label: "Surface layer", value: surfCost, color: BRAND },
          { label: "Delivery", value: v.delivery, color: AMBER },
        ],
      },
      table: {
        title: "Quantities by layer",
        columns: ["Layer", "Cubic yards", "Tons", "Cost"],
        rows: [
          ["Base", num(baseYd, 1), num(baseTons, 1), money(baseCost)],
          ["Surface", num(surfYd, 1), num(surfTons, 1), money(surfCost)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* French drain                                                        */
/* ------------------------------------------------------------------ */
const frenchDrain: CalcDef = {
  inputs: [
    { key: "length", label: "Drain length", group: "Trench", default: 50, min: 5, max: 1000, step: 5, suffix: "ft" },
    { key: "width", label: "Trench width", group: "Trench", default: 12, min: 6, max: 36, step: 1, suffix: "in" },
    { key: "depth", label: "Trench depth", group: "Trench", default: 24, min: 12, max: 72, step: 1, suffix: "in", help: "Many French drains are 18 to 36 inches deep, sloping about 1% (1 inch every 8 feet) toward the outlet." },
    { key: "pipe", label: "Pipe diameter", group: "Pipe", default: 4, min: 3, max: 8, step: 1, suffix: "in" },
    { key: "waste", label: "Extra gravel and pipe", group: "Pipe", default: 10, min: 0, max: 25, step: 1, suffix: "%" },
    { key: "density", label: "Gravel weight", group: "Material", default: 1.4, min: 0.8, max: 2, step: 0.05, suffix: "tons/yd³", help: "Use clean, washed drainage stone such as 3/4 to 1.5 inch." },
    { key: "gravelPrice", label: "Gravel price", group: "Cost", default: 45, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
    { key: "pipePrice", label: "Perforated pipe price", group: "Cost", default: 2.5, min: 0, max: 20, step: 0.1, prefix: "$", suffix: "/ft" },
    { key: "fabricPrice", label: "Filter fabric price", group: "Cost", default: 0.3, min: 0, max: 5, step: 0.05, prefix: "$", suffix: "/sq ft" },
  ],
  compute(v) {
    const widthFt = v.width / 12;
    const depthFt = v.depth / 12;
    const trenchFt3 = v.length * widthFt * depthFt;
    const pipeFt3 = Math.PI * Math.pow(v.pipe / 12 / 2, 2) * v.length;
    const gravelYd = (Math.max(trenchFt3 - pipeFt3, 0) / FT3_PER_YD3) * (1 + v.waste / 100);
    const gravelTons = gravelYd * v.density;
    const pipeFt = v.length * (1 + v.waste / 100);
    const fabricFt2 = v.length * (2 * depthFt + widthFt + 1) * (1 + v.waste / 100); // wraps the trench with a 12 in overlap
    const soilYd = (trenchFt3 / FT3_PER_YD3) * 1.25;
    const gravelCost = gravelTons * v.gravelPrice;
    const pipeCost = pipeFt * v.pipePrice;
    const fabricCost = fabricFt2 * v.fabricPrice;
    const total = gravelCost + pipeCost + fabricCost;
    return {
      verdict: {
        tone: "neutral",
        text: `A ${num(v.length, 0)} ft French drain (${num(v.width, 0)} in wide, ${num(v.depth, 0)} in deep) needs about ${num(gravelTons, 1)} tons of gravel, ${num(ceil(pipeFt), 0)} ft of pipe and ${num(ceil(fabricFt2), 0)} sq ft of filter fabric. Materials cost roughly ${money(total)}.`,
      },
      kpis: [
        { label: "Gravel", value: `${num(gravelTons, 1)} tons`, hint: `${num(gravelYd, 1)} cubic yards` },
        { label: "Perforated pipe", value: `${num(ceil(pipeFt), 0)} ft` },
        { label: "Filter fabric", value: `${num(ceil(fabricFt2), 0)} sq ft` },
        { label: "Materials cost", value: money(total) },
      ],
      breakdown: {
        title: "Materials cost",
        total: Math.max(total, 1),
        items: [
          { label: "Gravel", value: gravelCost, color: SLATE },
          { label: "Pipe", value: pipeCost, color: BLUE },
          { label: "Fabric", value: fabricCost, color: VIOLET },
        ],
      },
      table: {
        title: "Planning numbers",
        columns: ["Item", "Amount"],
        rows: [
          ["Soil to dig out (loose)", `${num(soilYd, 1)} cubic yards`],
          ["Total fall at 1% slope", `${num(v.length * 0.12, 1)} in over ${num(v.length, 0)} ft`],
          ["Trench volume", `${num(trenchFt3 / FT3_PER_YD3, 2)} cubic yards`],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Retaining wall blocks                                               */
/* ------------------------------------------------------------------ */
const retainingWall: CalcDef = {
  inputs: [
    { key: "length", label: "Wall length", group: "Wall", default: 30, min: 2, max: 500, step: 1, suffix: "ft" },
    { key: "height", label: "Visible wall height", group: "Wall", default: 3, min: 1, max: 12, step: 0.5, suffix: "ft", help: "Many codes require a permit and an engineer above about 4 ft (footing to top of wall), and some places set the limit lower." },
    { key: "buried", label: "Buried base courses", group: "Wall", default: 1, min: 0, max: 3, step: 1, help: "Usually one buried course for walls up to 4 ft." },
    { key: "blockW", label: "Block face width", group: "Blocks", default: 16, min: 6, max: 36, step: 1, suffix: "in" },
    { key: "blockH", label: "Block face height", group: "Blocks", default: 6, min: 3, max: 12, step: 0.5, suffix: "in" },
    { key: "capL", label: "Cap block length", group: "Blocks", default: 12, min: 6, max: 24, step: 1, suffix: "in" },
    { key: "waste", label: "Extra for cuts and breakage", group: "Blocks", default: 8, min: 0, max: 20, step: 1, suffix: "%" },
    { key: "gravelWidth", label: "Gravel backfill width", group: "Gravel", default: 12, min: 6, max: 36, step: 1, suffix: "in", help: "Clean gravel behind the wall for drainage, usually 12 in." },
    { key: "baseDepth", label: "Gravel base depth", group: "Gravel", default: 6, min: 4, max: 12, step: 1, suffix: "in" },
    { key: "baseWidth", label: "Gravel base width", group: "Gravel", default: 24, min: 12, max: 48, step: 1, suffix: "in" },
    { key: "blockPrice", label: "Block price", group: "Cost", default: 4.5, min: 0, max: 50, step: 0.25, prefix: "$", suffix: "each" },
    { key: "capPrice", label: "Cap block price", group: "Cost", default: 4, min: 0, max: 50, step: 0.25, prefix: "$", suffix: "each" },
    { key: "gravelPrice", label: "Gravel price", group: "Cost", default: 45, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
  ],
  compute(v) {
    const visibleCourses = ceil((v.height * 12) / v.blockH);
    const courses = visibleCourses + v.buried;
    const perCourse = ceil((v.length * 12) / v.blockW);
    const blocks = ceil(courses * perCourse * (1 + v.waste / 100));
    const caps = ceil((v.length * 12) / v.capL);
    const backfillFt3 = v.length * v.height * (v.gravelWidth / 12);
    const baseFt3 = v.length * (v.baseWidth / 12) * (v.baseDepth / 12);
    const gravelYd = (backfillFt3 + baseFt3) / FT3_PER_YD3;
    const gravelTons = gravelYd * 1.4;
    const blockCost = blocks * v.blockPrice;
    const capCost = caps * v.capPrice;
    const gravelCost = gravelTons * v.gravelPrice;
    const total = blockCost + capCost + gravelCost;
    return {
      verdict: {
        tone: v.height > 4 ? "bad" : "neutral",
        text: `A ${num(v.length, 0)} ft wall ${num(v.height)} ft high needs about ${num(blocks, 0)} blocks (${courses} courses of ${perCourse}), ${num(caps, 0)} cap blocks and ${num(gravelTons, 1)} tons of gravel. Materials cost roughly ${money(total)}.${v.height > 4 ? " Check local rules: many places require a permit and an engineer above about 4 ft." : ""}`,
      },
      kpis: [
        { label: "Wall blocks", value: num(blocks, 0), hint: `${courses} courses × ${perCourse} blocks` },
        { label: "Cap blocks", value: num(caps, 0) },
        { label: "Gravel", value: `${num(gravelTons, 1)} tons`, hint: `${num(gravelYd, 1)} cubic yards` },
        { label: "Materials cost", value: money(total) },
      ],
      breakdown: {
        title: "Materials cost",
        total: Math.max(total, 1),
        items: [
          { label: "Wall blocks", value: blockCost, color: SLATE },
          { label: "Cap blocks", value: capCost, color: VIOLET },
          { label: "Gravel", value: gravelCost, color: AMBER },
        ],
      },
      table: {
        title: "Wall details",
        columns: ["Item", "Amount"],
        rows: [
          ["Visible face area", `${num(v.length * v.height, 0)} sq ft`],
          ["Courses (visible + buried)", `${visibleCourses} + ${v.buried}`],
          ["Backfill gravel", `${num(backfillFt3 / FT3_PER_YD3, 2)} cubic yards`],
          ["Base gravel", `${num(baseFt3 / FT3_PER_YD3, 2)} cubic yards`],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Paver base                                                          */
/* ------------------------------------------------------------------ */
const paverBase: CalcDef = {
  inputs: [
    { key: "length", label: "Patio length", group: "Area", default: 16, min: 2, max: 200, step: 1, suffix: "ft" },
    { key: "width", label: "Patio width", group: "Area", default: 12, min: 2, max: 200, step: 1, suffix: "ft" },
    { key: "baseDepth", label: "Compacted base depth", group: "Base", default: 6, min: 3, max: 16, step: 1, suffix: "in", help: "4 to 6 in for patios and walkways, 8 to 12 in for driveways." },
    { key: "sandDepth", label: "Bedding sand depth", group: "Base", default: 1, min: 0.5, max: 2, step: 0.25, suffix: "in" },
    { key: "compaction", label: "Extra for compaction", group: "Base", default: 20, min: 0, max: 40, step: 1, suffix: "%", help: "Base stone compacts by roughly 15% to 25%." },
    { key: "paverL", label: "Paver length", group: "Pavers", default: 9, min: 2, max: 48, step: 0.5, suffix: "in" },
    { key: "paverW", label: "Paver width", group: "Pavers", default: 6, min: 2, max: 48, step: 0.5, suffix: "in" },
    { key: "waste", label: "Extra pavers for cuts", group: "Pavers", default: 10, min: 0, max: 25, step: 1, suffix: "%" },
    { key: "basePrice", label: "Base stone price", group: "Cost", default: 40, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
    { key: "sandPrice", label: "Sand price", group: "Cost", default: 45, min: 0, max: 300, step: 1, prefix: "$", suffix: "/ton" },
    { key: "paverPrice", label: "Paver price", group: "Cost", default: 1.25, min: 0, max: 20, step: 0.05, prefix: "$", suffix: "each" },
  ],
  compute(v) {
    const area = v.length * v.width;
    const baseYd = ((area * (v.baseDepth / 12)) / FT3_PER_YD3) * (1 + v.compaction / 100);
    const sandYd = (area * (v.sandDepth / 12)) / FT3_PER_YD3;
    const baseTons = baseYd * 1.4;
    const sandTons = sandYd * 1.35;
    const paverArea = (v.paverL * v.paverW) / 144;
    const pavers = ceil((area / paverArea) * (1 + v.waste / 100));
    const edge = 2 * (v.length + v.width);
    const baseCost = baseTons * v.basePrice;
    const sandCost = sandTons * v.sandPrice;
    const paverCost = pavers * v.paverPrice;
    const total = baseCost + sandCost + paverCost;
    return {
      verdict: {
        tone: "neutral",
        text: `A ${num(v.length, 0)} × ${num(v.width, 0)} ft patio (${num(area, 0)} sq ft) needs about ${num(baseTons, 1)} tons of base stone, ${num(sandTons, 1)} tons of bedding sand and ${num(pavers, 0)} pavers. Materials cost roughly ${money(total)}.`,
      },
      kpis: [
        { label: "Base stone", value: `${num(baseTons, 1)} tons`, hint: `${num(baseYd, 1)} cubic yards` },
        { label: "Bedding sand", value: `${num(sandTons, 1)} tons`, hint: `${num(sandYd, 2)} cubic yards` },
        { label: "Pavers", value: num(pavers, 0), hint: `${num(area, 0)} sq ft covered` },
        { label: "Edge restraint", value: `${num(edge, 0)} ft` },
      ],
      breakdown: {
        title: "Materials cost",
        total: Math.max(total, 1),
        items: [
          { label: "Base stone", value: baseCost, color: SLATE },
          { label: "Bedding sand", value: sandCost, color: AMBER },
          { label: "Pavers", value: paverCost, color: BRAND },
        ],
      },
      table: {
        title: "Excavation depth to plan for",
        columns: ["Layer", "Depth"],
        rows: [
          ["Compacted base", `${num(v.baseDepth)} in`],
          ["Bedding sand", `${num(v.sandDepth, 2)} in`],
          ["Paver thickness (typical)", "2.4 in"],
          ["Total dig depth below finished grade", `${num(v.baseDepth + v.sandDepth + 2.4)} in`],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Excavation volume                                                   */
/* ------------------------------------------------------------------ */
const excavationVolume: CalcDef = {
  inputs: [
    { key: "length", label: "Length", group: "Excavation", default: 40, min: 1, max: 1000, step: 1, suffix: "ft" },
    { key: "width", label: "Width", group: "Excavation", default: 30, min: 1, max: 1000, step: 1, suffix: "ft" },
    { key: "depth", label: "Depth", group: "Excavation", default: 4, min: 0.5, max: 30, step: 0.5, suffix: "ft" },
    { key: "swell", label: "Swell factor", group: "Soil", default: 25, min: 0, max: 60, step: 1, suffix: "%", help: "Dug soil expands. About 25% is typical for common soil, 25% to 40% for clay, 10% to 15% for sand and gravel." },
    { key: "density", label: "Loose soil weight", group: "Soil", default: 1.3, min: 0.7, max: 2, step: 0.05, suffix: "tons/yd³" },
    { key: "truck", label: "Truck capacity", group: "Hauling", default: 10, min: 4, max: 30, step: 1, suffix: "yd³" },
  ],
  compute(v) {
    const bankYd = (v.length * v.width * v.depth) / FT3_PER_YD3;
    const looseYd = bankYd * (1 + v.swell / 100);
    const tons = looseYd * v.density;
    const loads = ceil(looseYd / v.truck);
    return {
      verdict: {
        tone: "neutral",
        text: `Digging ${num(v.length, 0)} × ${num(v.width, 0)} ft by ${num(v.depth)} ft deep removes ${num(bankYd, 1)} cubic yards in place. Once loosened it swells to about ${num(looseYd, 1)} cubic yards, roughly ${num(loads, 0)} truck loads of ${num(v.truck, 0)} yd³.`,
      },
      kpis: [
        { label: "In-place (bank) volume", value: `${num(bankYd, 1)} yd³` },
        { label: "Loose volume to haul", value: `${num(looseYd, 1)} yd³` },
        { label: "Truck loads", value: num(loads, 0), hint: `${num(v.truck, 0)} yd³ trucks` },
        { label: "Estimated weight", value: `${num(tons, 1)} tons` },
      ],
      table: {
        title: "Volume in other units",
        columns: ["Measure", "Amount"],
        rows: [
          ["Bank volume", `${num(bankYd * FT3_PER_YD3, 0)} cubic feet`],
          ["Bank volume", `${num(bankYd * 0.764555, 1)} cubic metres`],
          ["Loose volume", `${num(looseYd, 1)} cubic yards`],
          ["Footprint area", `${num(v.length * v.width, 0)} sq ft`],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Dump truck load                                                     */
/* ------------------------------------------------------------------ */
const dumpTruck: CalcDef = {
  inputs: [
    { key: "volume", label: "Material to move", group: "Job", default: 60, min: 1, max: 5000, step: 1, suffix: "yd³", help: "Use loose cubic yards, which is what trucks carry." },
    { key: "density", label: "Material weight", group: "Job", default: 1.4, min: 0.5, max: 2.2, step: 0.05, suffix: "tons/yd³", help: "Dry sand and gravel 1.3 to 1.5, damp soil 1.1 to 1.5, wet clay up to 1.7, mulch about 0.4." },
    { key: "truckVol", label: "Truck bed capacity", group: "Truck", default: 12, min: 3, max: 30, step: 1, suffix: "yd³", help: "A single-axle truck carries about 6 to 8 yd³, a tandem about 10 to 16 and a tri-axle 12 to 20." },
    { key: "payload", label: "Truck payload limit", group: "Truck", default: 14, min: 2, max: 30, step: 0.5, suffix: "tons", help: "Legal payload depends on truck and state limits. Ask your hauler." },
    { key: "rate", label: "Trucking cost per load", group: "Cost", default: 175, min: 0, max: 1500, step: 5, prefix: "$" },
  ],
  compute(v) {
    const fullVolTons = v.truckVol * v.density;
    const weightLimited = fullVolTons > v.payload;
    const perLoadYd = weightLimited ? v.payload / v.density : v.truckVol;
    const loads = ceil(v.volume / perLoadYd);
    const totalTons = v.volume * v.density;
    return {
      verdict: {
        tone: weightLimited ? "neutral" : "good",
        text: `${num(v.volume, 0)} cubic yards weighs about ${num(totalTons, 1)} tons and needs ${num(loads, 0)} truck load${loads === 1 ? "" : "s"}. ${weightLimited ? `Weight is the limit here: a full bed would carry ${num(fullVolTons, 1)} tons, over the ${num(v.payload, 1)}-ton payload, so each load is only about ${num(perLoadYd, 1)} yd³.` : "Volume is the limit, so each truck can be filled to the top of the bed without exceeding its payload."} At ${money(v.rate)} a load, hauling is roughly ${money(loads * v.rate)}.`,
      },
      kpis: [
        { label: "Truck loads", value: num(loads, 0) },
        { label: "Total weight", value: `${num(totalTons, 1)} tons` },
        { label: "Per-load volume", value: `${num(perLoadYd, 1)} yd³`, hint: weightLimited ? "Limited by weight" : "Limited by bed size" },
        { label: "Hauling cost", value: money(loads * v.rate) },
      ],
      table: {
        title: "Load check",
        columns: ["Item", "Value"],
        rows: [
          ["Weight of a full bed", `${num(fullVolTons, 1)} tons`],
          ["Payload limit", `${num(v.payload, 1)} tons`],
          ["Limiting factor", weightLimited ? "Weight" : "Volume"],
          ["Loads by volume only", num(ceil(v.volume / v.truckVol), 0)],
          ["Loads by weight only", num(ceil(totalTons / v.payload), 0)],
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Fill dirt                                                           */
/* ------------------------------------------------------------------ */
const fillDirt: CalcDef = {
  inputs: [
    { key: "length", label: "Length", group: "Area", default: 30, min: 1, max: 2000, step: 1, suffix: "ft" },
    { key: "width", label: "Width", group: "Area", default: 20, min: 1, max: 2000, step: 1, suffix: "ft" },
    { key: "depth", label: "Depth of fill", group: "Area", default: 12, min: 1, max: 120, step: 1, suffix: "in" },
    { key: "compaction", label: "Compaction shrink", group: "Material", default: 15, min: 0, max: 30, step: 1, suffix: "%", help: "Loose fill settles when compacted. 10% to 20% is common." },
    { key: "density", label: "Loose fill weight", group: "Material", default: 1.2, min: 0.7, max: 2, step: 0.05, suffix: "tons/yd³" },
    { key: "truck", label: "Truck capacity", group: "Material", default: 10, min: 4, max: 30, step: 1, suffix: "yd³" },
    { key: "price", label: "Price per cubic yard", group: "Cost", default: 18, min: 0, max: 200, step: 1, prefix: "$" },
    { key: "delivery", label: "Delivery fee per load", group: "Cost", default: 60, min: 0, max: 1000, step: 5, prefix: "$" },
  ],
  compute(v) {
    const finished = (v.length * v.width * (v.depth / 12)) / FT3_PER_YD3;
    const needed = finished / Math.max(1 - v.compaction / 100, 0.1);
    const tons = needed * v.density;
    const loads = ceil(needed / v.truck);
    const material = needed * v.price;
    const delivery = loads * v.delivery;
    const total = material + delivery;
    return {
      verdict: {
        tone: "neutral",
        text: `To fill ${num(v.length, 0)} × ${num(v.width, 0)} ft to ${num(v.depth, 0)} in after compaction you should order about ${num(needed, 1)} cubic yards (${num(tons, 1)} tons), about ${num(loads, 0)} truck load${loads === 1 ? "" : "s"}. Estimated cost is ${money(total)}.`,
      },
      kpis: [
        { label: "Cubic yards to order", value: num(needed, 1), hint: `${num(finished, 1)} yd³ finished` },
        { label: "Tons", value: num(tons, 1) },
        { label: "Truck loads", value: num(loads, 0) },
        { label: "Estimated cost", value: money(total) },
      ],
      breakdown: {
        title: "Cost breakdown",
        total: Math.max(total, 1),
        items: [
          { label: "Fill material", value: material, color: SLATE },
          { label: "Delivery", value: delivery, color: AMBER },
        ],
      },
    };
  },
};

/* ------------------------------------------------------------------ */
/* Excavation cost                                                     */
/* ------------------------------------------------------------------ */
const excavationCost: CalcDef = {
  inputs: [
    { key: "length", label: "Length", group: "Excavation", default: 40, min: 1, max: 1000, step: 1, suffix: "ft" },
    { key: "width", label: "Width", group: "Excavation", default: 30, min: 1, max: 1000, step: 1, suffix: "ft" },
    { key: "depth", label: "Depth", group: "Excavation", default: 4, min: 0.5, max: 30, step: 0.5, suffix: "ft" },
    { key: "swell", label: "Swell factor", group: "Excavation", default: 25, min: 0, max: 60, step: 1, suffix: "%" },
    { key: "dig", label: "Digging and loading", group: "Rates", default: 14, min: 0, max: 100, step: 1, prefix: "$", suffix: "/yd³", help: "Machine and operator cost per in-place cubic yard. Varies by soil, access and region." },
    { key: "truck", label: "Truck capacity", group: "Rates", default: 10, min: 4, max: 30, step: 1, suffix: "yd³" },
    { key: "haul", label: "Hauling per load", group: "Rates", default: 175, min: 0, max: 1500, step: 5, prefix: "$" },
    { key: "dump", label: "Dump or disposal fee", group: "Rates", default: 12, min: 0, max: 200, step: 1, prefix: "$", suffix: "/ton" },
    { key: "density", label: "Loose soil weight", group: "Rates", default: 1.3, min: 0.7, max: 2, step: 0.05, suffix: "tons/yd³" },
    { key: "mobil", label: "Machine delivery (mobilization)", group: "Rates", default: 350, min: 0, max: 5000, step: 25, prefix: "$" },
    { key: "contingency", label: "Contingency", group: "Rates", default: 10, min: 0, max: 40, step: 1, suffix: "%" },
  ],
  compute(v) {
    const bankYd = (v.length * v.width * v.depth) / FT3_PER_YD3;
    const looseYd = bankYd * (1 + v.swell / 100);
    const loads = ceil(looseYd / v.truck);
    const dig = bankYd * v.dig;
    const haul = loads * v.haul;
    const dump = looseYd * v.density * v.dump;
    const sub = dig + haul + dump + v.mobil;
    const cont = sub * (v.contingency / 100);
    const total = sub + cont;
    return {
      verdict: {
        tone: "neutral",
        text: `Excavating ${num(bankYd, 1)} cubic yards (${num(looseYd, 1)} yd³ loose, ${num(loads, 0)} loads) is estimated at ${money(total)}, about ${money(total / Math.max(bankYd, 1))} per in-place yard. Prices vary a lot by region, soil and site access, so treat this as a planning figure and get quotes.`,
      },
      kpis: [
        { label: "Estimated total", value: money(total) },
        { label: "Cost per yd³ (in place)", value: money(total / Math.max(bankYd, 1)) },
        { label: "Volume to dig", value: `${num(bankYd, 1)} yd³` },
        { label: "Truck loads", value: num(loads, 0) },
      ],
      breakdown: {
        title: "Cost breakdown",
        total: Math.max(total, 1),
        items: [
          { label: "Digging and loading", value: dig, color: BRAND },
          { label: "Hauling", value: haul, color: BLUE },
          { label: "Dump fees", value: dump, color: SLATE },
          { label: "Machine delivery", value: v.mobil, color: VIOLET },
          { label: "Contingency", value: cont, color: AMBER },
        ],
      },
    };
  },
};

export const CONSTRUCTION_CALCS: Record<string, CalcDef> = {
  "gravel-calculator": gravel,
  "gravel-driveway-calculator": gravelDriveway,
  "french-drain-calculator": frenchDrain,
  "retaining-wall-block-calculator": retainingWall,
  "paver-base-calculator": paverBase,
  "excavation-volume-calculator": excavationVolume,
  "dump-truck-load-calculator": dumpTruck,
  "fill-dirt-calculator": fillDirt,
  "excavation-cost-calculator": excavationCost,
};
