// 拼豆颜色数据 - 265色全色系
// 字母前缀代表色系，数字代表深浅（小号浅，大号深）

export type ColorCategory =
  | "白色系"
  | "灰色系"
  | "红色系"
  | "橙色系"
  | "黄色系"
  | "绿色系"
  | "蓝色系"
  | "紫色系"
  | "特殊色系";

export interface BeadColor {
  id: string;       // 编号如 "A5", "C1"
  category: ColorCategory;
  hex: string;      // 代表色
}

export const CATEGORY_CONFIG: Record<ColorCategory, { emoji: string; gradient: string }> = {
  "白色系": { emoji: "☁️", gradient: "from-gray-100 to-white" },
  "灰色系": { emoji: "🌑", gradient: "from-gray-400 to-gray-700" },
  "红色系": { emoji: "❤️", gradient: "from-pink-300 to-red-600" },
  "橙色系": { emoji: "🍊", gradient: "from-yellow-300 to-orange-500" },
  "黄色系": { emoji: "⭐", gradient: "from-yellow-200 to-yellow-500" },
  "绿色系": { emoji: "🌿", gradient: "from-green-200 to-green-600" },
  "蓝色系": { emoji: "💎", gradient: "from-blue-200 to-blue-600" },
  "紫色系": { emoji: "🔮", gradient: "from-purple-200 to-purple-600" },
  "特殊色系": { emoji: "✨", gradient: "from-pink-300 to-purple-400" },
};

