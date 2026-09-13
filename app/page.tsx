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
  { name: "Mom", emoji: "👩" },
  { name: "Dad", emoji: "👨" },
  { name: "Partner", emoji: "❤️" },
  { name: "Friend", emoji: "👥" },
  { name: "Coworker", emoji: "💼" },
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
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-pink-100 bg-white/90 px-6 py-5 backdrop-blur-md md:px-12">
        <div className="text-2xl font-black text-pink-600">
          🎁 GiftMatch
        </div>

        <div className="hidden gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#finder" className="hover:text-pink-600">
            Gift Finder
          </a>
          <a href="#results" className="hover:text-pink-600">
            Gifts
          </a>
          <a href="#how" className="hover:text-pink-600">
            How It Works
          </a>
        </div>

        <button
          onClick={() =>
            document.getElementById("finder")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="rounded-full bg-pink-600 px-5 py-2 font-semibold text-white hover:bg-pink-700"
        >
          Find a Gift
        </button>
      </nav>

      {/* HERO */}
      <section className="px-6 pb-10 pt-16 text-center md:pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
            ✨ Smart gift ideas for every occasion
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Find the perfect gift
            <span className="block text-pink-600">
              in seconds. 🎁
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            Tell us who you&apos;re shopping for, the occasion, and your
            budget. GiftMatch will find ideas that fit.
          </p>
        </div>
      </section>

      {/* FINDER */}
      <section id="finder" className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl shadow-pink-100 md:p-10">
          {/* RECIPIENT */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold">
              1. Who are you buying for?
            </h2>

            <p className="mb-5 mt-2 text-gray-500">
              Choose the person you want to surprise.
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {recipients.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setRecipient(item.name);
                    setShowResults(false);
                  }}
                  className={`rounded-2xl border-2 p-5 transition hover:-translate-y-1 hover:shadow-md ${
                    recipient === item.name
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <div className="mt-2 font-semibold">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* OCCASION */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold">
              2. What&apos;s the occasion?
            </h2>

            <p className="mb-5 mt-2 text-gray-500">
              Pick the occasion.
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {occasions.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setOccasion(item.name);
                    setShowResults(false);
                  }}
                  className={`rounded-2xl border-2 p-5 transition hover:-translate-y-1 ${
                    occasion === item.name
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <div className="mt-2 font-semibold">
                    {item.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold">
              3. What&apos;s your budget?
            </h2>

            <p className="mb-5 mt-2 text-gray-500">
              Choose how much you&apos;d like to spend.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {budgets.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setBudget(item.label);
                    setShowResults(false);
                  }}
                  className={`rounded-2xl border-2 px-4 py-5 font-semibold transition hover:-translate-y-1 ${
                    budget === item.label
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  💵 {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* FIND */}
          <button
            onClick={findGifts}
            disabled={!recipient || !occasion || !budget}
            className={`w-full rounded-2xl py-5 text-lg font-bold text-white shadow-lg transition ${
              recipient && occasion && budget
                ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.01]"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            ✨ Find My Perfect Gifts
          </button>

          {(!recipient || !occasion || !budget) && (
            <p className="mt-4 text-center text-sm text-gray-400">
              Select a recipient, occasion, and budget to continue.
            </p>
          )}
        </div>
      </section>

      {/* RESULTS */}
      {showResults && (
        <section id="results" className="bg-white px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <div className="mb-4 text-5xl">🎁</div>

              <h2 className="text-4xl font-black md:text-5xl">
                Your Gift Recommendations
              </h2>

              <p className="mt-4 text-gray-500">
                Gifts for{" "}
                <strong className="text-pink-600">
                  {recipient}
                </strong>{" "}
                • {occasion} • {budget}
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((gift) => (
                  <div
                    key={gift.name}
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* PRODUCT PHOTO */}
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />

                      <div className="absolute left-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                        ⭐ Recommended
                      </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="p-5">
                      {/* RATING */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-yellow-500">
                          {"★".repeat(Math.floor(gift.rating))}
                        </span>

                        <span className="text-sm font-bold text-gray-700">
                          {gift.rating}
                        </span>

                        <span className="text-sm text-gray-400">
                          ({gift.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* NAME */}
                      <h3 className="mt-3 text-xl font-bold text-gray-900">
                        {gift.name}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-2 min-h-[60px] text-sm leading-6 text-gray-500">
                        {gift.description}
                      </p>

                      {/* PRICE */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-black text-gray-900">
                          ${gift.price.toFixed(2)}
                        </span>

                        <span className="text-xs font-bold text-green-600">
                          ✓ Great Match
                        </span>
                      </div>

                      {/* SHOP BUTTON */}
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.amazon.com/s?k=${encodeURIComponent(
                              gift.name
                            )}`,
                            "_blank"
                          )
                        }
                        className="mt-5 w-full rounded-xl bg-pink-600 py-3 font-bold text-white transition hover:bg-pink-700"
                      >
                        🛒 Shop Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-3xl bg-gray-50 p-10 text-center">
                <div className="text-6xl">🤔</div>

                <h3 className="mt-5 text-2xl font-bold">
                  We need more gift ideas!
                </h3>

                <p className="mt-3 text-gray-500">
                  We couldn&apos;t find an exact match for this combination
                  yet. Try another budget or occasion.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how" className="px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-black">
            How GiftMatch Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <div className="text-5xl">👤</div>
              <h3 className="mt-5 text-xl font-bold">
                Choose who
              </h3>
              <p className="mt-3 text-gray-500">
                Tell us who you&apos;re shopping for.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md">
              <div className="text-5xl">💵</div>
              <h3 className="mt-5 text-xl font-bold">
                Set your budget
              </h3>
              <p className="mt-3 text-gray-500">
                Pick a price range that works for you.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md">
              <div className="text-5xl">🎁</div>
              <h3 className="mt-5 text-xl font-bold">
                Get recommendations
              </h3>
              <p className="mt-3 text-gray-500">
                Discover gifts matched to your choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 px-6 py-12 text-center text-white">
        <div className="text-2xl font-black">
          🎁 GiftMatch
        </div>

        <p className="mt-3 text-gray-400">
          Find a gift they&apos;ll actually love.
        </p>

        <p className="mt-6 text-sm text-gray-600">
          © 2026 GiftMatch
        </p>
      </footer>
    </main>
  );
}