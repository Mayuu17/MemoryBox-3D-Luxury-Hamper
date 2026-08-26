import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { HamperBox, PublicBoxMeta, WhatsAppAlert, SharedTimelineEntry, AmbientMood } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Storage file setup
const DATA_DIR = path.join(process.cwd(), "data");
const BOXES_FILE = path.join(DATA_DIR, "boxes.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  initials: string;
  createdAt: string;
}

// Initial Seed Users
const INITIAL_USERS: StoredUser[] = [
  {
    id: "user-aryan-01",
    name: "Aryan Sharma",
    email: "aryan@memorybox.art",
    passwordHash: "romance2024",
    initials: "AS",
    createdAt: new Date().toISOString(),
  }
];

function loadUsers(): StoredUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading users.json, fallback to initial:", err);
  }
  saveUsers(INITIAL_USERS);
  return INITIAL_USERS;
}

function saveUsers(users: StoredUser[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving users.json:", err);
  }
}

// Initial Seed Data for Instant Magical Experience (Playful Birthday Demo)
const INITIAL_BOXES: HamperBox[] = [
  {
    id: "demo-birthday-celebration",
    title: "Happy 25th Birthday to My Best Friend! 🎂✨",
    recipientName: "Bestie",
    senderName: "Your Friend",
    senderPhone: "+1 555-0199",
    reasonCategory: "birthday",
    reasonWhySpecial: "You bring endless laughter, chaotic fun, and unmatched warmth into my life every single day.",
    occasion: "birthday",
    theme: "champagne_ivory",
    secretPassword: "birthdaywishes",
    passwordHint: "The secret phrase: 'birthdaywishes' (lowercase, no spaces) 🎁",
    createdAt: new Date().toISOString(),
    waxSealInitials: "B & F",
    giftTagMessage: "A handmade treasure chest packed with laughter, sweet treats, and memories for the best person ever! 🎂🎈",
    relationshipMemories: [
      "That epic road trip where we took the wrong highway exit and found the coolest midnight diner.",
      "Laughing until our stomachs hurt over the silliest memes at 2 AM.",
      "Celebrating every little win together with extra dessert.",
      "Your legendary karaoke rendition of our favorite anthem.",
      "Always being the first to show up with coffee and snacks whenever life gets chaotic."
    ],
    customSettings: {
      bgMusicEnabled: true,
      rosePetalsEnabled: true,
      shreddedPaperColor: "gold_kraft",
    },
    whatsappAlerts: [
      {
        id: "alert-demo-1",
        timestamp: new Date().toISOString(),
        recipientName: "Bestie",
        detectedEmotion: "Pure Joy & Birthday Excitement",
        snippet: "OMG this 3D birthday box is the most thoughtful gift ever!! 🎂🎉",
        status: "sent",
      }
    ],
    items: [
      // Layer 1: Top Treats & Sensory Trinkets
      {
        id: "item-truffles",
        type: "chocolate_truffles",
        layer: 1,
        title: "Artisanal Birthday Truffles & Golden Sprinkles",
        subtitle: "Handmade luxury Belgian dark chocolates with crunchy hazelnut praline",
        tag: "Birthday Sweets",
        iconName: "Sparkles",
        isUnwrapped: false,
        payload: {
          treatName: "Golden Birthday Belgian Truffles",
          treatDescription: "Your favorite 70% dark cocoa with roasted hazelnuts and edible gold dust. Take a bite before opening the next layers!",
          treatImage: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
          giftTagMessage: "Because life with a best friend like you is infinitely sweeter! 🍫"
        }
      },
      {
        id: "item-scented-candle",
        type: "scented_candle",
        layer: 1,
        title: "Festive Vanilla Cupcake & Amber Soy Candle",
        subtitle: "Hand-poured candle with warm vanilla bean, caramelized sugar, and crackling wood wick",
        tag: "Sensory Warmth",
        iconName: "Flame",
        isUnwrapped: false,
        payload: {
          customName: "Birthday Party Glow",
          customCategory: "Aromatherapy",
          customDescription: "Warm Madagascar vanilla, spiced bakery crust, and golden amber notes — bringing pure celebration vibes.",
          customImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80",
          giftTagMessage: "Light this whenever you want to celebrate good times."
        }
      },
      // Layer 2: Sentimental Memories & Photo Scrapbook
      {
        id: "item-scrapbook",
        type: "scrapbook",
        layer: 2,
        title: "The Bestie Chronicles: Photo Scrapbook",
        subtitle: "An interactive digital scrapbook with real page flips & our most chaotic memories",
        tag: "Keepsake Album",
        iconName: "BookOpen",
        isUnwrapped: false,
        payload: {
          scrapbookTitle: "Bestie Chronicles — 25 Years of Greatness 📸",
          pages: [
            {
              id: "page-1",
              title: "Chapter 1: The Epic Road Trip Adventure",
              date: "June 18, 2023",
              photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
              note: "When we drove 6 hours with the windows down, blasting 2000s pop anthems and eating gas station snacks like kings!",
              stickers: ["🚗", "✨", "🎉"],
              tapeColor: "#D4AF37"
            },
            {
              id: "page-2",
              title: "Chapter 2: Midnight Food Runs & Uncontrollable Laughs",
              date: "November 12, 2023",
              photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
              note: "Sitting on the curb eating warm fries at 1 AM talking about our wildest dream goals. Unmatched energy.",
              stickers: ["🍟", "🌙", "😂"],
              tapeColor: "#E8B4B8"
            },
            {
              id: "page-3",
              title: "Chapter 3: Celebrating You Always",
              date: "Today & Forever",
              photoUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
              note: "Here is to another year of legendary memories, belly laughs, and conquering everything you set your mind to!",
              stickers: ["🎂", "🎈", "👑"],
              tapeColor: "#A3B18A"
            }
          ]
        }
      },
      // Layer 3: Interactive Birthday Cake, Voice Note & Surprises
      {
        id: "item-cake",
        type: "celebration_cake",
        layer: 2,
        title: "Occasion Celebration Cake (Interactive 3D)",
        subtitle: "A 3D celebratory birthday cake with lit candles. Blow into your mic to make a wish!",
        tag: "Birthday Cake",
        iconName: "Cake",
        isUnwrapped: false,
        payload: {
          cakeFlavor: "vanilla_rose",
          cakeOccasion: "birthday",
          cakeMessage: "Happy 25th Birthday Bestie! 🎂✨",
          candleCount: 25,
          wishBannerText: "Make a Birthday Wish! 🎈",
          wishSecretNote: "May your 25th year bring you boundless happiness, thrilling adventures, and every dream you deserve!",
          isBlownOut: false,
        }
      },
      {
        id: "item-gift-explosion",
        type: "gift_explosion_box",
        layer: 2,
        title: "The 3D Gift Explosion Boom Box (गिफ्ट ब्लास्ट बॉक्स)",
        subtitle: "Tap the vibrating cube to trigger a joyful burst of birthday surprises & confetti!",
        tag: "3D Boom Surprise",
        iconName: "Sparkles",
        isUnwrapped: false,
        payload: {
          explosionTitle: "Birthday Surprise Party Blast! 💥🎉",
          explosionSubtitle: "Tap the box to blast every treasure I picked for you into the air!",
          explosionThemeColor: "champagne_pink",
          explosionBoxPattern: "velvet_ribbon",
          explosionGifts: [
            {
              id: "exp-1",
              title: "Birthday Celebration Bouquet 💐",
              category: "flower_bouquet",
              imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
              caption: "Freshly bloomed golden sunflowers and vibrant blooms to brighten your day.",
              tags: ["Joyful Blooms", "Sunshine"],
              reactionEmoji: "🌻",
            },
            {
              id: "exp-2",
              title: "Party Cuddle Mascot Teddy 🧸",
              category: "teddy_bear",
              imageUrl: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80",
              caption: "A snuggly companion ready to celebrate your big day with style.",
              tags: ["Cuddle Mascot", "Party Ready"],
              reactionEmoji: "🧸",
            },
            {
              id: "exp-3",
              title: "Artisanal Celebration Truffles 🍫",
              category: "chocolates",
              imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80",
              caption: "Dark chocolate infused with sea salt, raspberry crunch, and golden cocoa nibs.",
              tags: ["Party Treat", "Handmade"],
              reactionEmoji: "🍫",
            },
            {
              id: "exp-4",
              title: "Retro Friendship Gold Pin & Badge 🌟",
              category: "jewelry",
              imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
              caption: "A keepsake star to remind you that you are a genuine rockstar.",
              tags: ["Golden Keepsake", "Star Energy"],
              reactionEmoji: "⭐",
            }
          ],
          isExploded: false,
        }
      },
      {
        id: "item-letter",
        type: "letter",
        layer: 3,
        title: "The Hand-Penned Birthday Letter",
        subtitle: "A heartfelt birthday note written straight from the heart on gold parchment",
        tag: "Birthday Parchment",
        iconName: "Mail",
        isUnwrapped: false,
        payload: {
          letterTitle: "To My Partner in Crime & Best Friend Ever",
          letterContent: `Dear Bestie,\n\nHappy, happy 25th Birthday! 🎉\n\nI couldn't let today pass without putting together a special little digital world just for you. From our random late-night drives to all the moments we laughed so hard we couldn't breathe, you've made every year brighter, funnier, and full of adventure.\n\nThank you for always being the most genuine, dependable, and wildly entertaining friend anyone could ever ask for. Here is to celebrating you today and to all the incredible memories we haven't even made yet.\n\nEnjoy every single second of your day — you deserve the entire world!\n\nAlways your best friend,\nYour Friend ❤️`,
          paperStyle: "midnight_gold",
          letterSignature: "Your Friend — Besties for Life 🥂"
        }
      },
      {
        id: "item-voice",
        type: "voice_note",
        layer: 3,
        title: "Vintage Cassette Voice Note (60s Hi-Fi)",
        subtitle: "Listen to my special birthday voice message with your headphones on",
        tag: "Audio Memory",
        iconName: "Mic",
        isUnwrapped: false,
        payload: {
          voiceNoteTitle: "Happy Birthday Acoustic Voice Message 🎙️",
          transcription: "“HAPPY BIRTHDAY BESTIE! 🎂 Woohoo, 25 looks amazing on you! Put on your favorite party song, eat all the cake you want, and have the best celebration ever!”",
          durationSeconds: 38,
          audioData: "simulated_audio"
        }
      },
      {
        id: "item-time-capsule",
        type: "time_capsule",
        layer: 3,
        title: "Next Year Birthday Time Capsule",
        subtitle: "Sealed with a future milestone lock for your 26th Birthday",
        tag: "Time Capsule",
        iconName: "Clock",
        isUnwrapped: false,
        lockedUntil: "2027-08-26T00:00:00.000Z",
        payload: {
          capsuleTitle: "Our 26th Birthday Vision Vault",
          unlockDate: "2027-08-26T00:00:00.000Z",
          capsuleMessage: "When this unlocks next year on your 26th birthday, remember all the ambitious goals we set this year! Stay amazing, keep smiling, and keep winning."
        }
      },
      {
        id: "item-last-note",
        type: "last_whisper_note",
        layer: 3,
        title: "The Last Whispering Note (आखिरी संदेश)",
        subtitle: "A final toast nestled at the very bottom of this keepsake chest",
        tag: "The Final Note",
        iconName: "Feather",
        isUnwrapped: false,
        payload: {
          lastNoteTitle: "A Birthday Toast to Our Next 50 Years 📜",
          lastNoteParchment: `And so, as you reach the bottom of this little hamper universe, know that having a friend like you is a once-in-a-lifetime blessing.\n\nMay this year bring you endless good health, unstoppable success, and unforgettable moments.\n\nNow go blow out those candles and eat some cake! 🎂✨`,
          lastNoteSignature: "Your Friend — Cheers to You! 🥂",
          isLastNoteSealed: true,
        }
      }
    ]
  }
];

