import type { Guide } from "../guides";

export const CONSTRUCTION_GUIDES: Guide[] = [
  {
    slug: "how-much-gravel-do-i-need",
    category: "construction",
    title: "How Much Gravel Do I Need? Cubic Yards, Tons and Depth Explained",
    description:
      "How to measure a project, convert to cubic yards and tons, choose a depth for paths, patios and driveways, and avoid ordering too little.",
    published: "2026-11-13",
    calculator: "gravel-calculator",
    sections: [
      {
        h: "Start with volume",
        p: [
          "Gravel is sold by the ton or the cubic yard, but you measure in feet and inches. Multiply length by width by depth in feet to get cubic feet, then divide by 27 to get cubic yards. A 20 by 10 foot area covered 3 inches deep is 50 cubic feet, or about 1.85 cubic yards.",
        ],
      },
      {
        h: "Convert to tons",
        p: [
          "Most gravel and crushed stone weighs about 1.3 to 1.5 tons per cubic yard. Multiply your cubic yards by that figure to compare with a per-ton price. Ask your supplier for the actual weight of the product, because moisture and fines change it.",
        ],
      },
      {
        h: "Choose a depth for the job",
        p: [
          "Garden paths often need 2 to 3 inches of gravel. Patio and paver bases usually need 4 to 6 inches of compacted stone. Driveways commonly use 6 to 8 inches in layers, with coarse stone at the bottom and a smaller stone on top.",
        ],
      },
      {
        h: "Allow for compaction and waste",
        p: [
          "Stone settles when compacted, and some mixes into the soil below. Adding 5% to 10% for light uses and 10% to 20% for driveways and bases avoids a second delivery fee.",
        ],
      },
    ],
  },
  {
    slug: "how-to-install-a-french-drain",
    category: "construction",
    title: "How to Install a French Drain: Planning, Materials and Common Mistakes",
    description:
      "A practical overview of French drain design: where to put it, trench size, slope, pipe, gravel and fabric, and the mistakes that cause failures.",
    published: "2026-11-13",
    calculator: "french-drain-calculator",
    sections: [
      {
        h: "What a French drain does",
        p: [
          "A French drain collects groundwater and carries it away through a perforated pipe buried in a gravel-filled trench. It is used to dry out soggy lawns and to relieve water pressure near foundations. It does not fix problems caused by roof or surface water, which need gutters and grading.",
        ],
      },
      {
        h: "Plan the route and outlet",
        p: [
          "Pick a path where water collects and find an outlet at a lower point, such as a storm drain, a dry well or daylight at a slope. The drain needs a continuous fall of about 1%, or one inch every eight feet. Call 811 and check for utilities before digging.",
        ],
      },
      {
        h: "Materials",
        p: [
          "Use clean, washed drainage stone, perforated pipe (4 inch is typical), and non-woven filter fabric to keep fine soil out of the stone. Wrapping the stone with fabric, rather than the pipe, helps prevent clogging.",
        ],
      },
      {
        h: "Common mistakes",
        p: [
          "Flat or backward slope, using sand or soil instead of clean stone, skipping filter fabric, and draining onto a neighbor's property are the most frequent causes of failure. Plan the outlet first.",
        ],
      },
    ],
  },
  {
    slug: "retaining-wall-materials-and-planning",
    category: "construction",
    title: "Retaining Wall Planning: Blocks, Base, Drainage and When You Need an Engineer",
    description:
      "How to plan a segmental retaining wall: counting blocks, base and drainage gravel, buried courses, height limits and when to get professional design.",
    published: "2026-11-13",
    calculator: "retaining-wall-block-calculator",
    sections: [
      {
        h: "Counting blocks",
        p: [
          "Divide the wall's height by your block's face height to count courses, and divide its length by the block's face width to find blocks per course. Add one buried course for walls up to about four feet, and 5% to 10% extra for cuts and breakage.",
        ],
      },
      {
        h: "Base and drainage",
        p: [
          "Walls sit on a compacted gravel base, commonly 6 inches deep and about twice the block depth wide. A column of clean gravel behind the wall, with a drain pipe at the bottom, lets water escape. Water pressure is the main reason walls fail.",
        ],
      },
      {
        h: "Height limits and permits",
        p: [
          "Model building codes commonly require a permit and engineered design above about four feet, measured from the bottom of the footing to the top of the wall, and many towns set a lower limit of two to three feet. Walls that support a slope, driveway or building, tiered walls, and walls near property lines may need an engineer and a permit even when they are shorter.",
        ],
      },
      {
        h: "Tips for a straighter wall",
        p: [
          "Take extra time on the first course. It sets the level for everything above it. Keep each course level, stagger the joints, and backfill and compact in thin layers.",
        ],
      },
    ],
  },
  {
    slug: "excavation-swell-and-truck-loads",
    category: "construction",
    title: "Excavation Basics: Bank vs Loose Yards, Swell Factor and Truck Loads",
    description:
      "Why dug soil takes up more space, how swell and compaction change quantities, and how to work out how many truck loads a job needs.",
    published: "2026-11-13",
    calculator: "excavation-volume-calculator",
    sections: [
      {
        h: "Bank, loose and compacted volume",
        p: [
          "Soil in the ground is measured as bank volume. When it is dug it loosens and takes up more space, so a truck carries a larger loose volume. When it is placed and compacted as fill it shrinks again, often to less than its original loose volume.",
        ],
      },
      {
        h: "Swell factor",
        p: [
          "Swell is the percentage increase from bank to loose. Common soil swells about 25%, clay about 25% to 40% depending on moisture, and sand or gravel roughly 10% to 15%. Use the number for your soil when working out hauling.",
        ],
      },
      {
        h: "Truck loads: volume and weight",
        p: [
          "A truck is limited by bed size and by legal payload. Heavy wet soil or gravel can reach the weight limit before the bed is full. Always check both limits when you count loads.",
        ],
      },
      {
        h: "Ordering fill",
        p: [
          "When you need fill, work back from the finished compacted volume and add 10% to 20% for compaction shrink. Compact fill in thin layers for a stable result.",
        ],
      },
    ],
  },
];
