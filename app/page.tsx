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
    occasions: ["Birthday", "Christmas", "Anniversary"],
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
    <main className="min-h-screen bg-[#fffafc] text-slate-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl shadow-lg shadow-pink-200">
              🎁
            </div>

            <div className="text-xl font-black tracking-tight">
              Gift<span className="text-pink-600">Match</span>
            </div>
          </button>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a
              href="#finder"
              className="transition hover:text-pink-600"
            >
              Gift Finder
            </a>

            <a
              href="#how"
              className="transition hover:text-pink-600"
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
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-pink-600"
          >
            Find a Gift
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 md:pb-28 md:pt-28">

        {/* Background decorations */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-bold text-pink-600 shadow-sm">
            ✨ Smart gift ideas, made simple
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            Find a gift they&apos;ll
            <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              actually love. 🎁
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 md:text-xl md:leading-8">
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
            className="mt-9 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            Find My Perfect Gift →
          </button>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500">
            <span>✓ Personalized matches</span>
            <span>✓ Every budget</span>
            <span>✓ Multiple occasions</span>
          </div>
        </div>
      </section>

      {/* FINDER */}
      <section id="finder" className="scroll-mt-24 px-5 pb-24">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">

          {/* Finder header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-8 md:px-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                  Gift Finder
                </p>

                <h2 className="mt-1 text-3xl font-black md:text-4xl">
                  Let&apos;s find the right gift.
                </h2>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm">
                3 simple steps
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">

            {/* RECIPIENT */}
            <div className="mb-12">

              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 font-black text-pink-600">
                  1
                </div>

                <div>
                  <h2 className="text-xl font-black md:text-2xl">
                    Who are you buying for?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
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
                        ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-100"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-pink-200 hover:bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="text-4xl transition group-hover:scale-110">
                      {item.emoji}
                    </div>

                    <div className="mt-3 font-black">
                      {item.name}
                    </div>

                    <div className="mt-1 hidden text-xs leading-5 text-slate-500 md:block">
                      {item.desc}
                    </div>

                    {recipient === item.name && (
                      <div className="mt-3 text-xs font-black text-pink-600">
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 font-black text-purple-600">
                  2
                </div>

                <div>
                  <h2 className="text-xl font-black md:text-2xl">
                    What&apos;s the occasion?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Pick the moment you&apos;re celebrating.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {occasions.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setOccasion(item.name);
                      setShowResults(false);
                    }}
                    className={`rounded-2xl border-2 p-5 transition duration-200 ${
                      occasion === item.name
                        ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-100"
                        : "border-slate-100 bg-slate-50 hover:-translate-y-1 hover:border-purple-200 hover:bg-white hover:shadow-lg"
                    }`}
                  >
                    <div className="text-4xl">{item.emoji}</div>

                    <div className="mt-3 font-black">
                      {item.name}
                    </div>

                    {occasion === item.name && (
                      <div className="mt-2 text-xs font-black text-purple-600">
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-600">
                  3
                </div>

                <div>
                  <h2 className="text-xl font-black md:text-2xl">
                    What&apos;s your budget?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
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
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100"
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
                  ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:-translate-y-1 hover:shadow-2xl"
                  : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
              }`}
            >
              ✨ Find My Perfect Gifts
            </button>

            {(!recipient || !occasion || !budget) && (
              <p className="mt-4 text-center text-xs font-medium text-slate-400">
                Select all 3 options above to see your recommendations.
              </p>
            )}

          </div>
        </div>
      </section>

      {/* RESULTS */}
      {showResults && (
        <section id="results" className="scroll-mt-20 bg-white px-5 py-24">

          <div className="mx-auto max-w-7xl">

            <div className="mx-auto mb-14 max-w-3xl text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-4xl">
                🎁
              </div>

              <p className="text-sm font-black uppercase tracking-widest text-pink-600">
                Your matches
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                Gifts picked for you
              </h2>

              <p className="mt-5 text-slate-500">
                For{" "}
                <strong className="text-slate-900">
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
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >

                    {/* IMAGE */}
                    <div className="relative h-64 overflow-hidden bg-slate-100">

                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-pink-600 shadow-lg backdrop-blur">
                        ⭐ Great Match
                      </div>

                      <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/85 px-3 py-2 text-lg font-black text-white backdrop-blur">
                        ${gift.price.toFixed(2)}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="p-6">

                      <div className="flex items-center gap-2">
                        <span className="text-sm tracking-wide text-yellow-500">
                          ★★★★★
                        </span>

                        <span className="text-sm font-black">
                          {gift.rating}
                        </span>

                        <span className="text-xs text-slate-400">
                          ({gift.reviews.toLocaleString()})
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black">
                        {gift.name}
                      </h3>

                      <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">
                        {gift.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Price
                          </div>

                          <div className="mt-1 text-2xl font-black">
                            ${gift.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600">
                            ✓ Matches
                          </div>

                          <div className="text-xs text-slate-400">
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
                        className="mt-5 w-full rounded-xl bg-slate-900 py-3.5 font-black text-white transition hover:bg-pink-600"
                      >
                        🛒 View Gift →
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">

                <div className="text-6xl">🤔</div>

                <h3 className="mt-5 text-2xl font-black">
                  No exact matches yet
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  Try another budget or occasion and we&apos;ll look for
                  different gift ideas.
                </p>

                <button
                  onClick={() =>
                    document.getElementById("finder")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
                >
                  Try Again
                </button>

              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how" className="scroll-mt-20 px-5 py-24">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-black uppercase tracking-widest text-pink-600">
              Simple & easy
            </p>

            <h2 className="mt-2 text-4xl font-black md:text-5xl">
              How GiftMatch works
            </h2>

            <p className="mt-5 text-slate-500">
              Finding a thoughtful gift shouldn&apos;t take hours.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                👤
              </div>

              <div className="mt-7 text-sm font-black text-pink-600">
                STEP 01
              </div>

              <h3 className="mt-2 text-2xl font-black">
                Choose who
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Tell us who you&apos;re shopping for so we can personalize
                your gift ideas.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                💵
              </div>

              <div className="mt-7 text-sm font-black text-purple-600">
                STEP 02
              </div>

              <h3 className="mt-2 text-2xl font-black">
                Set your budget
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Pick a comfortable price range and we&apos;ll find gifts
                that fit.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                🎁
              </div>

              <div className="mt-7 text-sm font-black text-emerald-600">
                STEP 03
              </div>

              <h3 className="mt-2 text-2xl font-black">
                Discover gifts
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                Get gift recommendations matched to the person, occasion,
                and budget.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">

        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-7 py-14 text-center text-white shadow-2xl md:px-10">

          <div className="text-5xl">🎁</div>

          <h2 className="mt-5 text-3xl font-black md:text-4xl">
            Your perfect gift is waiting.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 md:text-base">
            Skip the endless searching. Tell GiftMatch what you need and
            discover thoughtful ideas in seconds.
          </p>

          <button
            onClick={() =>
              document.getElementById("finder")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-7 rounded-xl bg-white px-7 py-3.5 font-black text-purple-700 shadow-xl transition hover:-translate-y-1"
          >
            Start Finding Gifts →
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-14 text-white">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row">

            <div>
              <div className="flex items-center gap-2 text-2xl font-black">
                🎁 Gift<span className="text-pink-500">Match</span>
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
                  className="block hover:text-pink-400"
                >
                  Gift Finder
                </a>

                <a
                  href="#how"
                  className="mt-2 block hover:text-pink-400"
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
              </div>
            </div>

          </div>

          <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
            © 2026 GiftMatch. All rights reserved.
          </div>

        </div>
      </footer>

    </main>
  );
}