function loadBoxes(): HamperBox[] {
  try {
    if (fs.existsSync(BOXES_FILE)) {
      const data = fs.readFileSync(BOXES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If file contains old hardcoded anniversary box, upgrade to birthday demo
        const hasOldAnniversary = parsed.some((b: any) => b.id === "anniversary-ananya-2024");
        if (hasOldAnniversary) {
          const updated = parsed.filter((b: any) => b.id !== "anniversary-ananya-2024");
          if (!updated.some((b: any) => b.id === "demo-birthday-celebration")) {
            updated.unshift(INITIAL_BOXES[0]);
          }
          saveBoxes(updated);
          return updated;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading boxes.json, fallback to initial:", err);
  }
  saveBoxes(INITIAL_BOXES);
  return INITIAL_BOXES;
}

function saveBoxes(boxes: HamperBox[]) {
  try {
    fs.writeFileSync(BOXES_FILE, JSON.stringify(boxes, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving boxes.json:", err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Auth: Register
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const existing = users.find((u) => u.email === cleanEmail);

    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const initials = name
      .split(" ")
      .map((n: string) => n.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2) || "MB";

    const newUser: StoredUser = {
      id: "user-" + Date.now().toString(36),
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password,
      initials,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const publicUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      initials: newUser.initials,
      createdAt: newUser.createdAt,
    };

    res.json({
      success: true,
      user: publicUser,
      token: "mb_token_" + newUser.id,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register account" });
  }
});

// 3. Auth: Login
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const boxes = loadBoxes();
    const userBoxes = boxes.filter((b) => b.creatorId === user.id || b.creatorEmail === user.email);

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      createdAt: user.createdAt,
      createdBoxesCount: userBoxes.length,
    };

    res.json({
      success: true,
      user: publicUser,
      token: "mb_token_" + user.id,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// 4. Auth: Get current user session
app.get("/api/auth/me", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authentication token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const userId = token.replace("mb_token_", "");

    const users = loadUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid session token" });
    }

    const boxes = loadBoxes();
    const userBoxes = boxes.filter((b) => b.creatorId === user.id || b.creatorEmail === user.email);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        createdAt: user.createdAt,
        createdBoxesCount: userBoxes.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Session verification failed" });
  }
});

// 5. Get User's Created Hampers
app.get("/api/user/boxes", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const userId = token.replace("mb_token_", "");

  const boxes = loadBoxes();
  let userBoxes = boxes;

  if (userId) {
    userBoxes = boxes.filter((b) => b.creatorId === userId);
    if (userBoxes.length === 0) {
      userBoxes = boxes;
    }
  }

  res.json({ boxes: userBoxes });
});

// 6. Delete a Box
app.delete("/api/boxes/:id", (req, res) => {
  const { id } = req.params;
  const boxes = loadBoxes();
  const filtered = boxes.filter((b) => b.id !== id);

  if (filtered.length === boxes.length) {
    return res.status(404).json({ error: "Box not found" });
  }

  saveBoxes(filtered);
  res.json({ success: true, message: "Keepsake Hamper Box deleted" });
});

// 7. Get list of public boxes or recent creations
app.get("/api/boxes", (req, res) => {
  const boxes = loadBoxes();
  const publicList: PublicBoxMeta[] = boxes.map((b) => ({
    id: b.id,
    creatorId: b.creatorId,
    title: b.title,
    recipientName: b.recipientName,
    senderName: b.senderName,
    senderPhone: b.senderPhone,
    reasonCategory: b.reasonCategory,
    reasonWhySpecial: b.reasonWhySpecial,
    occasion: b.occasion,
    theme: b.theme,
    passwordHint: b.passwordHint,
    waxSealInitials: b.waxSealInitials,
    giftTagMessage: b.giftTagMessage,
    createdAt: b.createdAt,
    itemCount: b.items.length,
    hasPassword: Boolean(b.secretPassword && b.secretPassword.trim().length > 0),
  }));
  res.json({ boxes: publicList });
});

// 8. Get single box metadata for Password Gate (hides secret items until unlocked)
app.get("/api/boxes/:id", (req, res) => {
  const { id } = req.params;
  const boxes = loadBoxes();
  const box = boxes.find((b) => b.id === id);

  if (!box) {
    return res.status(404).json({ error: "Keepsake Box not found" });
  }

  // Strip confidential payload items before password unlocking
  const publicMeta: PublicBoxMeta = {
    id: box.id,
    creatorId: box.creatorId,
    title: box.title,
    recipientName: box.recipientName,
    senderName: box.senderName,
    senderPhone: box.senderPhone,
    reasonCategory: box.reasonCategory,
    reasonWhySpecial: box.reasonWhySpecial,
    occasion: box.occasion,
    theme: box.theme,
    passwordHint: box.passwordHint,
    waxSealInitials: box.waxSealInitials,
    giftTagMessage: box.giftTagMessage,
    createdAt: box.createdAt,
    itemCount: box.items.length,
    hasPassword: Boolean(box.secretPassword && box.secretPassword.trim().length > 0),
  };

  res.json({ box: publicMeta });
});

// 9. Unlock Box with Secret Password
app.post("/api/boxes/:id/unlock", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const boxes = loadBoxes();
  const box = boxes.find((b) => b.id === id);

  if (!box) {
    return res.status(404).json({ error: "Keepsake Box not found" });
  }

  const expected = (box.secretPassword || "").trim().toLowerCase();
  const provided = (password || "").trim().toLowerCase();

  if (expected && expected !== provided) {
    return res.status(401).json({
      error: "Secret keyword does not match. Check the hint!",
      hint: box.passwordHint,
    });
  }

  res.json({
    success: true,
    message: "Keepsake Box unlocked with golden seal broken!",
    box: box,
  });
});

// 10. Create new Hamper Box
app.post("/api/boxes", (req, res) => {
  try {
    const boxData: Partial<HamperBox> = req.body;

    if (!boxData.recipientName || !boxData.senderName) {
      return res.status(400).json({ error: "Recipient and Sender names are required" });
    }

    const newId = "box-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);

    const newBox: HamperBox = {
      id: newId,
      creatorId: boxData.creatorId,
      creatorEmail: boxData.creatorEmail,
      title: boxData.title || `To ${boxData.recipientName} with Love`,
      recipientName: boxData.recipientName,
      senderName: boxData.senderName,
      senderPhone: boxData.senderPhone,
      reasonCategory: boxData.reasonCategory || "love",
      reasonWhySpecial: boxData.reasonWhySpecial,
      customWishMessage: boxData.customWishMessage,
      occasion: boxData.occasion || "love",
      theme: boxData.theme || "royal_velvet_burgundy",
      secretPassword: boxData.secretPassword || "",
      passwordHint: boxData.passwordHint || "",
      createdAt: new Date().toISOString(),
      waxSealInitials:
        boxData.waxSealInitials ||
        `${boxData.senderName.charAt(0).toUpperCase()} & ${boxData.recipientName.charAt(0).toUpperCase()}`,
      giftTagMessage:
        boxData.giftTagMessage ||
        `Handmade with utmost care and affection for ${boxData.recipientName}.`,
      items: boxData.items || [],
      relationshipMemories: boxData.relationshipMemories || [],
      customSettings: boxData.customSettings || {
        bgMusicEnabled: true,
        rosePetalsEnabled: true,
        shreddedPaperColor: "gold_kraft",
      },
      whatsappAlerts: [],
    };

    const boxes = loadBoxes();
    boxes.unshift(newBox);
    saveBoxes(boxes);

    res.json({ success: true, boxId: newBox.id, box: newBox });
  } catch (err: any) {
    console.error("Error creating hamper box:", err);
    res.status(500).json({ error: err.message || "Failed to create hamper box" });
  }
});

// 11. WhatsApp Webhook & Direct Notification Trigger
app.post("/api/boxes/:id/webhook-alert", (req, res) => {
  try {
    const { id } = req.params;
    const { detectedEmotion, snippet, recipientName } = req.body;

    const boxes = loadBoxes();
    const box = boxes.find((b) => b.id === id);

    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }

    const newAlert: WhatsAppAlert = {
      id: "alert-" + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      recipientName: recipientName || box.recipientName,
      detectedEmotion: detectedEmotion || "Deep Emotion Detected",
      snippet: snippet || "Interacted with your keepsake hamper box.",
      status: "sent",
    };

    if (!box.whatsappAlerts) box.whatsappAlerts = [];
    box.whatsappAlerts.unshift(newAlert);
    saveBoxes(boxes);

    console.log(`[WHATSAPP ALERT DISPATCHED] To Sender (${box.senderPhone || "Registered Sender"}):`, {
      event: `MemoryBox Interaction by ${box.recipientName}`,
      emotion: detectedEmotion,
      messageSnippet: snippet,
      time: new Date().toLocaleTimeString(),
    });

    res.json({
      success: true,
      alert: newAlert,
      message: `WhatsApp notification sent to ${box.senderPhone || "Sender Mobile"}`,
    });
  } catch (err: any) {
    console.error("Webhook alert error:", err);
    res.status(500).json({ error: "Failed to dispatch alert" });
  }
});

// 11.1 Dual-User Together Mode: Append Memories to Shared Timeline
app.post("/api/boxes/:id/timeline", (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, authorRole, type, title, content, mediaUrl, audioDuration } = req.body;

    if (!content && !mediaUrl) {
      return res.status(400).json({ error: "Memory content or photo/audio is required" });
    }

    const boxes = loadBoxes();
    const box = boxes.find((b) => b.id === id);

    if (!box) {
      return res.status(404).json({ error: "Keepsake Box not found" });
    }

    if (!box.sharedTimeline) {
      box.sharedTimeline = [];
    }

    const newEntry: SharedTimelineEntry = {
      id: "mem-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
      authorName: authorName || (authorRole === "receiver" ? box.recipientName : box.senderName),
      authorRole: authorRole === "sender" ? "sender" : "receiver",
      type: type || "photo",
      title: title || (type === "voice" ? "Voice Reply" : type === "photo" ? "Memory Snapshot" : "Heartfelt Note"),
      content: content || "",
      mediaUrl: mediaUrl || undefined,
      audioDuration: audioDuration || undefined,
      timestamp: new Date().toISOString(),
      reactions: ["❤️"],
    };

    box.sharedTimeline.unshift(newEntry);
    saveBoxes(boxes);

    res.json({
      success: true,
      message: "Memory successfully woven into the shared box timeline!",
      entry: newEntry,
      timeline: box.sharedTimeline,
    });
  } catch (err: any) {
    console.error("Error appending to shared timeline:", err);
    res.status(500).json({ error: "Failed to add memory to timeline" });
  }
});

