import type { CalculatorMeta } from "../calculators";

const SAFETY =
  "Estimates only. Material weights, prices and soil conditions vary by site and supplier. Call 811 before you dig, check local permits and building codes, and confirm quantities with your supplier or a qualified contractor.";

export const CONSTRUCTION_TOOLS: CalculatorMeta[] = [
  {
    slug: "gravel-calculator",
    name: "Gravel Calculator",
    category: "construction",
    group: "Gravel and Aggregate",
    tagline: "Work out how many cubic yards, tons and bags of gravel you need for any rectangular area.",
    metaTitle: "Gravel Calculator: Cubic Yards, Tons & Cost",
    metaDescription:
      "Free gravel calculator. Enter length, width and depth to get cubic yards, tons, bags and estimated cost, with an editable material weight and price.",
    keywords: ["gravel calculator", "how much gravel do I need", "gravel tons calculator", "crushed stone calculator"],
    intro: [
      "Ordering the right amount of gravel saves a second delivery fee and a half-finished project. Suppliers sell gravel by the ton or the cubic yard, but you measure your project in feet and inches, so a conversion is needed.",
      "This calculator turns length, width and depth into cubic yards, tons, and 0.5 cubic foot bags, adds an allowance for settling, and estimates cost from your local price per ton.",
    ],
    steps: [
      "Measure the length and width of the area in feet.",
      "Enter the depth in inches. Paths often use 2 to 3 inches, driveways 4 to 8 inches in layers.",
      "Adjust the material weight if your supplier gives a different figure.",
      "Enter your delivered price per ton to see the cost.",
    ],
    formula: [
      "Cubic feet = length × width × depth in inches ÷ 12",
      "Cubic yards = cubic feet ÷ 27, plus an allowance for settling",
      "Tons = cubic yards × material weight (about 1.4 tons per yard for gravel)",
    ],
    example: [
      "For a 20 ft × 10 ft area covered 3 inches deep with a 5% allowance, you need about 1.94 cubic yards, or 2.72 tons at 1.4 tons per yard. At $40 a ton that is roughly $109. The table on the page shows the same area at other depths, which helps you compare options before ordering.",
    ],
    tips: [
      "Order slightly more than you need. A small top-up delivery often costs more than extra material.",
      "Ask the supplier for the actual weight per cubic yard of the product you are buying.",
      "Compact the base before adding the next layer, and order extra for compaction on driveways.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How do I calculate how much gravel I need?",
        a: "Multiply length by width in feet and depth in feet (inches divided by 12) to get cubic feet, divide by 27 for cubic yards, then multiply by the material weight to get tons.",
      },
      {
        q: "How many tons are in a cubic yard of gravel?",
        a: "Most gravel and crushed stone weighs between 1.3 and 1.5 tons per cubic yard, about 2,600 to 3,000 pounds. Wet or fine material can be heavier.",
      },
      {
        q: "How deep should gravel be?",
        a: "Walkways and garden paths commonly use 2 to 3 inches. Patio bases use 4 to 6 inches, and driveways use 6 to 8 inches built in layers.",
      },
      {
        q: "Should I order by the ton or by the yard?",
        a: "Either works if you know the conversion. Many quarries sell by the ton, while landscape yards often sell by the cubic yard. Compare the delivered price per ton using this calculator.",
      },
    ],
    related: ["gravel-driveway-calculator", "paver-base-calculator", "french-drain-calculator"],
    guide: "how-much-gravel-do-i-need",
  },
  {
    slug: "gravel-driveway-calculator",
    name: "Gravel Driveway Calculator",
    category: "construction",
    group: "Gravel and Aggregate",
    tagline: "Estimate base and surface stone, tons and cost for a new or refreshed gravel driveway.",
    metaTitle: "Gravel Driveway Calculator: Tons, Layers & Cost",
    metaDescription:
      "Free gravel driveway calculator. Enter length, width and layer depths to estimate tons of base and surface stone, cubic yards, delivery and total cost.",
    keywords: ["gravel driveway calculator", "driveway gravel calculator", "how much gravel for a driveway", "gravel driveway cost"],
    intro: [
      "A durable gravel driveway is built in layers: a coarse base for strength, and a finer surface layer that locks together. Each layer needs a different stone and quantity, so a single depth estimate often leads to under-ordering.",
      "This calculator works out both layers from your driveway size, adds an allowance for compaction, and totals the cost including delivery.",
    ],
    steps: [
      "Enter the length and width of the driveway.",
      "Set the base layer depth and the surface layer depth in inches.",
      "Add an allowance for compaction, typically 10% to 20%.",
      "Enter prices per ton for each stone and your delivery charges.",
    ],
    formula: [
      "Layer cubic yards = length × width × depth in inches ÷ 12 ÷ 27 × (1 + compaction)",
      "Layer tons = cubic yards × material weight",
      "Total cost = base cost + surface cost + delivery",
    ],
    example: [
      "A 60 ft × 12 ft driveway (720 sq ft) with a 4 inch base and a 2 inch surface layer, plus 15% for compaction, needs about 14.3 tons of base stone and 7.2 tons of surface stone: roughly 21.5 tons in all. At $35 and $42 a ton plus $150 delivery, the estimate is about $951, or $1.32 per square foot.",
    ],
    tips: [
      "Good drainage matters more than thickness. Crown the driveway and keep water from pooling.",
      "A geotextile fabric under the base helps on soft soil and keeps layers from mixing.",
      "Expect to top up the surface every few years as stone migrates.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much gravel do I need for a driveway?",
        a: "Multiply length by width by depth to get volume, convert to cubic yards, then to tons. A 60 × 12 ft driveway at a total depth of 6 inches needs roughly 20 tons including compaction.",
      },
      {
        q: "What size gravel is best for a driveway?",
        a: "A common build uses a larger base stone (for example 2 to 3 inch crushed stone) and a smaller, angular surface stone such as crusher run or 3/4 inch minus that compacts firmly.",
      },
      {
        q: "How thick should a gravel driveway be?",
        a: "Most are 6 to 8 inches thick in total, built in two or three compacted layers. Soft soil or heavy vehicles call for more.",
      },
      {
        q: "Why order extra gravel for a driveway?",
        a: "Loose stone compacts when rolled and some is lost into the subsoil, so adding 10% to 20% avoids a shortfall.",
      },
    ],
    related: ["gravel-calculator", "paver-base-calculator", "excavation-volume-calculator"],
    guide: "how-much-gravel-do-i-need",
  },
  {
    slug: "french-drain-calculator",
    name: "French Drain Calculator",
    category: "construction",
    group: "Drainage and Landscaping",
    tagline: "Calculate gravel, pipe, filter fabric and cost for a French drain of any length.",
    metaTitle: "French Drain Calculator: Gravel, Pipe & Fabric Needed",
    metaDescription:
      "Free French drain calculator. Enter trench length, width, depth and pipe size to estimate tons of gravel, feet of pipe, filter fabric and materials cost.",
    keywords: ["french drain calculator", "drainage gravel calculator", "how much gravel for french drain", "french drain cost"],
    intro: [
      "A French drain moves groundwater away from a foundation or soggy yard using a gravel-filled trench with a perforated pipe. Getting the quantities right matters, because the pipe, filter fabric and clean gravel are all bought separately.",
      "This calculator subtracts the volume of the pipe from the trench, so you do not over-order gravel, and calculates the fabric needed to wrap the whole trench with an overlap.",
    ],
    steps: [
      "Enter the length of the drain, and the trench width and depth.",
      "Choose the pipe diameter, usually 4 inches.",
      "Add a small allowance for extra pipe and gravel.",
      "Enter local prices to see a materials cost.",
    ],
    formula: [
      "Trench volume = length × width × depth",
      "Gravel volume = trench volume − pipe volume",
      "Fabric = length × (2 × depth + width + 12 in overlap)",
    ],
    example: [
      "A 50 ft drain that is 12 inches wide and 24 inches deep has a trench volume of 100 cubic feet. After subtracting about 4.4 cubic feet for the pipe and adding 10%, you need about 3.9 cubic yards, or 5.5 tons, of gravel, 55 ft of pipe and roughly 330 sq ft of fabric. Materials cost about $482 at the default prices.",
    ],
    tips: [
      "Slope the trench about 1% (one inch of fall every eight feet) toward a safe outlet.",
      "Use clean washed stone, and place the pipe with the holes facing down.",
      "Wrap the stone, not the pipe, with filter fabric to keep silt out.",
      "Check where the water will exit. Do not drain onto a neighbor's land.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much gravel do I need for a French drain?",
        a: "Multiply trench length, width and depth to get cubic feet, subtract the pipe volume, and convert to cubic yards and tons. The calculator does this and adds an allowance.",
      },
      {
        q: "How deep should a French drain be?",
        a: "Often 18 to 36 inches. It should be deep enough to intercept the water, with a continuous downward slope to the outlet.",
      },
      {
        q: "What size pipe should I use?",
        a: "Four-inch perforated pipe is the common choice for residential drains. Larger pipe can be used for long runs or heavy flows.",
      },
      {
        q: "Does a French drain need filter fabric?",
        a: "In most soils, yes. Fabric keeps fine soil from clogging the stone and pipe over time.",
      },
    ],
    related: ["gravel-calculator", "excavation-volume-calculator", "retaining-wall-block-calculator"],
    guide: "how-to-install-a-french-drain",
  },
  {
    slug: "retaining-wall-block-calculator",
    name: "Retaining Wall Block Calculator",
    category: "construction",
    group: "Hardscape",
    tagline: "Estimate wall blocks, cap blocks, drainage gravel and materials cost for a segmental retaining wall.",
    metaTitle: "Retaining Wall Block Calculator: Blocks, Caps & Gravel",
    metaDescription:
      "Free retaining wall block calculator. Enter wall length, height and block size to estimate wall blocks, cap blocks, backfill gravel and materials cost.",
    keywords: ["retaining wall block calculator", "how many blocks for a retaining wall", "retaining wall cost", "retaining wall gravel calculator"],
    intro: [
      "A segmental retaining wall is built from stacked blocks on a compacted gravel base, with drainage gravel behind it. Block count depends on both the wall's size and the face dimensions of your chosen block.",
      "This calculator counts courses and blocks per course, includes buried base courses, adds cap blocks, and estimates the base and backfill gravel and materials cost.",
    ],
    steps: [
      "Enter the wall length and visible height.",
      "Enter the face width and height of your block, and the length of the cap block.",
      "Set the number of buried base courses and an allowance for cuts.",
      "Enter the gravel backfill and base dimensions, and the unit prices.",
    ],
    formula: [
      "Courses = ceil(height × 12 ÷ block height) + buried courses",
      "Blocks per course = ceil(length × 12 ÷ block width)",
      "Gravel = (length × height × backfill width) + (length × base width × base depth)",
    ],
    example: [
      "A 30 ft long wall that is 3 ft high with 16 × 6 inch blocks has 6 visible courses plus 1 buried course, and 23 blocks per course. With 8% for cuts that is 174 blocks, plus 30 cap blocks. The base and backfill take about 4.4 cubic yards (6.2 tons) of gravel. Materials come to roughly $1,183 at the default prices.",
    ],
    tips: [
      "Many codes require a permit and an engineer above about 4 feet, measured from the bottom of the footing to the top of the wall. Some places set the limit lower, and walls that carry a slope, driveway or building above often need engineering at any height.",
      "Always add drainage gravel and a drain pipe behind the wall. Water pressure is the main cause of failures.",
      "Buy a few extra blocks, and from the same production lot, to avoid color differences.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How many blocks do I need for a retaining wall?",
        a: "Divide the wall's face area by one block's face area, or count courses and blocks per course. Add buried base courses and about 5% to 10% for cuts and breakage.",
      },
      {
        q: "How much gravel do I need behind a retaining wall?",
        a: "Typically a 12 inch wide column of clean gravel behind the full wall height, plus a compacted gravel base under the first course.",
      },
      {
        q: "How tall can a DIY retaining wall be?",
        a: "Model building codes commonly require a permit and engineered design above about 4 feet, measured from the footing to the top of the wall, and many towns set a lower limit of 2 to 3 feet. Walls that support a slope, driveway or building, and tiered walls, may need engineering even when they are shorter. Ask your local building department.",
      },
      {
        q: "Do I need cap blocks?",
        a: "Caps finish the top, hide hollow cores and are glued in place. Count one per cap length along the wall.",
      },
    ],
    related: ["gravel-calculator", "paver-base-calculator", "french-drain-calculator"],
    guide: "retaining-wall-materials-and-planning",
  },
  {
    slug: "paver-base-calculator",
    name: "Paver Base Calculator",
    category: "construction",
    group: "Hardscape",
    tagline: "Estimate base stone, bedding sand, pavers and edge restraint for a patio or walkway.",
    metaTitle: "Paver Base Calculator: Base Stone, Sand & Pavers",
    metaDescription:
      "Free paver base calculator. Enter patio size, base depth and paver dimensions to estimate base stone tons, bedding sand, number of pavers and total material cost.",
    keywords: ["paver base calculator", "paver patio calculator", "how much base for pavers", "paver sand calculator"],
    intro: [
      "A paver patio lasts when the base is right. A compacted layer of crushed stone, a thin layer of bedding sand, and the pavers themselves each need their own quantity.",
      "This calculator estimates all three from your patio dimensions, including an allowance for compaction and cuts, and tells you how deep to excavate.",
    ],
    steps: [
      "Enter the patio length and width.",
      "Set the compacted base depth and bedding sand depth.",
      "Enter the paver dimensions and an allowance for cuts.",
      "Enter your prices to estimate the material cost.",
    ],
    formula: [
      "Base cubic yards = area × base depth ÷ 12 ÷ 27 × (1 + compaction)",
      "Sand cubic yards = area × sand depth ÷ 12 ÷ 27",
      "Pavers = area ÷ one paver's area × (1 + waste)",
    ],
    example: [
      "A 16 × 12 ft patio (192 sq ft) on a 6 inch compacted base with 1 inch of sand needs about 5.97 tons of base stone and 0.8 tons of bedding sand. With 6 × 9 inch pavers and 10% for cuts, you need 564 pavers. Materials total about $980, and you should excavate roughly 9.4 inches below the finished level.",
    ],
    tips: [
      "Compact the base in lifts of no more than 2 to 4 inches.",
      "Keep the bedding sand to about 1 inch. Do not use sand to fix a poor base.",
      "Plan a slope of about 1/8 inch per foot away from buildings.",
      "Use edge restraint along every open side so pavers do not spread.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How deep should the base be for pavers?",
        a: "Patios and walkways typically need 4 to 6 inches of compacted base stone. Driveways need 8 to 12 inches or more, depending on soil and loads.",
      },
      {
        q: "How much sand do I need under pavers?",
        a: "About 1 inch of coarse bedding sand. For a 192 sq ft patio that is less than a cubic yard.",
      },
      {
        q: "What stone is used for a paver base?",
        a: "Compactable crushed stone with fines, such as dense-graded aggregate or crusher run, is common. Check local recommendations.",
      },
      {
        q: "How many pavers do I need?",
        a: "Divide the patio area by the area of one paver, then add 5% to 10% for cuts and breakage.",
      },
    ],
    related: ["gravel-calculator", "gravel-driveway-calculator", "retaining-wall-block-calculator"],
  },
  {
    slug: "excavation-volume-calculator",
    name: "Excavation Volume Calculator",
    category: "construction",
    group: "Excavation and Earthwork",
    tagline: "Convert an excavation's length, width and depth to bank yards, loose yards, tons and truck loads.",
    metaTitle: "Excavation Volume Calculator: Cubic Yards & Truck Loads",
    metaDescription:
      "Free excavation volume calculator. Enter length, width and depth to get cubic yards in place, loose volume after swell, weight in tons and number of truck loads.",
    keywords: ["excavation volume calculator", "dirt volume calculator", "cubic yards of dirt calculator", "swell factor calculator"],
    intro: [
      "Digging a hole removes a measurable volume of soil, but that soil takes up more space once it is loosened. Excavators work from in-place (bank) yards, while trucks carry loose yards, so both numbers matter.",
      "This calculator converts the size of the excavation into bank volume, applies a swell factor to find the loose volume, and estimates the weight and number of truck loads.",
    ],
    steps: [
      "Enter the length, width and depth of the excavation in feet.",
      "Choose a swell factor for your soil type.",
      "Enter the loose weight of the soil and the capacity of your trucks.",
      "Read the bank volume, loose volume, loads and weight.",
    ],
    formula: [
      "Bank cubic yards = length × width × depth ÷ 27",
      "Loose cubic yards = bank yards × (1 + swell)",
      "Truck loads = loose yards ÷ truck capacity (rounded up)",
    ],
    example: [
      "A 40 × 30 ft excavation 4 feet deep contains 177.8 cubic yards in place. With a 25% swell it becomes 222.2 loose cubic yards, weighing about 289 tons at 1.3 tons per yard, which is 23 loads in a 10 yd³ truck.",
    ],
    tips: [
      "Swell is higher in clay and lower in sand and gravel. Use your geotechnical report if you have one.",
      "Excavations with sloped sides contain more soil than vertical ones. Add them to your dimensions.",
      "Call 811 before you dig to locate buried utilities.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How do I calculate cubic yards of dirt?",
        a: "Multiply length, width and depth in feet to get cubic feet, then divide by 27.",
      },
      {
        q: "What is the swell factor in excavation?",
        a: "It is the percentage by which soil expands when dug. Common soil swells about 25%, clay about 25% to 40% depending on moisture, and sand or gravel roughly 10% to 15%.",
      },
      {
        q: "How many cubic yards does a dump truck hold?",
        a: "A tandem truck commonly carries about 10 to 16 cubic yards of loose material, a single-axle about 5 to 8 and a tri-axle about 12 to 20, subject to weight limits.",
      },
      {
        q: "How much does a cubic yard of dirt weigh?",
        a: "Loose soil is often 1.1 to 1.5 tons per cubic yard depending on moisture and type.",
      },
    ],
    related: ["excavation-cost-calculator", "dump-truck-load-calculator", "fill-dirt-calculator"],
    guide: "excavation-swell-and-truck-loads",
  },
  {
    slug: "dump-truck-load-calculator",
    name: "Dump Truck Load Calculator",
    category: "construction",
    group: "Excavation and Earthwork",
    tagline: "Find how many truck loads you need, checking both bed volume and the weight limit.",
    metaTitle: "Dump Truck Load Calculator: How Many Loads Do You Need?",
    metaDescription:
      "Free dump truck load calculator. Enter material volume, weight and truck capacity to see how many loads you need and whether volume or weight is the limit.",
    keywords: ["dump truck load calculator", "how many yards in a dump truck", "truck loads calculator", "dump truck capacity"],
    intro: [
      "A dump truck is limited by two things: the size of its bed and the weight it can legally carry. Light material such as mulch fills the bed first, while heavy material such as wet clay or gravel can hit the weight limit with the bed only partly full.",
      "This calculator checks both limits, tells you which one controls, and gives the number of loads and a hauling cost.",
    ],
    steps: [
      "Enter the volume of material to move in loose cubic yards.",
      "Enter the weight per cubic yard of the material.",
      "Enter the truck's bed capacity and payload limit.",
      "Add the trucking cost per load to estimate hauling.",
    ],
    formula: [
      "Weight of a full bed = truck volume × material weight per yard",
      "Per-load yards = the smaller of bed volume and payload ÷ material weight",
      "Loads = total yards ÷ per-load yards (rounded up)",
    ],
    example: [
      "Moving 60 cubic yards of gravel at 1.4 tons a yard in a 12 yd³ truck with a 14 ton payload: a full bed would weigh 16.8 tons, so weight is the limit and each load carries about 10 yd³. That takes 6 loads for 84 tons, around $1,050 at $175 a load.",
    ],
    tips: [
      "Ask your hauler for the real payload, which depends on the truck, tires and local limits.",
      "Do not overload. It is unsafe and can result in fines.",
      "Wet material weighs more. Plan for the heaviest condition.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How many cubic yards fit in a dump truck?",
        a: "Roughly 5 to 8 for a single-axle truck, 10 to 16 for a tandem and 12 to 20 for a tri-axle, but heavy material may reach the weight limit first.",
      },
      {
        q: "How many tons can a dump truck carry?",
        a: "It varies by truck and state. Typical payloads are roughly 12 to 18 tons for tandems and 15 to 25 tons for tri-axles, limited by axle and bridge laws. Published figures vary, so confirm with the hauler.",
      },
      {
        q: "Why does the calculator show weight as the limit?",
        a: "Dense material such as gravel or wet soil can exceed the payload before the bed is full, so loads must be smaller than the bed volume.",
      },
    ],
    related: ["excavation-volume-calculator", "excavation-cost-calculator", "fill-dirt-calculator"],
    guide: "excavation-swell-and-truck-loads",
  },
  {
    slug: "fill-dirt-calculator",
    name: "Fill Dirt Calculator",
    category: "construction",
    group: "Excavation and Earthwork",
    tagline: "Estimate how much fill dirt to order, allowing for compaction, with tons, loads and cost.",
    metaTitle: "Fill Dirt Calculator: Cubic Yards, Tons & Cost",
    metaDescription:
      "Free fill dirt calculator. Enter area and depth, allow for compaction, and get cubic yards to order, tons, truck loads and estimated cost including delivery.",
    keywords: ["fill dirt calculator", "how much fill dirt do I need", "fill dirt tons calculator", "dirt calculator"],
    intro: [
      "Fill dirt settles and compacts after it is placed, so the amount you order has to be larger than the finished volume. Ordering exactly the finished volume usually leaves you short.",
      "This calculator works backwards from the finished fill, applies a compaction shrink, and reports cubic yards, tons, truck loads and cost with delivery.",
    ],
    steps: [
      "Enter the length, width and depth of the area you need to fill.",
      "Set a compaction allowance, typically 10% to 20%.",
      "Enter the loose weight of the dirt and your truck size.",
      "Enter the price per yard and delivery fee.",
    ],
    formula: [
      "Finished yards = length × width × depth in inches ÷ 12 ÷ 27",
      "Yards to order = finished yards ÷ (1 − compaction shrink)",
      "Tons = yards to order × loose weight per yard",
    ],
    example: [
      "To raise a 30 × 20 ft area by 12 inches, you need 22.2 cubic yards of finished fill. With 15% compaction shrink, order about 26.1 cubic yards (31.4 tons at 1.2 tons per yard), roughly 3 truck loads. At $18 a yard plus $60 per delivery the estimate is about $651.",
    ],
    tips: [
      "Compact in thin layers, around 6 to 8 inches at a time, for the best result.",
      "Use clean fill without debris, and ask the supplier what it contains.",
      "Fill dirt is not topsoil. Plan a layer of topsoil on top for planting.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much fill dirt do I need?",
        a: "Multiply area by fill depth to get the finished volume, then increase it by 10% to 20% for compaction, and convert to cubic yards.",
      },
      {
        q: "How much does a cubic yard of fill dirt weigh?",
        a: "Loose fill is typically about 1.1 to 1.4 tons per cubic yard, depending on moisture and soil type.",
      },
      {
        q: "What is the difference between fill dirt and topsoil?",
        a: "Fill dirt is subsoil used to raise or level ground and is not meant for planting. Topsoil is rich in organic matter and is placed on top for lawns and gardens.",
      },
    ],
    related: ["excavation-volume-calculator", "dump-truck-load-calculator", "gravel-calculator"],
    guide: "excavation-swell-and-truck-loads",
  },
  {
    slug: "excavation-cost-calculator",
    name: "Excavation Cost Calculator",
    category: "construction",
    group: "Excavation and Earthwork",
    tagline: "Build a planning estimate for digging, hauling, dump fees and machine delivery.",
    metaTitle: "Excavation Cost Calculator: Digging, Hauling & Disposal",
    metaDescription:
      "Free excavation cost calculator. Estimate digging, hauling, disposal fees, machine delivery and contingency from the size of the excavation and your local rates.",
    keywords: ["excavation cost calculator", "how much does excavation cost", "dirt removal cost", "excavation cost per yard"],
    intro: [
      "Excavation prices vary widely with soil, access, distance to the dump and local labor costs, so a flat cost-per-yard number can mislead. A better estimate breaks the job into digging, hauling, disposal and delivery of the machine.",
      "This calculator uses your own local rates, with editable defaults, to produce a planning estimate and shows the cost per in-place cubic yard.",
    ],
    steps: [
      "Enter the length, width and depth of the excavation, and a swell factor.",
      "Enter the digging and loading rate per cubic yard.",
      "Enter the truck capacity, hauling cost per load and dump fee per ton.",
      "Add machine delivery and a contingency, then read the total.",
    ],
    formula: [
      "Digging = bank yards × digging rate",
      "Hauling = loads × hauling rate",
      "Disposal = loose yards × weight per yard × dump fee per ton",
      "Total = (digging + hauling + disposal + delivery) × (1 + contingency)",
    ],
    example: [
      "Digging 177.8 in-place cubic yards (222 loose yards, 23 loads) at $14 a yard, $175 a load, a $12 a ton dump fee and $350 for machine delivery comes to about $10,330, plus a 10% contingency, for a total near $11,364. That is about $64 per in-place cubic yard, but the figure changes sharply with haul distance and disposal costs.",
    ],
    tips: [
      "The default prices are illustrative. Replace them with quotes from local contractors.",
      "Keeping the soil on site, for example as fill, removes hauling and dump fees.",
      "Rock, groundwater and tight access can multiply digging costs. Add contingency.",
      "Call 811 before you dig, and ask whether permits or shoring are needed.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much does excavation cost per cubic yard?",
        a: "Digging alone is often priced in the low tens of dollars per cubic yard, but when hauling and disposal are included, the all-in cost per yard can be several times higher. It depends heavily on your area.",
      },
      {
        q: "What affects excavation cost the most?",
        a: "Hauling distance, disposal fees, soil type, depth, site access and whether rock or water is encountered.",
      },
      {
        q: "Can I reduce excavation costs?",
        a: "Reusing soil on site, scheduling when machines are available and getting multiple quotes can all help.",
      },
    ],
    related: ["excavation-volume-calculator", "dump-truck-load-calculator", "fill-dirt-calculator"],
    guide: "excavation-swell-and-truck-loads",
  },
];