// 色系对应的hex色值范围（按行号从浅到深）
const COLOR_MAPS: Record<string, { category: ColorCategory; hexes: Record<number, string> }> = {
  A: {
    category: "白色系",
    hexes: {
      5: "#FFFFFF", 6: "#FFF8F0", 7: "#FFF0E6", 8: "#FFE8D6", 9: "#FFDCC8",
      10: "#FFD1B8", 11: "#F5E6D3", 12: "#F0DEC8", 13: "#EBD5BC", 14: "#E5CCB0",
      15: "#DFC3A4", 16: "#D9BA98", 17: "#D3B18C", 18: "#CDA880", 19: "#C79F74",
      20: "#C19668", 21: "#BB8D5C", 22: "#B58450", 23: "#AF7B44", 24: "#A97238",
      25: "#A3692C", 26: "#9D6020",
    },
  },
  B: {
    category: "灰色系",
    hexes: {
      4: "#E8E8E8", 5: "#D4D4D4", 6: "#C0C0C0", 7: "#ACACAC", 8: "#989898",
      9: "#848484", 10: "#707070", 11: "#5C5C5C", 12: "#484848", 13: "#3A3A3A",
      14: "#2E2E2E", 15: "#222222", 16: "#D9C4B8", 17: "#C4A898", 18: "#AF8C78",
      19: "#9A7058", 20: "#855438", 21: "#703818", 22: "#6B3A1C", 23: "#5C3014",
      24: "#4D260C", 25: "#3E1C04", 26: "#2F1200", 27: "#8B7355", 28: "#6B5B3E",
      29: "#4B4327", 30: "#2B2B10", 31: "#1A1A0A", 32: "#0A0A04",
    },
  },
  C: {
    category: "红色系",
    hexes: {
      1: "#FFB6C1", 2: "#FF8FA3", 3: "#FF69B4", 4: "#FF4D8E", 5: "#FF3377",
      6: "#FF1A60", 7: "#FF0049", 8: "#E60042", 9: "#CC003B", 10: "#B30034",
      11: "#99002D", 12: "#FFD1DC", 13: "#FFC0CB", 14: "#FFAEC0", 15: "#FF9BB3",
      16: "#FF88A6", 17: "#FF7599", 18: "#FF628C", 19: "#FF4F7F", 20: "#FF3C72",
      21: "#FF2965", 22: "#FF1658", 23: "#FF034B", 24: "#E8003F", 25: "#D10033",
      26: "#BA0027", 27: "#A3001B", 28: "#8C000F", 29: "#750003",
    },
  },
  D: {
    category: "橙色系",
    hexes: {
      1: "#FFE4B5", 2: "#FFD39B", 3: "#FFC281", 4: "#FFB167", 5: "#FFA04D",
      6: "#FF8F33", 7: "#FF7E19", 8: "#FF6D00", 9: "#E66200", 10: "#CC5700",
      11: "#B34C00", 12: "#FFDAB9", 13: "#FFCBA4", 14: "#FFBC8F", 15: "#FFAD7A",
      16: "#FF9E65", 17: "#FF8F50", 18: "#FF803B", 19: "#FF7126", 20: "#FF6211",
      21: "#FF5300", 22: "#E64B00", 23: "#CC4300", 24: "#B33B00", 25: "#9A3300",
      26: "#812B00",
    },
  },
  E: {
    category: "黄色系",
    hexes: {
      1: "#FFFACD", 2: "#FFF5A0", 3: "#FFF078", 4: "#FFEB50", 5: "#FFE628",
      6: "#FFE100", 7: "#E6CC00", 8: "#CCB800", 9: "#B3A300", 10: "#998E00",
      11: "#807900", 12: "#FFFFB3", 13: "#FFFF80", 14: "#FFFF4D", 15: "#FFFF1A",
      16: "#FFE680", 17: "#FFD633", 18: "#FFC600", 19: "#E6B300", 20: "#CCA000",
      21: "#B38D00", 22: "#997A00", 23: "#806700", 24: "#665400",
    },
  },
  F: {
    category: "绿色系",
    hexes: {
      1: "#B2FFB2", 2: "#80FF80", 3: "#4DFF4D", 4: "#1AFF1A", 5: "#00E600",
      6: "#00CC00", 7: "#00B300", 8: "#009A00", 9: "#008000", 10: "#006700",
      11: "#004D00", 12: "#C8FFC8", 13: "#A0FFA0", 14: "#78FF78", 15: "#50FF50",
      16: "#98FB98", 17: "#66CD66", 18: "#3CB371", 19: "#2E8B57", 20: "#228B22",
      21: "#006400", 22: "#7CFC00", 23: "#32CD32", 24: "#00FF7F", 25: "#00FA9A",
    },
  },
  G: {
    category: "蓝色系",
    hexes: {
      1: "#B2D4FF", 2: "#80BFFF", 3: "#4DAAFF", 4: "#1A95FF", 5: "#0080FF",
      6: "#006BE6", 7: "#0056CC", 8: "#0041B3", 9: "#002C99", 10: "#001780",
      11: "#000266", 12: "#C8E6FF", 13: "#A0D2FF", 14: "#78BEFF", 15: "#50AAFF",
      16: "#87CEEB", 17: "#5F9EA0", 18: "#4682B4", 19: "#006994", 20: "#004E7C",
      21: "#003366",
    },
  },
  H: {
    category: "紫色系",
    hexes: {
      1: "#E6B2FF", 2: "#CC80FF", 3: "#B34DFF", 4: "#991AFF", 5: "#8000E6",
      6: "#6600CC", 7: "#4D00B3", 8: "#330099", 9: "#1A0080", 10: "#000066",
      11: "#F0C2FF", 12: "#D98FFF", 13: "#C25CFF", 14: "#DDA0DD", 15: "#DA70D6",
      16: "#BA55D3", 17: "#9370DB", 18: "#8A2BE2", 19: "#7B2FBE", 20: "#6A0DAD",
      21: "#550088", 22: "#440070", 23: "#330058",
    },
  },
  M: {
    category: "特殊色系",
    hexes: {
      1: "#FFD700", 2: "#C0C0C0", 3: "#FF6EC7", 4: "#00FFCC", 5: "#FF4500",
      6: "#7FFF00", 7: "#FF1493", 8: "#00CED1", 9: "#FF8C00", 10: "#ADFF2F",
      11: "#FF69B4", 12: "#00BFFF", 13: "#FFA07A", 14: "#98FB98", 15: "#DDA0DD",
    },
  },
};

// 生成所有颜色数据
function generateAllColors(): BeadColor[] {
  const colors: BeadColor[] = [];

  for (const [letter, config] of Object.entries(COLOR_MAPS)) {
    for (const [numStr, hex] of Object.entries(config.hexes)) {
      const num = parseInt(numStr, 10);
      colors.push({
        id: `${letter}${num}`,
        category: config.category,
        hex,
      });
    }
  }

  return colors.sort((a, b) => {
    const letterA = a.id.charAt(0);
    const letterB = b.id.charAt(0);
    const numA = parseInt(a.id.slice(1), 10);
    const numB = parseInt(b.id.slice(1), 10);
    if (letterA !== letterB) return letterA.localeCompare(letterB);
    return numA - numB;
  });
}

export const ALL_COLORS: BeadColor[] = generateAllColors();
export const ALL_CATEGORIES: ColorCategory[] = [
  "白色系", "灰色系", "红色系", "橙色系", "黄色系",
  "绿色系", "蓝色系", "紫色系", "特殊色系",
];