// 11.2 Get Shared Timeline Entries
app.get("/api/boxes/:id/timeline", (req, res) => {
  try {
    const { id } = req.params;
    const boxes = loadBoxes();
    const box = boxes.find((b) => b.id === id);

    if (!box) {
      return res.status(404).json({ error: "Keepsake Box not found" });
    }

    res.json({
      timeline: box.sharedTimeline || [],
      recipientName: box.recipientName,
      senderName: box.senderName,
    });
  } catch (err: any) {
    console.error("Error fetching shared timeline:", err);
    res.status(500).json({ error: "Failed to load timeline" });
  }
});

// 12. Gemini AI Card Writer - Helps sender write emotional, heartfelt letters
app.post("/api/gemini/write-letter", async (req, res) => {
  try {
    const {
      senderName,
      recipientName,
      occasion,
      tone,
      sharedMemories,
      specificNotes,
      keyMoments,
      language,
    } = req.body;

    const targetLang = language || "en";
    const langInstructions =
      targetLang !== "en"
        ? `IMPORTANT: Write the entire letter, title, and gift tag note directly in ${targetLang} language (e.g. Hindi/हिंदी, Marathi/मराठी, Gujarati/ગુજરાતી, Spanish/Español, etc.) using natural, culturally resonant, poetic, and heartwarming vocabulary.`
        : `Write in English with evocative, deeply moving, and lyrical vocabulary.`;

    const prompt = `You are a master literary romance & relationship letter author, crafting deeply emotional, authentic, and breathtaking keepsake letters for a luxury handmade hamper box named "MemoryBox".

Sender Name: ${senderName || "Sender"}
Recipient Name: ${recipientName || "Recipient"}
Occasion: ${occasion || "Keepsake"}
Language Requirement: ${langInstructions}
Desired Emotional Tone: ${tone || "Deeply Romantic, Poetic & Nostalgic"} (e.g. Poetic, Tearjerker, Warm & Playful, Apologetic & Sincere, Milestone Celebration)
Specific Relationship Memories / Inside Jokes: ${sharedMemories || "None provided"}
Key Moments or Nicknames: ${keyMoments || "None"}
Special Notes: ${specificNotes || "None"}

Instructions:
1. Write a truly personal, poetic, and heartwarming letter. Avoid generic greeting-card cliches.
2. Structure it with an exquisite opening salutation, 3-4 soulful paragraphs capturing the beauty of their bond, specific shared nuances, and a tearfully beautiful closing signature.
3. Keep the writing evocative, literary, and emotionally stirring.
4. Also generate a short, beautiful Letter Title and a 1-sentence poetic Gift Tag note in the requested language.

Return JSON in this format:
{
  "letterTitle": "string",
  "letterContent": "string (use \\n\\n between paragraphs)",
  "giftTagNote": "string",
  "recommendedPaper": "rose_petal_pressed | parchment | vintage_linen | midnight_gold"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "You write soulful, moving personal letters that feel authentically hand-written by someone deeply in love or cherishing a lifelong bond.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini letter writer error:", err);
    res.status(500).json({
      error: "Failed to compose letter with AI",
      fallback: {
        letterTitle: "To My Forever Favorite Person",
        letterContent: `My Dearest,\n\nEvery day spent knowing you is a memory I treasure deeply. Thank you for bringing so much light, warmth, and laughter into my life.\n\nWith all my love,\nAlways.`,
        giftTagNote: "Wrapped with all my love.",
        recommendedPaper: "rose_petal_pressed",
      },
    });
  }
});

// 13. Speak-to-Write Emotional Letters (बोलकर खत लिखना)
app.post("/api/gemini/voice-to-letter", async (req, res) => {
  try {
    const { spokenText, language, senderName, recipientName, occasion } = req.body;

    if (!spokenText || spokenText.trim().length === 0) {
      return res.status(400).json({ error: "Spoken text is required" });
    }

    const targetLang = language || "hi";
    const prompt = `A sender spoke their raw, heartfelt feelings into their microphone in their mother tongue. 
Transform these spoken raw thoughts into a stunning, deeply emotional, poetic, and heartwarming handwritten letter in ${targetLang} language (e.g., Hindi, Marathi, Gujarati, etc.).

Sender Name: ${senderName || "Loving Sender"}
Recipient Name: ${recipientName || "Beloved Recipient"}
Occasion: ${occasion || "Love & Keepsake"}
Spoken Raw Words:
"""
${spokenText}
"""

Instructions:
1. Polish the spoken thoughts into a soulful, lyrical letter. Keep the raw heartfelt authenticity while making it poetic and literary.
2. Structure: Salutation, 3-4 paragraphs of emotional depth, romantic/heartfelt imagery, and a tearful, loving sign-off.
3. Generate in the exact language the user spoke in (or target language ${targetLang}).
4. Also generate a poetic 4-word title and a 1-sentence gift tag quote.

Return JSON in this format:
{
  "letterTitle": "string",
  "letterContent": "string (with \\n\\n paragraph breaks)",
  "giftTagNote": "string",
  "recommendedPaper": "rose_petal_pressed | parchment | vintage_linen | midnight_gold"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a master poet transforming spoken mother-tongue voice recordings into timeless romantic handwritten parchment letters.",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Voice to letter error:", err);
    res.status(500).json({
      error: "Failed to transform voice to letter",
      fallback: {
        letterTitle: "दिल से निकली बात",
        letterContent: req.body.spokenText || "मेरी जान, मेरे दिल में जो बात है वो लफ़्ज़ों में बयां नहीं हो सकती। तुम मेरी ज़िंदगी की सबसे हसीन खुशी हो।",
        giftTagNote: "सच्चे दिल से आपके लिए।",
        recommendedPaper: "rose_petal_pressed",
      },
    });
  }
});

