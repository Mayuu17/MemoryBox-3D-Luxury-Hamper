import { BoxTheme } from "../types";

export interface ThemeConfig {
  id: BoxTheme;
  name: string;
  subtitle: string;
  boxBg: string;
  boxBorder: string;
  lidGradient: string;
  bodyGradient: string;
  velvetTexture: string;
  accentGold: string;
  ribbonColor: string;
  ribbonGradient: string;
  waxSealColor: string;
  paperShredColor: string;
  ambientGlow: string;
  tagBg: string;
}

export const BOX_THEMES: Record<BoxTheme, ThemeConfig> = {
  royal_velvet_burgundy: {
    id: "royal_velvet_burgundy",
    name: "Royal Velvet Burgundy",
    subtitle: "Deep wine red velvet with vintage gold filigree",
    boxBg: "#4A0E17",
    boxBorder: "border-[#D4AF37]/50",
    lidGradient: "bg-gradient-to-br from-[#6b1522] via-[#4A0E17] to-[#2B050B]",
    bodyGradient: "bg-gradient-to-b from-[#4A0E17] to-[#1E0307]",
    velvetTexture: "shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]",
    accentGold: "#D4AF37",
    ribbonColor: "#B22222",
    ribbonGradient: "bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C]",
    waxSealColor: "#8B0000",
    paperShredColor: "bg-[#E6C687]/30 text-[#8B6B38]",
    ambientGlow: "rgba(139, 0, 0, 0.25)",
    tagBg: "bg-[#FAF3E0]"
  },
  midnight_sapphire: {
    id: "midnight_sapphire",
    name: "Midnight Sapphire Silk",
    subtitle: "Celestial royal blue with silver & gold stardust",
    boxBg: "#0B1B3D",
    boxBorder: "border-[#96B9E8]/40",
    lidGradient: "bg-gradient-to-br from-[#162D5A] via-[#0B1B3D] to-[#040C1D]",
    bodyGradient: "bg-gradient-to-b from-[#0B1B3D] to-[#020712]",
    velvetTexture: "shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]",
    accentGold: "#E0B354",
    ribbonColor: "#1E3A8A",
    ribbonGradient: "bg-gradient-to-r from-[#E0B354] via-[#FDF5E6] to-[#A87B24]",
    waxSealColor: "#102554",
    paperShredColor: "bg-[#B0C4DE]/25 text-[#2E4A78]",
    ambientGlow: "rgba(11, 27, 61, 0.3)",
    tagBg: "bg-[#F0F4F8]"
  },
  champagne_ivory: {
    id: "champagne_ivory",
    name: "Champagne Linen & Ivory",
    subtitle: "Warm candlelight cream with delicate rose gold borders",
    boxBg: "#F4EDE2",
    boxBorder: "border-[#C9A96E]/60",
    lidGradient: "bg-gradient-to-br from-[#FAF5EC] via-[#F2E8D7] to-[#E3D3BD]",
    bodyGradient: "bg-gradient-to-b from-[#F2E8D7] to-[#D9C4A6]",
    velvetTexture: "shadow-[inset_0_0_40px_rgba(180,150,110,0.25)]",
    accentGold: "#BFA054",
    ribbonColor: "#D4AF37",
    ribbonGradient: "bg-gradient-to-r from-[#C9A96E] via-[#FFFDF8] to-[#9C7A3C]",
    waxSealColor: "#8C6239",
    paperShredColor: "bg-[#D8C7A5]/30 text-[#6B5532]",
    ambientGlow: "rgba(201, 169, 110, 0.25)",
    tagBg: "bg-[#FCF9F2]"
  },
  emerald_elegance: {
    id: "emerald_elegance",
    name: "Imperial Emerald & Gold",
    subtitle: "Rich forest jewel green with embossed gold leafing",
    boxBg: "#0F3825",
    boxBorder: "border-[#D4AF37]/50",
    lidGradient: "bg-gradient-to-br from-[#175237] via-[#0F3825] to-[#082015]",
    bodyGradient: "bg-gradient-to-b from-[#0F3825] to-[#04120B]",
    velvetTexture: "shadow-[inset_0_0_50px_rgba(0,0,0,0.65)]",
    accentGold: "#D4AF37",
    ribbonColor: "#054D28",
    ribbonGradient: "bg-gradient-to-r from-[#D4AF37] via-[#FEF9E7] to-[#AA771C]",
    waxSealColor: "#0D4028",
    paperShredColor: "bg-[#C4D7B2]/25 text-[#2A4D30]",
    ambientGlow: "rgba(15, 56, 37, 0.3)",
    tagBg: "bg-[#F2F7F2]"
  },
  rose_quartz: {
    id: "rose_quartz",
    name: "Rose Quartz & Suede",
    subtitle: "Soft romantic blush pink with delicate pearl sheen",
    boxBg: "#5C2E3B",
    boxBorder: "border-[#E8B4B8]/60",
    lidGradient: "bg-gradient-to-br from-[#7D4050] via-[#5C2E3B] to-[#3B1923]",
    bodyGradient: "bg-gradient-to-b from-[#5C2E3B] to-[#2B0E16]",
    velvetTexture: "shadow-[inset_0_0_45px_rgba(0,0,0,0.55)]",
    accentGold: "#F4C2C2",
    ribbonColor: "#D87093",
    ribbonGradient: "bg-gradient-to-r from-[#E8B4B8] via-[#FFF0F5] to-[#C47E84]",
    waxSealColor: "#802B43",
    paperShredColor: "bg-[#FADADD]/30 text-[#7A3E4D]",
    ambientGlow: "rgba(125, 64, 80, 0.25)",
    tagBg: "bg-[#FFF5F7]"
  },
  vintage_leather: {
    id: "vintage_leather",
    name: "Vintage Saddle Leather",
    subtitle: "Rustic antique tan leather with hand-stitched warmth",
    boxBg: "#422818",
    boxBorder: "border-[#C2884A]/60",
    lidGradient: "bg-gradient-to-br from-[#5E3B24] via-[#422818] to-[#29170C]",
    bodyGradient: "bg-gradient-to-b from-[#422818] to-[#1C0E07]",
    velvetTexture: "shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]",
    accentGold: "#D49B4B",
    ribbonColor: "#704214",
    ribbonGradient: "bg-gradient-to-r from-[#C2884A] via-[#F5DEB3] to-[#8B5A2B]",
    waxSealColor: "#5C2610",
    paperShredColor: "bg-[#E6CCA8]/30 text-[#6E4B28]",
    ambientGlow: "rgba(66, 40, 24, 0.3)",
    tagBg: "bg-[#FAF0E6]"
  }
};
