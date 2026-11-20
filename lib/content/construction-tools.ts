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
      "Ordering the right amount of gravel saves a second delivery fee and a half-finished project. Suppliers sell gravel by the ton or the cubic yard, but most people measure a project in feet and inches, so a conversion is needed before you can place the order. Getting that conversion wrong is the most common reason for a shortfall.",
      "This calculator turns the length, width and depth of your area into cubic feet, cubic yards and tons, and it also gives the number of 0.5 cubic foot bags for small jobs. It adds an allowance for settling and compaction, then estimates the cost from the delivered price per ton that you enter.",
      "Depth is the input that changes the answer most. A path that is two inches deep needs a fraction of the material of a driveway that is four inches deep, so decide on the finished depth before you measure. The depth table on the page shows the same area at several depths so you can compare options quickly.",
    ],
    steps: [
      "Measure the length and width of the area in feet.",
      "Enter the depth in inches. Paths often use 2 to 3 inches, and driveways commonly use 4 to 8 inches built in layers.",
      "Adjust the material weight if your supplier gives a different figure per cubic yard.",
      "Enter the delivered price per ton to see the estimated cost.",
    ],
    formula: [
      "Cubic feet = length (ft) × width (ft) × depth (in) ÷ 12",
      "Cubic yards = cubic feet ÷ 27, plus an allowance for settling",
      "Tons = cubic yards × material weight (about 1.4 tons per yard for gravel)",
      "Bags (0.5 cubic foot) = cubic feet ÷ 0.5",
    ],
    example: [
      "Step 1: Volume. A 20 ft by 10 ft area is 200 square feet. Three inches of depth is 0.25 feet, so the volume is 200 × 0.25 = 50 cubic feet.",
      "Step 2: Cubic yards and settling. 50 cubic feet ÷ 27 is about 1.85 cubic yards. Adding a 5% allowance for settling gives about 1.94 cubic yards.",
      "Step 3: Tons. At 1.4 tons per cubic yard, 1.94 yards is about 2.72 tons.",
      "Step 4: Cost. At $40 a ton the material costs about $109. The depth table shows the same area at 1 inch (about 0.65 cubic yards, $36) and 2 inches (about 1.3 cubic yards, $73), which helps you choose.",
      "Step 5: Bags. The same volume is about 105 bags of 0.5 cubic feet, which is only sensible for very small jobs, because bulk delivery is usually cheaper per ton.",
    ],
    tips: [
      "Order slightly more than you need. A small top-up delivery often costs more than the extra material, and gravel from a different batch may not match.",
      "Ask the supplier for the actual weight per cubic yard of the product you are buying. Wet or fine material is heavier than dry, coarse stone.",
      "Compact the base before adding the next layer, and order extra for compaction on driveways and paths that will carry vehicles.",
      "Depth matters more than length or width. Doubling the depth doubles the tons, so test the depth before you measure the whole area.",
      "Check how the delivery is priced. Some suppliers charge a minimum load or a separate delivery fee that changes the cost per ton.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How do I calculate how much gravel I need?",
        a: "Multiply length by width in feet and by depth in feet (inches divided by 12) to get cubic feet. Divide by 27 for cubic yards, then multiply by the material weight to get tons.",
      },
      {
        q: "How many tons are in a cubic yard of gravel?",
        a: "Most gravel and crushed stone weighs between 1.3 and 1.5 tons per cubic yard, about 2,600 to 3,000 pounds. Wet or fine material can be heavier, and some products are lighter.",
      },
      {
        q: "How deep should gravel be?",
        a: "Walkways and garden paths commonly use 2 to 3 inches. Patio bases use 4 to 6 inches, and driveways use 6 to 8 inches built in compacted layers.",
      },
      {
        q: "Should I order by the ton or by the yard?",
        a: "Either works if you know the conversion. Many quarries sell by the ton, while landscape yards often sell by the cubic yard. Compare the delivered price per ton using this calculator.",
      },
      {
        q: "Why do I need more gravel than the volume suggests?",
        a: "Gravel compacts when it is rolled and some sinks into the soil underneath. A 5% to 10% allowance covers that, and more is sensible on soft ground.",
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
      "A durable gravel driveway is built in layers: a coarse base for strength and drainage, and a finer surface layer that locks together under traffic. Each layer needs a different stone and quantity, so a single depth estimate often leads to under-ordering or to the wrong product.",
      "This calculator works out both layers from the driveway's size and your chosen depths, adds an allowance for compaction, and totals the cost of the two stones and delivery. It also reports the cost per square foot, which makes it easier to compare quotes from different suppliers.",
      "A driveway fails most often because of water, not thickness. The surface needs a slight crown and a ditch or drain on each side, and the base must be well compacted. The calculator gives the quantities, but the build quality decides how long the driveway lasts.",
    ],
    steps: [
      "Enter the length and width of the driveway in feet.",
      "Set the base layer depth and the surface layer depth in inches.",
      "Add an allowance for compaction, typically 10% to 20%.",
      "Enter the price per ton for each stone and your delivery charge to see the total.",
    ],
    formula: [
      "Layer cubic yards = length × width × depth (in) ÷ 12 ÷ 27 × (1 + compaction)",
      "Layer tons = cubic yards × material weight",
      "Total cost = base cost + surface cost + delivery",
      "Cost per square foot = total cost ÷ (length × width)",
    ],
    example: [
      "Step 1: Area. A 60 ft by 12 ft driveway is 720 square feet.",
      "Step 2: Base layer. A 4 inch base is 720 × 4 ÷ 12 = 240 cubic feet, or 8.9 cubic yards. With a 15% compaction allowance it is about 10.2 cubic yards, or 14.3 tons at 1.4 tons per yard.",
      "Step 3: Surface layer. A 2 inch surface is 120 cubic feet, or 4.4 cubic yards. With the same allowance it is about 5.1 cubic yards, or 7.2 tons.",
      "Step 4: Cost. Base stone at $35 a ton costs about $501, surface stone at $42 a ton costs about $301, and delivery adds $150. The total is about $951, or $1.32 per square foot.",
      "Step 5: Check. The whole driveway needs about 21.5 tons. If you ordered only the surface quantity, you would have a thin, unstable road that would soon need rebuilding.",
    ],
    tips: [
      "Good drainage matters more than thickness. Crown the driveway, use ditches on both sides and keep water from pooling at the entrance.",
      "A geotextile fabric under the base helps on soft soil and keeps the stone layers from mixing into the ground.",
      "Expect to top up the surface every few years as stone migrates and ruts form, especially where cars turn or brake.",
      "Order the base first and compact it in lifts. Adding surface stone to an uncompacted base wastes material.",
      "Delivery charges can be a large share of a small order, so ask for a single delivery rather than several smaller loads.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much gravel do I need for a driveway?",
        a: "Multiply length by width by depth to get volume, convert to cubic yards, then to tons. A 60 by 12 ft driveway with 6 inches of total depth needs roughly 20 tons before compaction, and a little more with a 15% allowance.",
      },
      {
        q: "What size gravel is best for a driveway?",
        a: "A common build uses larger base stone, such as 2 to 3 inch crushed stone, and a smaller angular surface stone such as crusher run or 3/4 inch minus that compacts firmly. Local suppliers will recommend what works in your soil.",
      },
      {
        q: "How thick should a gravel driveway be?",
        a: "Most are 6 to 8 inches thick in total, built in two or three compacted layers. Soft soil or heavy vehicles call for more.",
      },
      {
        q: "Why order extra gravel for a driveway?",
        a: "Loose stone compacts when rolled and some is lost into the subsoil, so adding 10% to 20% avoids a shortfall at the end of the job.",
      },
      {
        q: "How often does a gravel driveway need more stone?",
        a: "Many driveways need a light top-up every two to five years, depending on traffic, rainfall and how well the base was built.",
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
      "A French drain moves groundwater away from a foundation or a soggy yard using a gravel-filled trench with a perforated pipe inside. It works only if the materials are right and the trench slopes toward a proper outlet. The three main purchases, pipe, clean gravel and filter fabric, are each sized from the trench.",
      "This calculator subtracts the volume of the pipe from the trench, so you do not over-order gravel. It works out how much pipe you need, adds a small allowance for cuts, and calculates the fabric needed to wrap the stone around the whole trench with an overlap. It then totals the materials at the prices you enter.",
      "Length, width and depth decide the cost. Deeper trenches intercept more water but need more digging, more gravel and more fabric. Before you buy, confirm the outlet location, because a drain that discharges onto a neighbor's land or into a low spot can create a bigger problem.",
    ],
    steps: [
      "Enter the length of the drain, and the trench width and depth in inches.",
      "Choose the pipe diameter, usually 4 inches for residential drains.",
      "Add a small waste allowance for extra pipe and gravel.",
      "Enter local prices for gravel, pipe and fabric to see the materials cost.",
    ],
    formula: [
      "Trench volume = length × width × depth",
      "Pipe volume = π × (pipe radius)² × length",
      "Gravel volume = (trench volume − pipe volume) × (1 + waste)",
      "Fabric = length × (2 × depth + width + 12 in overlap)",
    ],
    example: [
      "Step 1: Trench volume. A 50 ft drain that is 12 inches (1 ft) wide and 24 inches (2 ft) deep has a trench of 50 × 1 × 2 = 100 cubic feet.",
      "Step 2: Subtract the pipe. A 4 inch pipe takes about 4.4 cubic feet over 50 feet, so the gravel space is about 95.6 cubic feet.",
      "Step 3: Add waste and convert. A 10% allowance makes it about 105 cubic feet, or 3.9 cubic yards. At 1.4 tons per yard that is about 5.5 tons of gravel.",
      "Step 4: Pipe and fabric. Pipe at 10% extra is 55 feet. Fabric is 50 × (2 × 2 + 1 + 1) = 330 square feet, wrapping the stone with an overlap.",
      "Step 5: Cost. At the default prices, gravel is about $245, pipe about $138 and fabric about $99, so the materials cost about $482 before digging or disposal.",
    ],
    tips: [
      "Slope the trench about 1% (one inch of fall every eight feet) toward a safe outlet, and keep the slope continuous.",
      "Use clean washed stone, and place the perforated pipe with the holes facing down so water enters from the bottom.",
      "Wrap the stone, not the pipe, with filter fabric to keep silt out while letting water in.",
      "Check where the water will exit. Do not drain onto a neighbor's land, and check local rules about discharging to storm drains.",
      "Call 811 before you dig to find buried utilities, which often run close to the surface near homes.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much gravel do I need for a French drain?",
        a: "Multiply trench length, width and depth to get cubic feet, subtract the pipe volume, and convert to cubic yards and tons. The calculator does this and adds an allowance for settling.",
      },
      {
        q: "How deep should a French drain be?",
        a: "Often 18 to 36 inches. It should be deep enough to catch the water you want to remove, with a continuous slope down to the outlet.",
      },
      {
        q: "What size pipe should I use?",
        a: "Four-inch perforated pipe is the common choice for residential drains. Larger pipe can be used for long runs or heavy flows, but it costs more and needs more gravel.",
      },
      {
        q: "Does a French drain need filter fabric?",
        a: "In most soils, yes. Fabric keeps fine soil from clogging the stone and pipe over time, which is the most common reason a drain stops working.",
      },
      {
        q: "Can a French drain go in a wet area all year?",
        a: "It works best where the water table is below the trench. If the ground stays saturated, the drain may only move water slowly, and a larger system or a different solution may be needed.",
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
      "A segmental retaining wall is built from stacked interlocking blocks on a compacted gravel base, with drainage gravel behind it. The block count depends on both the wall's size and the face dimensions of the block you choose, and most mistakes come from miscounting courses or forgetting the buried base.",
      "This calculator counts the visible courses plus any buried courses, works out the blocks per course from the wall length, adds cap blocks and a waste allowance for cuts, and estimates the base and backfill gravel and the materials cost. It shows the visible face area so you can check the scale of the wall.",
      "Height is the factor that carries the most risk. Walls taller than the limits in local codes need engineered designs and permits, and water pressure behind the wall is the usual reason a wall fails. Use the calculator for quantities, then confirm the design with your building department or an engineer.",
    ],
    steps: [
      "Enter the wall length and the visible height in feet.",
      "Enter the face width and height of your block, and the length of the cap block, in inches.",
      "Set the number of buried base courses and an allowance for cuts.",
      "Enter the gravel backfill and base dimensions, and the unit prices.",
    ],
    formula: [
      "Courses = ceil(visible height × 12 ÷ block height) + buried courses",
      "Blocks per course = ceil(length × 12 ÷ block width)",
      "Wall blocks = courses × blocks per course × (1 + waste)",
      "Gravel = (length × height × backfill width) + (length × base width × base depth)",
    ],
    example: [
      "Step 1: Courses. A 3 ft wall with 6 inch blocks has 3 × 12 ÷ 6 = 6 visible courses, plus 1 buried course, for 7 in total.",
      "Step 2: Blocks per course. A 30 ft wall with 16 inch blocks needs 30 × 12 ÷ 16 = 22.5, which rounds up to 23 blocks per course.",
      "Step 3: Wall blocks. 7 courses × 23 blocks is 161, plus 8% for cuts, gives 174 blocks.",
      "Step 4: Cap blocks. A 12 inch cap covers 12 inches of wall, so a 30 ft wall needs 30 caps. The waste allowance applies to wall blocks only.",
      "Step 5: Gravel and cost. The backfill and base need about 4.4 cubic yards, or 6.2 tons, of gravel. At the default prices, blocks cost about $783, caps $120 and gravel $280, a total of about $1,183.",
    ],
    tips: [
      "Many codes require a permit and an engineer for walls above about 4 feet, measured from the bottom of the footing to the top of the wall. Some places set the limit lower, and walls supporting a slope, driveway or building often need engineering at any height.",
      "Always add drainage gravel and a perforated drain pipe behind the wall. Water pressure is the main cause of retaining wall failures.",
      "Buy a few extra blocks from the same production lot to avoid colour differences between batches.",
      "Lay the first course level and compact the base. A poor first course causes every course above it to misalign.",
      "Plan the cap placement early. Caps are glued in place and hide the hollow cores, so count them by the wall length, not by the block count.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How many blocks do I need for a retaining wall?",
        a: "Count the courses and blocks per course, or divide the wall's face area by the face area of one block. Add buried base courses and about 5% to 10% for cuts and breakage.",
      },
      {
        q: "How much gravel do I need behind a retaining wall?",
        a: "Typically a 12 inch wide column of clean gravel behind the full wall height, plus a compacted gravel base under the first course. Taller or wetter sites may need more.",
      },
      {
        q: "How tall can a DIY retaining wall be?",
        a: "Model building codes commonly require a permit and engineered design above about 4 feet, measured from the footing to the top of the wall, and many towns set a lower limit of 2 to 3 feet. Walls that support a slope, driveway or building, and tiered walls, may need engineering even when they are shorter. Ask your local building department.",
      },
      {
        q: "Do I need cap blocks?",
        a: "Caps finish the top, hide the hollow cores and are glued in place. Count one per cap length along the wall.",
      },
      {
        q: "Why does the first course matter so much?",
        a: "Every block above depends on the first course being level and on a compacted base. A small error at the bottom becomes a visible lean at the top.",
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
      "A paver patio lasts when the base is right. Most paver failures, such as sinking, heaving and uneven joints, come from a thin or poorly compacted base rather than from the pavers themselves. A patio needs three things: a compacted layer of crushed stone, a thin layer of bedding sand, and the pavers with their joint sand.",
      "This calculator estimates the base stone and bedding sand from your patio dimensions, including an allowance for compaction, and counts the pavers with an allowance for cuts. It also shows the materials cost and reminds you how much to excavate, because the base is the part you cannot easily fix later.",
      "Edge restraint is the other detail that matters. Pavers need a restraint along every open edge to stop them spreading under foot traffic. The calculator shows the length needed, so you can plan it into the budget.",
    ],
    steps: [
      "Enter the patio length and width in feet.",
      "Set the compacted base depth and the bedding sand depth in inches.",
      "Enter the paver dimensions and an allowance for cuts and breakage.",
      "Enter your prices to estimate the material cost.",
    ],
    formula: [
      "Base cubic yards = area × base depth (ft) ÷ 27 × (1 + compaction)",
      "Sand cubic yards = area × sand depth (ft) ÷ 27",
      "Pavers = area ÷ one paver's area × (1 + waste)",
      "Edge restraint = perimeter of the open edges",
    ],
    example: [
      "Step 1: Area. A 16 ft by 12 ft patio is 192 square feet.",
      "Step 2: Base stone. A 6 inch compacted base is 192 × 0.5 = 96 cubic feet, or 3.6 cubic yards. A 20% compaction allowance brings it to about 4.3 cubic yards, or 6 tons at 1.4 tons per yard.",
      "Step 3: Bedding sand. One inch of sand is 16 cubic feet, or 0.6 cubic yards, which is about 0.8 tons.",
      "Step 4: Pavers. Each 9 by 6 inch paver covers 0.375 square feet, so 192 square feet needs 512 pavers. Adding 10% for cuts gives 564.",
      "Step 5: Cost. At the default prices, base stone is about $239, sand about $36 and pavers about $705, a total of about $980. Excavate to the base depth plus the sand and the paver thickness, measured from the finished level.",
    ],
    tips: [
      "Compact the base in lifts of no more than 2 to 4 inches, and check the surface with a level before you add sand.",
      "Keep the bedding sand to about 1 inch. Do not use sand to fix a poor base.",
      "Plan a slope of about 1/8 inch per foot away from buildings so rain runs off.",
      "Use edge restraint along every open side so the pavers do not spread or creep outward over time.",
      "Pavers are sold with a small allowance for breakage. Buy from the same batch so colours match.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How deep should the base be for pavers?",
        a: "Patios and walkways typically need 4 to 6 inches of compacted base stone. Driveways need 8 to 12 inches or more, depending on soil and loads.",
      },
      {
        q: "How much sand do I need under pavers?",
        a: "About 1 inch of coarse bedding sand. For a 192 square foot patio that is less than one cubic yard.",
      },
      {
        q: "What stone is used for a paver base?",
        a: "Compactable crushed stone with fines, such as dense-graded aggregate or crusher run, is common. Check local recommendations, because the best product depends on your soil.",
      },
      {
        q: "How many pavers do I need?",
        a: "Divide the patio area by the area of one paver, then add 5% to 10% for cuts and breakage. Patterns with many cuts, such as herringbone, need more.",
      },
      {
        q: "Why do pavers sink or shift?",
        a: "The most common causes are a thin or uncompacted base, poor drainage and missing edge restraint. Fixing the base is usually the only lasting repair.",
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
      "Digging a hole removes a measurable volume of soil, but that soil takes up more space once it is loosened. Excavators work from in-place (bank) cubic yards, while trucks carry loose cubic yards, so both numbers matter when you plan hauling and quote disposal.",
      "This calculator converts the size of the excavation into bank volume, applies a swell factor to find the loose volume, and estimates the weight and the number of truck loads. The result shows how many trips a job needs before you call a hauler.",
      "The swell factor is the biggest source of error. Clay swells more than sand, and wet soil weighs more than dry. The calculator lets you enter your own values, so use a geotechnical report or local data if you have it.",
    ],
    steps: [
      "Enter the length, width and depth of the excavation in feet.",
      "Choose a swell factor for your soil type.",
      "Enter the loose weight of the soil and the capacity of your trucks.",
      "Read the bank volume, loose volume, number of loads and weight.",
    ],
    formula: [
      "Bank cubic yards = length × width × depth ÷ 27",
      "Loose cubic yards = bank yards × (1 + swell)",
      "Weight (tons) = loose yards × loose weight per yard",
      "Truck loads = loose yards ÷ truck capacity (rounded up)",
    ],
    example: [
      "Step 1: Bank volume. A 40 ft by 30 ft excavation 4 ft deep is 4,800 cubic feet. Divided by 27, that is 177.8 bank cubic yards.",
      "Step 2: Loose volume. With a 25% swell the soil fills 177.8 × 1.25, or about 222.2 loose cubic yards. That is the number a hauler needs to plan.",
      "Step 3: Weight. At about 1.3 tons per loose yard, the spoil weighs about 289 tons.",
      "Step 4: Truck loads. A 10 cubic yard truck carries 222.2 ÷ 10, which is 22.2, so you need 23 loads.",
      "Step 5: Use. Those loads and weights are what you would send to a hauler or use to size a stockpile on site.",
    ],
    tips: [
      "Swell is higher in clay and lower in sand and gravel. Use your geotechnical report or local data where you can.",
      "Excavations with sloped sides contain more soil than vertical ones. Add the slope allowance to your dimensions.",
      "Weight depends on moisture. Plan for the heaviest condition if you are working after rain.",
      "Call 811 before you dig to locate buried utilities. Digging without that step is a legal and safety risk.",
      "Plan for the spoil. Where it will go, and whether you can reuse it as fill, can change the cost more than the volume does.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How do I calculate cubic yards of dirt?",
        a: "Multiply length, width and depth in feet to get cubic feet, then divide by 27 to get cubic yards.",
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
        a: "Loose soil is often 1.1 to 1.5 tons per cubic yard, depending on moisture and type. Clay and wet soil are at the heavier end.",
      },
      {
        q: "Why is the loose volume bigger than the hole?",
        a: "Digging breaks the soil into pieces with air between them. Those gaps mean the same material takes up more space in a truck than it did in the ground.",
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
      "A dump truck is limited by two things: the size of its bed and the weight it can legally carry. Light material such as mulch fills the bed before it reaches the weight limit. Heavy material such as wet clay or gravel can hit the weight limit with the bed only partly full, so a truck that looks big enough may still need extra trips.",
      "This calculator checks both limits, tells you which one controls each load, and gives the number of loads and an estimated hauling cost. It is useful for planning the schedule and checking a hauler's quote before you agree to it.",
      "The payload on paper is not always what a truck can carry on the road. Axle limits, bridge limits and local rules can reduce the legal load, so use the number your hauler gives you for your route.",
    ],
    steps: [
      "Enter the volume of material to move in loose cubic yards.",
      "Enter the weight per cubic yard of the material.",
      "Enter the truck's bed capacity and the payload limit.",
      "Add the trucking cost per load to estimate hauling.",
    ],
    formula: [
      "Weight of a full bed = bed volume × material weight per yard",
      "Per-load yards = the smaller of the bed volume and payload ÷ material weight",
      "Loads = total yards ÷ per-load yards (rounded up)",
      "Hauling cost = loads × cost per load",
    ],
    example: [
      "Step 1: Total. You need to move 60 cubic yards of gravel at 1.4 tons per yard. That is 84 tons in total.",
      "Step 2: Volume check. A 12 cubic yard bed filled with gravel would weigh 12 × 1.4 = 16.8 tons.",
      "Step 3: Weight check. The truck's payload is 14 tons, so the bed cannot be filled. Weight is the limit, and each load carries 14 ÷ 1.4 = 10 cubic yards.",
      "Step 4: Loads. 60 ÷ 10 = 6 loads. The truck carries 84 tons in six trips.",
      "Step 5: Cost. At $175 a load, hauling costs about $1,050. Planning the trips this way shows the cost rises with weight, not bed size.",
    ],
    tips: [
      "Ask your hauler for the real payload, which depends on the truck, its tyres and local limits.",
      "Do not overload. Overloading is unsafe, damages roads and can result in fines.",
      "Wet material weighs more. Plan for the heaviest condition, especially after rain.",
      "Light material such as mulch or topsoil often fills the bed first, so volume is the limit for those loads.",
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
      {
        q: "Is it cheaper to haul in fewer, fuller loads?",
        a: "Usually yes, but only within the legal limit. Overloading is not an option, so the cheapest plan is the one that uses the maximum legal load for the material.",
      },
      {
        q: "How do I know how much a load weighs?",
        a: "Use the density of your material. Ask the supplier for the weight per cubic yard, and check the truck's ticket after loading.",
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
      "Fill dirt settles and compacts after it is placed, so the amount you order has to be larger than the finished volume. Ordering exactly the finished volume usually leaves you short, and the shortfall is often discovered after the delivery fee has been paid.",
      "This calculator works backward from the finished fill you need, applies a compaction allowance, and reports the cubic yards to order, the tons, the number of truck loads and the cost including delivery. It assumes the material is placed and compacted in layers.",
      "Fill is not topsoil. Subsoil fill is good for raising or levelling ground, but a planting bed needs a layer of topsoil on top. The calculator covers the fill only, so add topsoil separately if you plan to plant.",
    ],
    steps: [
      "Enter the length, width and finished depth of the area you need to fill, in feet and inches.",
      "Set a compaction allowance, typically 10% to 20%.",
      "Enter the loose weight of the dirt and your truck size.",
      "Enter the price per yard and the delivery fee per load.",
    ],
    formula: [
      "Finished yards = length × width × depth (in) ÷ 12 ÷ 27",
      "Yards to order = finished yards ÷ (1 − compaction shrink)",
      "Tons = yards to order × loose weight per yard",
      "Cost = yards to order × price per yard + loads × delivery fee",
    ],
    example: [
      "Step 1: Finished volume. A 30 ft by 20 ft area raised by 12 inches is 600 cubic feet, or 22.2 cubic yards of finished fill.",
      "Step 2: Order quantity. With 15% compaction shrink, you need to order 22.2 ÷ 0.85, about 26.1 cubic yards.",
      "Step 3: Weight and loads. At 1.2 tons per yard, the order is about 31.4 tons. A 10 yard truck means 3 loads.",
      "Step 4: Cost. At $18 a yard the material costs about $470. Delivery at $60 a load adds $180, so the total is about $651.",
      "Step 5: Check. Compact in layers of 6 to 8 inches. If you compact the whole depth at once you will not reach the density you need.",
    ],
    tips: [
      "Compact in thin layers, around 6 to 8 inches at a time, for the best result. Thick layers do not compact fully.",
      "Use clean fill without debris, and ask the supplier what it contains. Old concrete or organic matter settles unevenly.",
      "Fill dirt is not topsoil. Plan a layer of topsoil on top of the fill if you will plant.",
      "Ask how the price is charged. Some suppliers quote by the load, some by the yard, and some by the ton.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much fill dirt do I need?",
        a: "Multiply the area by the fill depth to get the finished volume, increase it by 10% to 20% for compaction, and convert to cubic yards.",
      },
      {
        q: "How much does a cubic yard of fill dirt weigh?",
        a: "Loose fill is typically about 1.1 to 1.4 tons per cubic yard, depending on moisture and soil type.",
      },
      {
        q: "What is the difference between fill dirt and topsoil?",
        a: "Fill dirt is subsoil used to raise or level ground and is not meant for planting. Topsoil is rich in organic matter and is placed on top for lawns and gardens.",
      },
      {
        q: "Why is the compaction allowance so important?",
        a: "Loose fill shrinks as it is compacted. Without an allowance, the finished area ends up lower than planned, and you need a second delivery.",
      },
      {
        q: "Can I place fill in one thick layer?",
        a: "It is better not to. Thick layers do not compact well at the bottom, and they settle unevenly later. Place and compact in thinner lifts.",
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
      "Excavation prices vary widely with soil, access, distance to the dump and local labour costs, so a flat cost-per-yard figure can mislead. A better estimate breaks the job into digging, hauling, disposal and the delivery of the machine, then adds a contingency for surprises.",
      "This calculator uses your own local rates, with editable defaults, to produce a planning estimate. It starts from the volume of the excavation, applies the swell factor and the truck capacity, and shows the total and the cost per in-place cubic yard so you can compare quotes.",
      "The default prices are only examples. Use the calculator to see which line drives the cost. For many jobs, hauling and dump fees are larger than the digging itself, so reusing soil on site can save more than a cheaper machine.",
    ],
    steps: [
      "Enter the length, width and depth of the excavation, and the swell factor for the soil.",
      "Enter the digging and loading rate per cubic yard.",
      "Enter the truck capacity, the hauling cost per load and the dump fee per ton.",
      "Add the machine delivery and a contingency, then read the total.",
    ],
    formula: [
      "Digging = bank yards × digging rate",
      "Hauling = loads × hauling rate per load",
      "Disposal = loose yards × weight per yard × dump fee per ton",
      "Total = (digging + hauling + disposal + delivery) × (1 + contingency)",
    ],
    example: [
      "Step 1: Volume. A 40 ft by 30 ft excavation 4 ft deep is 177.8 bank yards, or about 222 loose yards after 25% swell. At 1.3 tons per yard that is about 289 tons, and 23 loads in a 10 yard truck.",
      "Step 2: Digging. At $14 a bank yard, digging costs about $2,489.",
      "Step 3: Hauling. At $175 a load, 23 loads cost about $4,025.",
      "Step 4: Disposal and machine. A $12 a ton dump fee on 289 tons is about $3,467, and $350 for machine delivery brings the subtotal to about $10,331.",
      "Step 5: Contingency. A 10% contingency adds about $1,033, for a total of about $11,364. That is about $64 per in-place cubic yard, but the figure changes sharply with haul distance and disposal costs.",
    ],
    tips: [
      "The default prices are illustrative. Replace them with quotes from local contractors and dump sites.",
      "Keeping the soil on site, for example as fill, removes hauling and dump fees, which are often the largest costs.",
      "Rock, groundwater and tight access can multiply digging costs. Use a larger contingency where those are likely.",
      "Call 811 before you dig, and ask whether permits, shoring or a soil test are needed.",
      "Compare quotes on the same basis: same volume, same disposal site and same contingency.",
      SAFETY,
    ],
    faqs: [
      {
        q: "How much does excavation cost per cubic yard?",
        a: "Digging alone is often priced in the low tens of dollars per cubic yard, but when hauling and disposal are included, the all-in cost per yard can be several times higher. It depends heavily on your area.",
      },
      {
        q: "What affects excavation cost the most?",
        a: "Hauling distance, disposal fees, soil type, depth, site access and whether rock or water is encountered. For many projects, hauling and disposal cost more than digging.",
      },
      {
        q: "Can I reduce excavation costs?",
        a: "Reusing soil on site, scheduling when machines are available and getting multiple quotes can all help. Ask whether the excavator can load directly into the trucks to save time.",
      },
      {
        q: "Why should I include a contingency?",
        a: "Unexpected rock, water, buried utilities and poor soil are common. A contingency of 10% to 20% covers many of these before they become a dispute with the contractor.",
      },
      {
        q: "Is this a quote?",
        a: "No. It is a planning estimate built from the rates you enter. Only a written quote from a licensed contractor shows the real price for your site.",
      },
    ],
    related: ["excavation-volume-calculator", "dump-truck-load-calculator", "fill-dirt-calculator"],
    guide: "excavation-swell-and-truck-loads",
  },
];
