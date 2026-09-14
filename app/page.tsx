"use client";

import { useMemo, useState } from "react";

type Gift = {
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  recipients: string[];
  occasions: string[];
  halloween?: boolean;
};

const recipients = [
  { name: "Mom", emoji: "👩", desc: "For the one who means everything" },
  { name: "Dad", emoji: "👨", desc: "For your everyday hero" },
  { name: "Partner", emoji: "❤️", desc: "For someone truly special" },
  { name: "Friend", emoji: "👥", desc: "For your favorite people" },
  { name: "Coworker", emoji: "💼", desc: "Perfect for the office" },
];

const occasions = [
  { name: "Birthday", emoji: "🎂" },
  { name: "Christmas", emoji: "🎄" },
  { name: "Anniversary", emoji: "💍" },
  { name: "Secret Santa", emoji: "🎅" },
  { name: "Halloween", emoji: "🎃" },
];

const budgets = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250+", min: 250, max: 1000 },
];

const gifts: Gift[] = [
  {
    name: "Personalized Photo Frame",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85",
    price: 24.99,
    rating: 4.8,
    reviews: 12435,
    description:
      "A thoughtful personalized keepsake for displaying a favorite family memory.",
    recipients: ["Mom", "Dad", "Partner", "Friend"],
    occasions: ["Birthday", "Christmas", "Anniversary"],
  },
  {
    name: "Luxury Spa Gift Set",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",
    price: 39.99,
    rating: 4.7,
    reviews: 8942,
    description:
      "A relaxing self-care collection made for a cozy spa night at home.",
    recipients: ["Mom", "Partner", "Friend"],
    occasions: ["Birthday", "Christmas"],
  },
  {
    name: "Premium Coffee Gift Set",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
    price: 42.99,
    rating: 4.6,
    reviews: 6521,
    description:
      "A gourmet coffee gift with a stylish mug and premium coffee blends.",
    recipients: ["Dad", "Friend", "Coworker"],
    occasions: ["Birthday", "Christmas", "Secret Santa"],
  },
  {
    name: "Heart Necklace",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
    price: 49.99,
    rating: 4.7,
    reviews: 9314,
    description:
      "A timeless heart necklace for someone special in your life.",
    recipients: ["Partner", "Mom"],
    occasions: ["Birthday", "Anniversary", "Christmas"],
  },
  {
    name: "Cozy Throw Blanket",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85",
    price: 27.99,
    rating: 4.8,
    reviews: 5276,
    description:
      "A soft and cozy throw blanket perfect for relaxing at home.",
    recipients: ["Mom", "Dad", "Partner", "Friend"],
    occasions: ["Birthday", "Christmas"],
  },
  {
    name: "Fresh Flower Bouquet",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    price: 29.99,
    rating: 4.6,
    reviews: 4832,
    description:
      "A beautiful flower arrangement for birthdays and special moments.",
    recipients: ["Mom", "Partner", "Friend"],
    occasions: ["Birthday", "Anniversary", "Christmas"],
  },
  {
    name: "Luxury Candle Set",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    price: 45,
    rating: 4.7,
    reviews: 3921,
    description:
      "Elegant scented candles that create a warm and relaxing atmosphere.",
    recipients: ["Mom", "Partner", "Friend", "Coworker"],
    occasions: ["Birthday", "Christmas", "Anniversary", "Halloween"],
    halloween: true,
  },
  {
    name: "Personalized Coffee Mug",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=85",
    price: 22.99,
    rating: 4.8,
    reviews: 7620,
    description:
      "A personalized mug that makes every morning coffee more special.",
    recipients: ["Mom", "Dad", "Friend", "Coworker"],
    occasions: ["Birthday", "Christmas", "Secret Santa"],
  },
  {
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    price: 89.99,
    rating: 4.7,
    reviews: 11042,
    description:
      "A practical tech gift for music, podcasts and everyday entertainment.",
    recipients: ["Partner", "Friend", "Coworker", "Dad"],
    occasions: ["Birthday", "Christmas"],
  },
  {
    name: "Smartwatch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    price: 149.99,
    rating: 4.6,
    reviews: 15420,
    description:
      "A stylish smartwatch that makes a great premium gift.",
    recipients: ["Dad", "Partner", "Friend"],
    occasions: ["Birthday", "Christmas", "Anniversary"],
  },

  /* Halloween gifts */
  {
    name: "Halloween Scented Candle",
    image:
      "https://images.unsplash.com/photo-1602874801006-e26f6e1c8d9c?auto=format&fit=crop&w=900&q=85",
    price: 19.99,
    rating: 4.8,
    reviews: 3842,
    description:
      "A cozy Halloween-inspired candle that adds a warm spooky atmosphere.",
    recipients: ["Mom", "Partner", "Friend", "Coworker"],
    occasions: ["Halloween"],
    halloween: true,
  },
  {
    name: "Cute Halloween Mug",
    image:
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=85",
    price: 21.99,
    rating: 4.7,
    reviews: 4210,
    description:
      "A fun Halloween mug for coffee, tea and cozy autumn mornings.",
    recipients: ["Mom", "Dad", "Friend", "Coworker"],
    occasions: ["Halloween"],
    halloween: true,
  },
  {
    name: "Halloween Gift Basket",
    image:
      "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=900&q=85",
    price: 34.99,
    rating: 4.8,
    reviews: 2961,
    description:
      "A fun Halloween-themed gift basket packed with seasonal surprises.",
    recipients: ["Friend", "Partner", "Coworker"],
    occasions: ["Halloween"],
    halloween: true,
  },
  {
    name: "Spooky Home Decoration Set",
    image:
      "https://images.unsplash.com/photo-1508361001413-7a9e0b6c1c5a?auto=format&fit=crop&w=900&q=85",
    price: 39.99,
    rating: 4.6,
    reviews: 1852,
    description:
      "Cute spooky decorations for creating a fun Halloween atmosphere.",
    recipients: ["Friend", "Partner", "Mom"],
    occasions: ["Halloween"],
    halloween: true,
  },
];

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [showResults, setShowResults] = useState(false);

  const selectedBudget = budgets.find((b) => b.label === budget);

  const recommendations = useMemo(() => {
    if (!recipient || !occasion || !selectedBudget) {
      return [];
    }

    return gifts.filter((gift) => {
      const recipientMatch = gift.recipients.includes(recipient);
      const occasionMatch = gift.occasions.includes(occasion);
      const budgetMatch =
        gift.price >= selectedBudget.min &&
        gift.price <= selectedBudget.max;

      return recipientMatch && occasionMatch && budgetMatch;
    });
  }, [recipient, occasion, selectedBudget]);

  const isHalloween = occasion === "Halloween";

  function findGifts() {
    if (!recipient || !occasion || !budget) return;

    setShowResults(true);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  return (
    <main
      className={`min-h-screen text-slate-100 ${
        isHalloween
          ? "bg-[#08060d]"
          : "bg-[#fffafc] text-slate-900"
      }`}
    >
      {/* NAVBAR */}

      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isHalloween
            ? "border-purple-900/40 bg-[#0b0812]/90"
            : "border-slate-200/70 bg-white/90"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-2"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl shadow-lg ${
                isHalloween
                  ? "bg-gradient-to-br from-orange-500 to-purple-700 shadow-orange-950"
                  : "bg-gradient-to-br from-pink-500 to-purple-600 shadow-pink-200"
              }`}
            >
              {isHalloween ? "🎃" : "🎁"}
            </div>

            <div
              className={`text-xl font-black tracking-tight ${
                isHalloween ? "text-white" : ""
              }`}
            >
              Gift<span className={isHalloween ? "text-orange-500" : "text-pink-600"}>
                Match
              </span>
            </div>
          </button>

          <div
            className={`hidden items-center gap-8 text-sm font-semibold md:flex ${
              isHalloween ? "text-purple-200" : "text-slate-600"
            }`}
          >
            <a
              href="#finder"
              className="transition hover:text-orange-500"
            >
              Gift Finder
            </a>

            <a
              href="#how"
              className="transition hover:text-orange-500"
            >
              How It Works
            </a>
          </div>

          <button
            onClick={() =>
              document.getElementById("finder")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className={`rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
              isHalloween
                ? "bg-orange-600 hover:bg-orange-500"
                : "bg-slate-900 hover:bg-pink-600"
            }`}
          >
            {isHalloween ? "🎃 Find a Gift" : "Find a Gift"}
          </button>
        </div>
      </nav>

      {/* HERO */}

      <section
        className={`relative overflow-hidden px-5 pb-20 pt-20 md:pb-28 md:pt-28 ${
          isHalloween
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,.18),transparent_30%),#08060d]"
            : ""
        }`}
      >

        {/* Halloween decorations */}

        {isHalloween && (
          <>
            <div className="pointer-events-none absolute left-5 top-10 text-5xl opacity-70 animate-bounce">
              👻
            </div>

            <div className="pointer-events-none absolute right-8 top-20 text-5xl opacity-70">
              🎃
            </div>

            <div className="pointer-events-none absolute bottom-10 left-10 text-3xl opacity-40">
              🕸️
            </div>

            <div className="pointer-events-none absolute bottom-16 right-10 text-3xl opacity-40">
              🦇
            </div>
          </>
        )}

        <div className="relative mx-auto max-w-5xl text-center">

          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm ${
              isHalloween
                ? "border-orange-500/30 bg-purple-950/50 text-orange-400 shadow-orange-950"
                : "border-pink-200 bg-white text-pink-600"
            }`}
          >
            {isHalloween
              ? "🎃 Spooky gifts, made simple 👻"
              : "✨ Smart gift ideas, made simple"}
          </div>

          <h1
            className={`text-5xl font-black leading-[1.05] tracking-tight md:text-7xl ${
              isHalloween ? "text-white" : ""
            }`}
          >
            {isHalloween ? (
              <>
                Find a gift that&apos;s
                <span className="block bg-gradient-to-r from-orange-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  spookily perfect. 🎃
                </span>
              </>
            ) : (
              <>
                Find a gift they&apos;ll
                <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  actually love. 🎁
                </span>
              </>
            )}
          </h1>

          <p
            className={`mx-auto mt-7 max-w-2xl text-base leading-7 md:text-xl md:leading-8 ${
              isHalloween ? "text-purple-200" : "text-slate-600"
            }`}
          >
            Tell us who you&apos;re shopping for, the occasion, and your
            budget. We&apos;ll help you discover thoughtful gift ideas in
            seconds.
          </p>

          <button
            onClick={() =>
              document.getElementById("finder")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className={`mt-9 rounded-2xl px-8 py-4 text-base font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl ${
              isHalloween
                ? "bg-gradient-to-r from-orange-600 via-purple-600 to-fuchsia-700 shadow-purple-950"
                : "bg-gradient-to-r from-pink-600 to-purple-600 shadow-pink-200"
            }`}
          >
            {isHalloween
              ? "🎃 Find My Spooky Gift →"
              : "Find My Perfect Gift →"}
          </button>

          <div
            className={`mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold ${
              isHalloween ? "text-purple-300" : "text-slate-500"
            }`}
          >
            <span>✓ Personalized matches</span>
            <span>✓ Every budget</span>
            <span>✓ Multiple occasions</span>
            {isHalloween && <span>✓ Halloween picks</span>}
          </div>
        </div>
      </section>

      {/* FINDER */}

      <section
        id="finder"
        className={`scroll-mt-24 px-5 pb-24 ${
          isHalloween ? "bg-[#08060d]" : ""
        }`}
      >

        <div
          className={`mx-auto max-w-6xl overflow-hidden rounded-[2rem] border shadow-2xl ${
            isHalloween
              ? "border-purple-900/50 bg-[#110d1b] shadow-purple-950/40"
              : "border-slate-200 bg-white shadow-slate-200/60"
          }`}
        >

          <div
            className={`border-b px-6 py-8 md:px-10 ${
              isHalloween
                ? "border-purple-900/40 bg-gradient-to-r from-[#1c1029] via-[#160d22] to-[#241008]"
                : "border-slate-100 bg-gradient-to-r from-pink-50 to-purple-50"
            }`}
          >

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${
                    isHalloween ? "text-orange-400" : "text-pink-600"
                  }`}
                >
                  {isHalloween ? "🎃 Halloween Gift Finder" : "Gift Finder"}
                </p>

                <h2
                  className={`mt-1 text-3xl font-black md:text-4xl ${
                    isHalloween ? "text-white" : ""
                  }`}
                >
                  {isHalloween
                    ? "Let&apos;s find something spooky."
                    : "Let&apos;s find the right gift."}
                </h2>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm ${
                  isHalloween
                    ? "bg-purple-950 text-orange-300"
                    : "bg-white text-slate-500"
                }`}
              >
                3 simple steps
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">

            {/* RECIPIENT */}

            <div className="mb-12">

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 font-black text-orange-400">
                  1
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    Who are you buying for?
                  </h2>

                  <p
                    className={
                      isHalloween ? "mt-1 text-sm text-purple-300" : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Choose the person you want to surprise.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

                {recipients.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setRecipient(item.name);
                      setShowResults(false);
                    }}
                    className={`group rounded-2xl border-2 p-5 text-left transition duration-200 ${
                      recipient === item.name
                        ? isHalloween
                          ? "border-orange-500 bg-orange-950/30 shadow-lg shadow-orange-950"
                          : "border-pink-500 bg-pink-50 shadow-lg shadow-pink-100"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#171020] hover:-translate-y-1 hover:border-orange-500/50 hover:bg-[#20142c] hover:shadow-lg"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-pink-200 hover:bg-white hover:shadow-lg"
                    }`}
                  >

                    <div className="text-4xl transition group-hover:scale-110">
                      {item.emoji}
                    </div>

                    <div
                      className={`mt-3 font-black ${
                        isHalloween ? "text-white" : ""
                      }`}
                    >
                      {item.name}
                    </div>

                    <div
                      className={`mt-1 hidden text-xs leading-5 md:block ${
                        isHalloween ? "text-purple-300" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </div>

                    {recipient === item.name && (
                      <div
                        className={`mt-3 text-xs font-black ${
                          isHalloween ? "text-orange-400" : "text-pink-600"
                        }`}
                      >
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}

              </div>
            </div>

            {/* OCCASION */}

            <div className="mb-12">

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 font-black text-purple-400">
                  2
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    What&apos;s the occasion?
                  </h2>

                  <p
                    className={
                      isHalloween ? "mt-1 text-sm text-purple-300" : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Pick the moment you&apos;re celebrating.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

                {occasions.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setOccasion(item.name);
                      setShowResults(false);
                    }}
                    className={`rounded-2xl border-2 p-5 transition duration-200 ${
                      occasion === item.name
                        ? isHalloween
                          ? "border-orange-500 bg-orange-950/30 shadow-lg shadow-orange-950"
                          : "border-purple-500 bg-purple-50 shadow-lg shadow-purple-100"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#171020] hover:-translate-y-1 hover:border-orange-500/50 hover:bg-[#20142c] hover:shadow-lg"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-purple-200 hover:bg-white hover:shadow-lg"
                    }`}
                  >

                    <div className="text-4xl">{item.emoji}</div>

                    <div
                      className={`mt-3 font-black ${
                        isHalloween ? "text-white" : ""
                      }`}
                    >
                      {item.name}
                    </div>

                    {occasion === item.name && (
                      <div
                        className={`mt-2 text-xs font-black ${
                          isHalloween ? "text-orange-400" : "text-purple-600"
                        }`}
                      >
                        ✓ Selected
                      </div>
                    )}

                  </button>
                ))}

              </div>
            </div>

            {/* BUDGET */}

            <div className="mb-10">

              <div className="mb-6 flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-400">
                  3
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    What&apos;s your budget?
                  </h2>

                  <p
                    className={
                      isHalloween ? "mt-1 text-sm text-purple-300" : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Choose a price range that works for you.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                {budgets.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setBudget(item.label);
                      setShowResults(false);
                    }}
                    className={`rounded-2xl border-2 px-4 py-5 font-black transition duration-200 ${
                      budget === item.label
                        ? isHalloween
                          ? "border-emerald-500 bg-emerald-950/30 text-emerald-400 shadow-lg shadow-emerald-950"
                          : "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#171020] text-white hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-[#20142c] hover:shadow-lg"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg"
                    }`}
                  >
                    💵 {item.label}
                  </button>
                ))}

              </div>
            </div>

            {/* CTA */}

            <button
              onClick={findGifts}
              disabled={!recipient || !occasion || !budget}
              className={`w-full rounded-2xl py-5 text-base font-black text-white shadow-xl transition duration-200 md:text-lg ${
                recipient && occasion && budget
                  ? isHalloween
                    ? "bg-gradient-to-r from-orange-600 via-purple-600 to-fuchsia-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950"
                    : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:-translate-y-1 hover:shadow-2xl"
                  : "cursor-not-allowed bg-slate-700 text-slate-500 shadow-none"
              }`}
            >
              {isHalloween
                ? "🎃 Find My Spooky Gifts"
                : "✨ Find My Perfect Gifts"}
            </button>

            {(!recipient || !occasion || !budget) && (
              <p
                className={`mt-4 text-center text-xs font-medium ${
                  isHalloween ? "text-purple-400" : "text-slate-400"
                }`}
              >
                Select all 3 options above to see your recommendations.
              </p>
            )}

          </div>
        </div>
      </section>

      {/* RESULTS */}

      {showResults && (
        <section
          id="results"
          className={`scroll-mt-20 px-5 py-24 ${
            isHalloween ? "bg-[#0b0710]" : "bg-white"
          }`}
        >

          <div className="mx-auto max-w-7xl">

            <div className="mx-auto mb-14 max-w-3xl text-center">

              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
                  isHalloween
                    ? "bg-gradient-to-br from-orange-950 to-purple-950 shadow-xl shadow-purple-950"
                    : "bg-gradient-to-br from-pink-100 to-purple-100"
                }`}
              >
                {isHalloween ? "🎃" : "🎁"}
              </div>

              <p
                className={`text-sm font-black uppercase tracking-widest ${
                  isHalloween ? "text-orange-400" : "text-pink-600"
                }`}
              >
                {isHalloween ? "Your spooky matches" : "Your matches"}
              </p>

              <h2
                className={`mt-2 text-4xl font-black tracking-tight md:text-5xl ${
                  isHalloween ? "text-white" : ""
                }`}
              >
                {isHalloween
                  ? "Gifts picked for your Halloween"
                  : "Gifts picked for you"}
              </h2>

              <p
                className={`mt-5 ${
                  isHalloween ? "text-purple-300" : "text-slate-500"
                }`}
              >
                For{" "}
                <strong
                  className={isHalloween ? "text-white" : "text-slate-900"}
                >
                  {recipient}
                </strong>{" "}
                · {occasion} · {budget}
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {recommendations.map((gift) => (
                  <div
                    key={gift.name}
                    className={`group overflow-hidden rounded-3xl border shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                      isHalloween
                        ? "border-purple-900/50 bg-[#15101d] shadow-purple-950/30 hover:border-orange-500/40"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    {/* IMAGE */}

                    <div className="relative h-64 overflow-hidden bg-slate-100">

                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black shadow-lg backdrop-blur ${
                          gift.halloween || isHalloween
                            ? "bg-orange-500 text-white"
                            : "bg-white/95 text-pink-600"
                        }`}
                      >
                        {gift.halloween || isHalloween
                          ? "🎃 Spooky Pick"
                          : "⭐ Great Match"}
                      </div>

                      <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-3 py-2 text-lg font-black text-white backdrop-blur">
                        ${gift.price.toFixed(2)}
                      </div>
                    </div>

                    {/* INFO */}

                    <div className="p-6">

                      <div className="flex items-center gap-2">
                        <span className="text-sm tracking-wide text-yellow-500">
                          ★★★★★
                        </span>

                        <span
                          className={`text-sm font-black ${
                            isHalloween ? "text-white" : ""
                          }`}
                        >
                          {gift.rating}
                        </span>

                        <span
                          className={`text-xs ${
                            isHalloween ? "text-purple-400" : "text-slate-400"
                          }`}
                        >
                          ({gift.reviews.toLocaleString()})
                        </span>
                      </div>

                      <h3
                        className={`mt-4 text-xl font-black ${
                          isHalloween ? "text-white" : ""
                        }`}
                      >
                        {gift.name}
                      </h3>

                      <p
                        className={`mt-2 min-h-[72px] text-sm leading-6 ${
                          isHalloween ? "text-purple-300" : "text-slate-500"
                        }`}
                      >
                        {gift.description}
                      </p>

                      <div
                        className={`mt-5 flex items-center justify-between border-t pt-5 ${
                          isHalloween
                            ? "border-purple-900/50"
                            : "border-slate-100"
                        }`}
                      >

                        <div>
                          <div
                            className={`text-xs font-bold uppercase tracking-wide ${
                              isHalloween ? "text-purple-400" : "text-slate-400"
                            }`}
                          >
                            Price
                          </div>

                          <div
                            className={`mt-1 text-2xl font-black ${
                              isHalloween ? "text-white" : ""
                            }`}
                          >
                            ${gift.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-500">
                            ✓ Matches
                          </div>

                          <div
                            className={`text-xs ${
                              isHalloween ? "text-purple-400" : "text-slate-400"
                            }`}
                          >
                            your preferences
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          window.open(
                            `https://www.amazon.com/s?k=${encodeURIComponent(
                              gift.name
                            )}`,
                            "_blank"
                          )
                        }
                        className={`mt-5 w-full rounded-xl py-3.5 font-black text-white transition ${
                          isHalloween
                            ? "bg-orange-600 hover:bg-orange-500"
                            : "bg-slate-900 hover:bg-pink-600"
                        }`}
                      >
                        🛒 View Gift →
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div
                className={`mx-auto max-w-xl rounded-3xl border p-10 text-center ${
                  isHalloween
                    ? "border-purple-900/50 bg-[#15101d]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >

                <div className="text-6xl">👻</div>

                <h3
                  className={`mt-5 text-2xl font-black ${
                    isHalloween ? "text-white" : ""
                  }`}
                >
                  No exact matches yet
                </h3>

                <p
                  className={`mt-3 leading-7 ${
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }`}
                >
                  Try another budget or occasion and we&apos;ll look for
                  different gift ideas.
                </p>

                <button
                  onClick={() =>
                    document.getElementById("finder")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className={`mt-6 rounded-xl px-6 py-3 font-bold text-white ${
                    isHalloween
                      ? "bg-orange-600 hover:bg-orange-500"
                      : "bg-slate-900"
                  }`}
                >
                  Try Again
                </button>

              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}

      <section
        id="how"
        className={`scroll-mt-20 px-5 py-24 ${
          isHalloween ? "bg-[#08060d]" : ""
        }`}
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p
              className={`text-sm font-black uppercase tracking-widest ${
                isHalloween ? "text-orange-400" : "text-pink-600"
              }`}
            >
              Simple & easy
            </p>

            <h2
              className={`mt-2 text-4xl font-black md:text-5xl ${
                isHalloween ? "text-white" : ""
              }`}
            >
              How GiftMatch works
            </h2>

            <p
              className={`mt-5 ${
                isHalloween ? "text-purple-300" : "text-slate-500"
              }`}
            >
              Finding a thoughtful gift shouldn&apos;t take hours.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {[
              {
                emoji: "👤",
                step: "STEP 01",
                title: "Choose who",
                text: "Tell us who you're shopping for so we can personalize your gift ideas.",
              },
              {
                emoji: "💵",
                step: "STEP 02",
                title: "Set your budget",
                text: "Pick a comfortable price range and we'll find gifts that fit.",
              },
              {
                emoji: isHalloween ? "🎃" : "🎁",
                step: "STEP 03",
                title: "Discover gifts",
                text: "Get gift recommendations matched to the person, occasion, and budget.",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className={`rounded-3xl border p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl ${
                  isHalloween
                    ? "border-purple-900/50 bg-[#15101d]"
                    : "border-slate-200 bg-white"
                }`}
              >

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${
                    index === 0
                      ? "bg-orange-500/10"
                      : index === 1
                      ? "bg-purple-500/10"
                      : "bg-emerald-500/10"
                  }`}
                >
                  {item.emoji}
                </div>

                <div
                  className={`mt-7 text-sm font-black ${
                    index === 0
                      ? "text-orange-400"
                      : index === 1
                      ? "text-purple-400"
                      : "text-emerald-400"
                  }`}
                >
                  {item.step}
                </div>

                <h3
                  className={`mt-2 text-2xl font-black ${
                    isHalloween ? "text-white" : ""
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-3 leading-7 ${
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section
        className={`px-5 pb-24 ${
          isHalloween ? "bg-[#08060d]" : ""
        }`}
      >

        <div
          className={`mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-7 py-14 text-center text-white shadow-2xl md:px-10 ${
            isHalloween
              ? "bg-gradient-to-r from-[#241008] via-[#321052] to-[#12091d] shadow-purple-950"
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
          }`}
        >

          <div className="text-5xl">
            {isHalloween ? "🎃👻" : "🎁"}
          </div>

          <h2 className="mt-5 text-3xl font-black md:text-4xl">
            {isHalloween
              ? "A spooky surprise is waiting."
              : "Your perfect gift is waiting."}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 md:text-base">
            {isHalloween
              ? "Skip the endless searching. Find a fun Halloween gift they'll actually love."
              : "Skip the endless searching. Tell GiftMatch what you need and discover thoughtful ideas in seconds."}
          </p>

          <button
            onClick={() =>
              document.getElementById("finder")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className={`mt-7 rounded-xl px-7 py-3.5 font-black shadow-xl transition hover:-translate-y-1 ${
              isHalloween
                ? "bg-orange-500 text-white hover:bg-orange-400"
                : "bg-white text-purple-700"
            }`}
          >
            {isHalloween
              ? "🎃 Find a Halloween Gift →"
              : "Start Finding Gifts →"}
          </button>

        </div>
      </section>

      {/* FOOTER */}

      <footer
        className={`border-t px-6 py-14 ${
          isHalloween
            ? "border-purple-900/50 bg-[#050409] text-white"
            : "border-slate-800 bg-slate-950 text-white"
        }`}
      >

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>

              <div className="flex items-center gap-2 text-2xl font-black">
                {isHalloween ? "🎃" : "🎁"} Gift
                <span
                  className={
                    isHalloween ? "text-orange-500" : "text-pink-500"
                  }
                >
                  Match
                </span>
              </div>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Helping you find thoughtful gifts for the people who matter
                most.
              </p>

            </div>

            <div className="flex gap-10 text-sm text-slate-400">

              <div>
                <div className="mb-3 font-bold text-white">
                  Explore
                </div>

                <a
                  href="#finder"
                  className="block hover:text-orange-400"
                >
                  Gift Finder
                </a>

                <a
                  href="#how"
                  className="mt-2 block hover:text-orange-400"
                >
                  How It Works
                </a>
              </div>

              <div>
                <div className="mb-3 font-bold text-white">
                  GiftMatch
                </div>

                <div>Smart gift ideas</div>
                <div className="mt-2">Every occasion</div>
                <div className="mt-2 text-orange-400">🎃 Halloween</div>
              </div>

            </div>

          </div>

          <div className="mt-12 border-t border-purple-900/40 pt-6 text-xs text-slate-500">
            © 2026 GiftMatch. All rights reserved.
          </div>

        </div>
      </footer>

    </main>
  );
}