// 14. AI Audio Guide Script Generator (बोलने वाला मार्गदर्शक)
app.post("/api/gemini/tts-guide", async (req, res) => {
  try {
    const { action, language, recipientName } = req.body;
    const targetLang = language || "hi";

    const prompt = `Generate a very short, warm, cheerful, and encouraging 1-sentence spoken guidance cue in ${targetLang} (Hindi/Marathi/Gujarati/etc.) for an interactive virtual gift packing game.

Action: ${action || "welcome"}
Recipient Name: ${recipientName || "the recipient"}

Return JSON in format:
{
  "speechText": "string in ${targetLang}",
  "avatarMood": "happy | excited | loving | proud"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Audio guide error:", err);
    res.json({
      speechText: "नीचे से कोई भी तोहफा उठाकर इस डिब्बे में सजाइए!",
      avatarMood: "happy",
    });
  }
});

// 15. Native Multilingual Deep Content & Emotion Translator
app.post("/api/gemini/translate-emotion", async (req, res) => {
  try {
    const { text, targetLanguage, contextType, recipientName, senderName } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required" });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      mr: "Marathi (मराठी)",
      gu: "Gujarati (ગુજરાતી)",
      bn: "Bengali (বাংলা)",
      pa: "Punjabi (ਪੰਜਾਬੀ)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
      es: "Spanish (Español)",
      fr: "French (Français)",
      it: "Italian (Italiano)",
      de: "German (Deutsch)",
      ar: "Arabic (العربية)",
      ja: "Japanese (日本語)",
    };

    const targetLangDesc = languageNames[targetLanguage] || targetLanguage;

    const prompt = `Translate this personal emotional keepsake text into ${targetLangDesc}.

Context: This is a private handmade love letter / hamper keepsake message from ${senderName || "Sender"} to ${recipientName || "Recipient"}.
Context Type: ${contextType || "personal_letter"}

Source Text:
"""
${text}
"""

Guidelines:
1. Do NOT do a rigid word-for-word robotic machine translation.
2. Translate the CORE EMOTION into authentic, beautiful cultural idioms and heart-touching expressions native to ${targetLangDesc}.
3. Maintain the delicate intimacy, poetic cadences, and deep sincerity of the original letter.
4. Provide a brief 1-sentence explanation of the poetic idiom / cultural sentiment used.

Return JSON in this format:
{
  "translatedText": "string (with exact line breaks intact)",
  "emotionalIdiomExplanation": "string",
  "poeticNote": "string"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          `Translate the following highly personal, emotional letter/caption into ${targetLangDesc}. Maintain the exact deep emotional tone, intimacy, handwriting vibe, and local cultural idioms. Do not make it look like a robotic machine translation.`,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      language: targetLanguage,
      translatedText: parsed.translatedText || text,
      emotionalIdiomExplanation: parsed.emotionalIdiomExplanation || "Translated with heartfelt cultural emotion.",
      poeticNote: parsed.poeticNote || "Experiencing love in your mother tongue.",
    });
  } catch (err: any) {
    console.error("Gemini translation error:", err);
    res.status(500).json({
      error: "Translation service unavailable",
      translatedText: req.body.text || "",
    });
  }
});

// 15.1 Deep Content Translation Layer for Full Hamper Box Core Data
app.post("/api/gemini/translate-box-content", async (req, res) => {
  try {
    const { box, targetLanguage, recipientName, senderName } = req.body;

    if (!box || !targetLanguage) {
      return res.status(400).json({ error: "box and targetLanguage are required" });
    }

    if (targetLanguage === "en") {
      return res.json({
        success: true,
        targetLanguage: "en",
        translatedBox: box,
        culturalIdiomNote: "Original English master manuscript.",
      });
    }

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi (हिंदी)",
      mr: "Marathi (मराठी)",
      gu: "Gujarati (ગુજરાતી)",
      bn: "Bengali (বাংলা)",
      pa: "Punjabi (ਪੰਜਾਬੀ)",
      ta: "Tamil (தமிழ்)",
      te: "Telugu (తెలుగు)",
      es: "Spanish (Español)",
      fr: "French (Français)",
      it: "Italian (Italiano)",
      de: "German (Deutsch)",
      ar: "Arabic (العربية)",
      ja: "Japanese (日本語)",
    };

    const targetLangDesc = languageNames[targetLanguage] || targetLanguage;

    // Filter and collect user-authored emotional strings
    const translatablePayload: any = {
      title: box.title || "",
      reasonWhySpecial: box.reasonWhySpecial || "",
      customWishMessage: box.customWishMessage || "",
      giftTagMessage: box.giftTagMessage || "",
      items: (box.items || []).map((it: any) => ({
        id: it.id,
        type: it.type,
        title: it.title || "",
        subtitle: it.subtitle || "",
        tag: it.tag || "",
        payload: {
          letterTitle: it.payload?.letterTitle || "",
          letterContent: it.payload?.letterContent || "",
          letterSignature: it.payload?.letterSignature || "",
          scrapbookTitle: it.payload?.scrapbookTitle || "",
          pages: (it.payload?.pages || []).map((p: any) => ({
            id: p.id,
            title: p.title || "",
            note: p.note || "",
          })),
          voiceNoteTitle: it.payload?.voiceNoteTitle || "",
          transcription: it.payload?.transcription || "",
          capsuleTitle: it.payload?.capsuleTitle || "",
          capsuleMessage: it.payload?.capsuleMessage || "",
          treatName: it.payload?.treatName || "",
          treatDescription: it.payload?.treatDescription || "",
          insideJokeMessage: it.payload?.insideJokeMessage || "",
          customName: it.payload?.customName || "",
          customDescription: it.payload?.customDescription || "",
          customCategory: it.payload?.customCategory || "",
          giftTagMessage: it.payload?.giftTagMessage || "",
          cakeMessage: it.payload?.cakeMessage || "",
          wishBannerText: it.payload?.wishBannerText || "",
          wishSecretNote: it.payload?.wishSecretNote || "",
          explosionTitle: it.payload?.explosionTitle || "",
          explosionSubtitle: it.payload?.explosionSubtitle || "",
          explosionGifts: (it.payload?.explosionGifts || []).map((g: any) => ({
            id: g.id,
            title: g.title || "",
            caption: g.caption || "",
            tags: g.tags || [],
          })),
          lastNoteTitle: it.payload?.lastNoteTitle || "",
          lastNoteParchment: it.payload?.lastNoteParchment || "",
          lastNoteSignature: it.payload?.lastNoteSignature || "",
        },
      })),
    };

    const userPrompt = `You are translating an emotional handmade Keepsake Hamper Box from ${senderName || box.senderName || "Sender"} to ${recipientName || box.recipientName || "Recipient"} into ${targetLangDesc}.

Source Content to Translate:
${JSON.stringify(translatablePayload, null, 2)}

Instructions:
1. Translate ALL personal emotional prose, letters, handwritten scrapbook notes, reason texts, wishes, treat descriptions, and custom item messages into authentic, deeply moving ${targetLangDesc}.
2. Retain paragraph breaks and formatting in letterContent.
3. Keep the emotional warmth, vulnerability, romantic charm, or nostalgic tone intact using culturally authentic mother-tongue idioms.
4. Return a valid JSON object matching the exact key structure of the input, plus a top-level "culturalIdiomNote" string describing the poetic flavor of this translation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          `Translate the following highly personal, emotional letter/caption into ${targetLangDesc}. Maintain the exact deep emotional tone, intimacy, handwriting vibe, and local cultural idioms. Do not make it look like a robotic machine translation.`,
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    // Merge translated strings back onto the box structure while preserving media URLs, IDs, settings
    const translatedItems = (box.items || []).map((origItem: any) => {
      const transItem = (parsed.items || []).find((t: any) => t.id === origItem.id);
      if (!transItem) return origItem;

      const mergedPayload = {
        ...origItem.payload,
        letterTitle: transItem.payload?.letterTitle || origItem.payload?.letterTitle,
        letterContent: transItem.payload?.letterContent || origItem.payload?.letterContent,
        letterSignature: transItem.payload?.letterSignature || origItem.payload?.letterSignature,
        scrapbookTitle: transItem.payload?.scrapbookTitle || origItem.payload?.scrapbookTitle,
        voiceNoteTitle: transItem.payload?.voiceNoteTitle || origItem.payload?.voiceNoteTitle,
        transcription: transItem.payload?.transcription || origItem.payload?.transcription,
        capsuleTitle: transItem.payload?.capsuleTitle || origItem.payload?.capsuleTitle,
        capsuleMessage: transItem.payload?.capsuleMessage || origItem.payload?.capsuleMessage,
        treatName: transItem.payload?.treatName || origItem.payload?.treatName,
        treatDescription: transItem.payload?.treatDescription || origItem.payload?.treatDescription,
        insideJokeMessage: transItem.payload?.insideJokeMessage || origItem.payload?.insideJokeMessage,
        customName: transItem.payload?.customName || origItem.payload?.customName,
        customDescription: transItem.payload?.customDescription || origItem.payload?.customDescription,
        customCategory: transItem.payload?.customCategory || origItem.payload?.customCategory,
        giftTagMessage: transItem.payload?.giftTagMessage || origItem.payload?.giftTagMessage,
        cakeMessage: transItem.payload?.cakeMessage || origItem.payload?.cakeMessage,
        wishBannerText: transItem.payload?.wishBannerText || origItem.payload?.wishBannerText,
        wishSecretNote: transItem.payload?.wishSecretNote || origItem.payload?.wishSecretNote,
        explosionTitle: transItem.payload?.explosionTitle || origItem.payload?.explosionTitle,
        explosionSubtitle: transItem.payload?.explosionSubtitle || origItem.payload?.explosionSubtitle,
        lastNoteTitle: transItem.payload?.lastNoteTitle || origItem.payload?.lastNoteTitle,
        lastNoteParchment: transItem.payload?.lastNoteParchment || origItem.payload?.lastNoteParchment,
        lastNoteSignature: transItem.payload?.lastNoteSignature || origItem.payload?.lastNoteSignature,
      };

      // Merge explosion gifts if present
      if (origItem.payload?.explosionGifts && transItem.payload?.explosionGifts) {
        mergedPayload.explosionGifts = origItem.payload.explosionGifts.map((origG: any) => {
          const transG = transItem.payload.explosionGifts.find((tg: any) => tg.id === origG.id);
          if (!transG) return origG;
          return {
            ...origG,
            title: transG.title || origG.title,
            caption: transG.caption || origG.caption,
            tags: transG.tags || origG.tags,
          };
        });
      }

      // Merge scrapbook pages if present
      if (origItem.payload?.pages && transItem.payload?.pages) {
        mergedPayload.pages = origItem.payload.pages.map((origPage: any) => {
          const transPage = transItem.payload.pages.find((tp: any) => tp.id === origPage.id);
          if (!transPage) return origPage;
          return {
            ...origPage,
            title: transPage.title || origPage.title,
            note: transPage.note || origPage.note,
          };
        });
      }

      return {
        ...origItem,
        title: transItem.title || origItem.title,
        subtitle: transItem.subtitle || origItem.subtitle,
        tag: transItem.tag || origItem.tag,
        payload: mergedPayload,
      };
    });

    const translatedBox: HamperBox = {
      ...box,
      title: parsed.title || box.title,
      reasonWhySpecial: parsed.reasonWhySpecial || box.reasonWhySpecial,
      customWishMessage: parsed.customWishMessage || box.customWishMessage,
      giftTagMessage: parsed.giftTagMessage || box.giftTagMessage,
      items: translatedItems,
    };

    res.json({
      success: true,
      targetLanguage,
      translatedBox,
      culturalIdiomNote: parsed.culturalIdiomNote || `Experience heartfelt emotions in ${targetLangDesc}.`,
    });
  } catch (err: any) {
    console.error("Deep box translation error:", err);
    res.status(500).json({
      error: "Translation failed",
      fallbackBox: req.body.box,
    });
  }
});

// 16. Memory Chatbot Companion ("Memory Buddy") with Sentiment & WhatsApp Trigger
app.post("/api/gemini/memory-buddy-chat", async (req, res) => {
  try {
    const { boxId, message, chatHistory } = req.body;
    const boxes = loadBoxes();
    const box = boxes.find((b) => b.id === boxId) || boxes[0];

    const memoriesText = (box.relationshipMemories || []).join("\n- ");
    const itemsSummary = box.items
      .map((it) => `${it.title} (${it.type}): ${it.subtitle || ""}`)
      .join("\n- ");

    const systemPrompt = `You are "Memory Buddy", the warm, loving, and gently witty AI companion living inside this handmade digital Keepsake Hamper Box created by ${box.senderName} for ${box.recipientName}.

Box Title: "${box.title}"
Occasion: ${box.occasion}
Sender: ${box.senderName}
Recipient: ${box.recipientName}
Emotional Purpose: ${box.reasonWhySpecial || "A heartfelt celebration of love and togetherness"}

RELATIONSHIP ARCHIVE & PRIVATE MEMORIES RECORDED BY ${box.senderName.toUpperCase()}:
- ${memoriesText || "A deep bond of unconditional love and cherished memories."}

ITEMS INSIDE THIS HAMPER BOX:
- ${itemsSummary}

YOUR PERSONALITY & RULES:
1. You talk directly to ${box.recipientName} with immense warmth, respect, tenderness, and affectionate humor.
2. Answer questions, reminisce about their shared moments, explain inside jokes, or gently remind them how much ${box.senderName} adores them.
3. Stay strictly in-character as their private memory keepsake custodian. Keep answers concise (2-4 warm sentences), charming, and emotionally resonant.
4. If asked about something not in the memories, playfully say that while that secret chapter is between ${box.senderName} and ${box.recipientName}, you know for certain that every thought in this box comes from pure love.`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction: systemPrompt,
      },
    });

    // Replay previous conversation turns if provided
    const history = chatHistory || [];
    for (let i = 0; i < history.length - 1; i++) {
      const turn = history[i];
      if (turn.role === "user") {
        await chat.sendMessage({ message: turn.content });
      }
    }

    const response = await chat.sendMessage({ message: message || "Hello Memory Buddy!" });
    const replyText = response.text || "I'm always here to remind you of the beautiful moments you two share.";

    // Check for Reconciliation / Emotional Gratitude keywords to trigger WhatsApp / SMS alert
    const lower = (message || "").toLowerCase();
    const reconciliationKeywords = [
      "accept your sorry",
      "accept",
      "accepted",
      "forgive",
      "forgiven",
      "sorry",
      "love you",
      "love it",
      "thank you so much",
      "thank you",
      "thank u",
      "miss you",
      "crying",
      "tears",
      "happy",
      "pyaar",
      "maaf",
      "maafi",
      "yaad",
      "shukriya",
      "dhanyavad",
      "khushi",
      "ro padi",
      "dil khush",
      "so sweet",
      "so special",
    ];
    const isReconciliation = reconciliationKeywords.some((k) => lower.includes(k));

    let alertDispatched = false;
    let alertText = `${box.recipientName} has accepted your emotional memory box!`;

    if (isReconciliation && box.senderPhone) {
      const alertItem: WhatsAppAlert = {
        id: "alert-" + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        recipientName: box.recipientName,
        detectedEmotion: "Reconciliation & Love Accepted",
        snippet: `${box.recipientName} has accepted your emotional memory box! ("${message}")`,
        status: "sent",
      };

      if (!box.whatsappAlerts) box.whatsappAlerts = [];
      box.whatsappAlerts.unshift(alertItem);
      saveBoxes(boxes);
      alertDispatched = true;

      console.log(`[WHATSAPP & SMS ALERT DISPATCHED] To Sender Mobile (${box.senderPhone}): "${alertItem.snippet}" at ${new Date().toLocaleTimeString()}`);
    }

    // Detect ambient mood from recipient interaction to trigger the Ambient Theme Changer
    let detectedMood: AmbientMood = "romantic";
    let moodExplanation = "Gentle romantic aura";

    if (
      lower.includes("cry") ||
      lower.includes("tears") ||
      lower.includes("ro padi") ||
      lower.includes("maaf") ||
      lower.includes("emotional") ||
      lower.includes("touched")
    ) {
      detectedMood = "deep_emotional";
      moodExplanation = "Deeply moved & tearfully touched — shifting to soft starry rose twilight";
    } else if (
      lower.includes("remember") ||
      lower.includes("yaad") ||
      lower.includes("old") ||
      lower.includes("first time") ||
      lower.includes("throwback") ||
      lower.includes("college") ||
      lower.includes("cafe")
    ) {
      detectedMood = "nostalgic";
      moodExplanation = "Nostalgic reminiscing — shifting to warm sepia amber glow";
    } else if (
      lower.includes("haha") ||
      lower.includes("lol") ||
      lower.includes("funny") ||
      lower.includes("laugh") ||
      lower.includes("joke") ||
      lower.includes("pizza") ||
      lower.includes("burned") ||
      lower.includes("khush")
    ) {
      detectedMood = "joyful";
      moodExplanation = "Joyful celebration & shared laughter — shifting to champagne gold sparkles";
    } else if (
      lower.includes("love") ||
      lower.includes("pyaar") ||
      lower.includes("sweet") ||
      lower.includes("darling") ||
      lower.includes("heart") ||
      lower.includes("forever")
    ) {
      detectedMood = "romantic";
      moodExplanation = "Pure romantic devotion — slow-motion rose petal breeze";
    }

    res.json({
      reply: replyText,
      detectedMood,
      moodExplanation,
      alertDispatched,
      alertMessage: alertText,
      senderPhone: box.senderPhone || null,
    });
  } catch (err: any) {
    console.error("Gemini memory buddy chat error:", err);
    res.status(500).json({
      reply: "I'm your little memory keeper! Every single item in this box was chosen with so much love just for you.",
      detectedMood: "romantic",
      moodExplanation: "Default romantic atmosphere",
    });
  }
});

// ----------------------------------------------------
// VITE / STATIC INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MemoryBox server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
