

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Gift = {
  name: string;
  image: string;
  price: number;
  description: string;
  url: string;
};

type MysteryGift = {
  name: string;
  emoji: string;
  price: number;
  description: string;
  recipients: string[];
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

const [gifts, setGifts] = useState<Gift[]>([]);
const [productsLoading, setProductsLoading] = useState(true);

useEffect(() => {
  async function loadGifts() {
    const { data, error } = await supabase
      .from("products")
      .select("name, description, price, image, url");

    if (error) {
      console.error("Error loading products:", error);
      setProductsLoading(false);
      return;
    }

    setGifts(data || []);
    setProductsLoading(false);
  }

  loadGifts();
}, []);

useEffect(() => {
  async function loadGifts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error("Error loading products:", error);
      setProductsLoading(false);
      return;
    }

    setGifts(data || []);
    setProductsLoading(false);
  }

  loadGifts();
}, []);

const mysteryGifts: MysteryGift[] = [
  {
    name: "Mystery Mini Gift",
    emoji: "🎁",
    price: 5,
    description: "A surprise gift picked specially for your selected person.",
    recipients: ["Mom", "Dad", "Partner", "Friend", "Coworker"],
  },
  {
    name: "Mystery Surprise Box",
    emoji: "🎀",
    price: 10,
    description: "A bigger mystery surprise with a little more excitement.",
    recipients: ["Mom", "Dad", "Partner", "Friend", "Coworker"],
  },
  {
    name: "Premium Mystery Box",
    emoji: "✨",
    price: 25,
    description: "Our premium mystery reward for the ultimate surprise.",
    recipients: ["Mom", "Dad", "Partner", "Friend", "Coworker"],
  },
];

const referralRewards = [
  {
    referrals: 5,
    reward: "$5 Mystery Gift",
    emoji: "🎁",
  },
  {
    referrals: 10,
    reward: "$10 Mystery Gift",
    emoji: "🎀",
  },
  {
    referrals: 25,
    reward: "$25 Premium Mystery Gift",
    emoji: "👑",
  },
];

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [mysteryRecipient, setMysteryRecipient] = useState("Friend");

  const [referrals, setReferrals] = useState(0);
  const [copied, setCopied] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [referralId, setReferralId] = useState("");

  const [user, setUser] = useState<any>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [referralRequired, setReferralRequired] = useState(false);

  const selectedBudget = budgets.find((b) => b.label === budget);
  const isHalloween = occasion === "Halloween";

  /*
   * REAL REFERRAL / AUTH SYSTEM
   */
  useEffect(() => {
    let mounted = true;

    async function loadUserData(currentUser: any) {
      if (!currentUser || !mounted) return;

      setUser(currentUser);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!profileError && profile?.referral_code) {
        setReferralId(profile.referral_code);
      }

      const {
        data: count,
        error: countError,
      } = await supabase.rpc("get_my_referral_count");

      if (!countError && typeof count === "number") {
        setReferrals(count);
      }

      const {
        data: claims,
        error: claimsError,
      } = await supabase.rpc("get_my_claimed_rewards");

      if (!claimsError && claims) {
        setClaimedRewards(
          claims.map((claim: { reward_referrals: number }) =>
            Number(claim.reward_referrals)
          )
        );
      }
    }

    async function initialize() {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");

      let cleanRef = "";

      if (ref) {
        cleanRef = ref.trim().toUpperCase();

        localStorage.setItem(
          "giftmatch_pending_referral",
          cleanRef
        );

        setReferralRequired(true);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        if (cleanRef) {
          const { error: referralError } = await supabase.rpc(
            "register_referral",
            {
              ref_code: cleanRef,
            }
          );

          if (!referralError) {
            localStorage.removeItem(
              "giftmatch_pending_referral"
            );
          }
        }

        await loadUserData(session.user);

        if (cleanRef) {
          setReferralRequired(false);
        }
      } else if (cleanRef) {
        setAuthMode("signup");
        setAuthOpen(true);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);

          const pendingReferral = localStorage.getItem(
            "giftmatch_pending_referral"
          );

          if (pendingReferral) {
            const { error: referralError } =
              await supabase.rpc("register_referral", {
                ref_code: pendingReferral,
              });

            if (!referralError) {
              localStorage.removeItem(
                "giftmatch_pending_referral"
              );
            }
          }

          await loadUserData(session.user);

          setReferralRequired(false);
          setAuthOpen(false);
        } else {
          setUser(null);
          setReferralId("");
          setReferrals(0);
          setClaimedRewards([]);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const recommendations = useMemo(() => {
  if (!recipient || !occasion || !selectedBudget) {
    return [];
  }

  return gifts.filter((gift) => {
    return (
      gift.price >= selectedBudget.min &&
      gift.price <= selectedBudget.max
    );
  });
}, [gifts, recipient, occasion, selectedBudget]);

  const mysteryRecommendations = useMemo(() => {
    return mysteryGifts.filter((gift) =>
      gift.recipients.includes(mysteryRecipient)
    );
  }, [mysteryRecipient]);

  const referralLink = referralId
    ? `https://giftmatch-taupe.vercel.app/?ref=${referralId}`
    : "";

  const nextReward =
    referralRewards.find(
      (reward) => referrals < reward.referrals
    ) || referralRewards[referralRewards.length - 1];

  const previousTarget =
    referralRewards
      .filter((reward) => reward.referrals <= referrals)
      .at(-1)?.referrals || 0;

  const progress =
    referrals >= 25
      ? 100
      : Math.min(
          100,
          ((referrals - previousTarget) /
            (nextReward.referrals - previousTarget)) *
            100
        );

  function findGifts() {
    if (!recipient || !occasion || !budget) return;

    setShowResults(true);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  }

  async function copyReferralLink() {
    if (!referralLink) {
      setAuthMode("signup");
      setReferralRequired(false);
      setAuthOpen(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleAuth() {
    if (!email || !password) {
      setAuthMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Password must be at least 6 characters.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    if (authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAuthMessage(error.message);
      } else if (data.session) {
        setAuthMessage("Account created successfully!");
      } else {
        setAuthMessage(
          "Account created! Please check your email to confirm your account, then login."
        );
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setAuthMessage(error.message);
      }
    }

    setAuthLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    setUser(null);
    setReferralId("");
    setReferrals(0);
    setClaimedRewards([]);
  }

  async function claimReward(target: number) {
    if (!user) {
      setAuthMode("login");
      setReferralRequired(false);
      setAuthOpen(true);
      return;
    }

    if (
      referrals < target ||
      claimedRewards.includes(target)
    ) {
      return;
    }

    const { data, error } = await supabase.rpc(
      "claim_referral_reward",
      {
        target_referrals: target,
      }
    );

    if (error || data !== true) {
      return;
    }

    setClaimedRewards((current) =>
      current.includes(target)
        ? current
        : [...current, target]
    );
  }

  return (
    <>
      {/* AUTH MODAL */}

      {authOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="text-center">
              <div className="text-5xl">🎁</div>

              <h2 className="mt-4 text-3xl font-black text-slate-900">
                {authMode === "signup"
                  ? "Create your account"
                  : "Welcome back"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {referralRequired
                  ? "Sign up to activate your referral reward."
                  : "Login to continue to GiftMatch."}
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-purple-500"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-purple-500"
              />

              {authMessage && (
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  {authMessage}
                </div>
              )}

              <button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-4 font-black text-white disabled:opacity-60"
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "signup"
                  ? "Create Account"
                  : "Login"}
              </button>
            </div>

            <div className="mt-5 text-center text-sm text-slate-500">
              {authMode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthMessage("");
                    }}
                    className="font-black text-purple-600"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthMessage("");
                    }}
                    className="font-black text-purple-600"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {!referralRequired && (
              <button
                onClick={() => {
                  setAuthOpen(false);
                  setAuthMessage("");
                }}
                className="mt-5 w-full text-sm font-bold text-slate-400"
              >
                Continue as Guest
              </button>
            )}
          </div>
        </div>
      )}

      <main
        className={`min-h-screen ${
          isHalloween
            ? "bg-[#08060d] text-slate-100"
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
                    ? "bg-gradient-to-br from-orange-500 to-purple-700"
                    : "bg-gradient-to-br from-pink-500 to-purple-600"
                }`}
              >
                {isHalloween ? "🎃" : "🎁"}
              </div>

              <div
                className={`text-xl font-black tracking-tight ${
                  isHalloween ? "text-white" : ""
                }`}
              >
                Gift
                <span
                  className={
                    isHalloween
                      ? "text-orange-500"
                      : "text-pink-600"
                  }
                >
                  Match
                </span>
              </div>
            </button>

            <div
              className={`hidden items-center gap-7 text-sm font-bold md:flex ${
                isHalloween
                  ? "text-purple-200"
                  : "text-slate-600"
              }`}
            >
              <a href="#finder" className="hover:text-pink-500">
                Gift Finder
              </a>

              <a
                href="#mystery"
                className="hover:text-purple-500"
              >
                Mystery Gifts
              </a>

              <a
                href="#rewards"
                className="hover:text-orange-500"
              >
                Rewards
              </a>

              <a href="#how" className="hover:text-pink-500">
                How It Works
              </a>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={logout}
                  className={`hidden rounded-full px-4 py-2 text-xs font-black md:block ${
                    isHalloween
                      ? "bg-purple-950 text-purple-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  Logout
                </button>
              )}

              <button
                onClick={() =>
                  document
                    .getElementById("mystery")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className={`rounded-full px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 ${
                  isHalloween
                    ? "bg-orange-600 hover:bg-orange-500"
                    : "bg-slate-900 hover:bg-pink-600"
                }`}
              >
                🎁 Mystery Gift
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}

        <section
          className={`relative overflow-hidden px-5 pb-24 pt-20 md:pb-32 md:pt-28 ${
            isHalloween
              ? "bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,.2),transparent_30%),#08060d]"
              : "bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,.12),transparent_30%)]"
          }`}
        >
          {isHalloween && (
            <>
              <div className="pointer-events-none absolute left-5 top-10 text-5xl opacity-70">
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
              className={`mb-6 inline-flex rounded-full border px-5 py-2 text-sm font-black ${
                isHalloween
                  ? "border-orange-500/30 bg-purple-950/50 text-orange-400"
                  : "border-pink-200 bg-white text-pink-600 shadow-sm"
              }`}
            >
              {isHalloween
                ? "🎃 Spooky gifts + mystery surprises"
                : "✨ Smart gifts + mystery surprises"}
            </div>

            <h1
              className={`text-5xl font-black leading-[1.05] tracking-tight md:text-7xl ${
                isHalloween ? "text-white" : ""
              }`}
            >
              Find a gift they&apos;ll
              <span
                className={`block bg-clip-text text-transparent ${
                  isHalloween
                    ? "bg-gradient-to-r from-orange-400 via-purple-500 to-fuchsia-500"
                    : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
                }`}
              >
                actually love. 🎁
              </span>
            </h1>

            <p
              className={`mx-auto mt-7 max-w-2xl text-base leading-7 md:text-xl ${
                isHalloween
                  ? "text-purple-200"
                  : "text-slate-600"
              }`}
            >
              Find thoughtful gifts, discover mystery surprises,
              and invite friends to unlock exclusive rewards.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() =>
                  document
                    .getElementById("finder")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className={`rounded-2xl px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 ${
                  isHalloween
                    ? "bg-gradient-to-r from-orange-600 to-purple-700"
                    : "bg-gradient-to-r from-pink-600 to-purple-600"
                }`}
              >
                Find My Perfect Gift →
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById("mystery")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className={`rounded-2xl border-2 px-8 py-4 font-black transition hover:-translate-y-1 ${
                  isHalloween
                    ? "border-purple-700 bg-purple-950/40 text-white"
                    : "border-purple-200 bg-white text-purple-700"
                }`}
              >
                🎁 Explore Mystery Gifts
              </button>
            </div>

            <div
              className={`mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold ${
                isHalloween
                  ? "text-purple-300"
                  : "text-slate-500"
              }`}
            >
              <span>✓ Personalized matches</span>
              <span>✓ Every budget</span>
              <span>✓ Mystery rewards</span>
              <span>✓ Referral bonuses</span>
            </div>
          </div>
        </section>

        {/* MYSTERY GIFTS */}

        <section
          id="mystery"
          className={`scroll-mt-20 px-5 py-24 ${
            isHalloween ? "bg-[#0b0710]" : "bg-white"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
                  isHalloween
                    ? "bg-purple-950 shadow-xl shadow-purple-950"
                    : "bg-gradient-to-br from-pink-100 to-purple-100"
                }`}
              >
                🎁
              </div>

              <p
                className={`text-sm font-black uppercase tracking-widest ${
                  isHalloween
                    ? "text-orange-400"
                    : "text-pink-600"
                }`}
              >
                Mystery Gifts
              </p>

              <h2
                className={`mt-2 text-4xl font-black md:text-5xl ${
                  isHalloween ? "text-white" : ""
                }`}
              >
                Pick the perfect surprise
              </h2>

              <p
                className={`mt-5 ${
                  isHalloween
                    ? "text-purple-300"
                    : "text-slate-500"
                }`}
              >
                Choose who the mystery gift is for and discover
                surprise options made for them.
              </p>
            </div>

            <div
              className={`mx-auto mt-12 max-w-5xl rounded-3xl border p-6 md:p-8 ${
                isHalloween
                  ? "border-purple-900/50 bg-[#15101d]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="mb-5 text-center">
                <h3
                  className={`text-xl font-black ${
                    isHalloween ? "text-white" : ""
                  }`}
                >
                  Who is this mystery gift for?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {recipients.map((item) => (
                  <button
                    key={item.name}
                    onClick={() =>
                      setMysteryRecipient(item.name)
                    }
                    className={`rounded-2xl border-2 p-4 font-black transition hover:-translate-y-1 ${
                      mysteryRecipient === item.name
                        ? isHalloween
                          ? "border-orange-500 bg-orange-950/30 text-orange-300"
                          : "border-pink-500 bg-pink-50 text-pink-700"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#1b1424] text-white hover:border-orange-500/50"
                        : "border-slate-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="text-3xl">
                      {item.emoji}
                    </div>

                    <div className="mt-2">
                      {item.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {mysteryRecommendations.map((gift, index) => (
                <div
                  key={gift.name}
                  className={`group relative overflow-hidden rounded-3xl border p-7 shadow-xl transition duration-300 hover:-translate-y-2 ${
                    isHalloween
                      ? "border-purple-900/50 bg-gradient-to-br from-[#191024] to-[#0f0a15]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute right-5 top-5 rounded-full bg-purple-600 px-3 py-1 text-xs font-black text-white">
                      POPULAR
                    </div>
                  )}

                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-3xl text-5xl ${
                      isHalloween
                        ? "bg-orange-950/50"
                        : "bg-gradient-to-br from-pink-100 to-purple-100"
                    }`}
                  >
                    {gift.emoji}
                  </div>

                  <h3
                    className={`mt-7 text-2xl font-black ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    {gift.name}
                  </h3>

                  <p
                    className={`mt-3 min-h-[56px] text-sm leading-6 ${
                      isHalloween
                        ? "text-purple-300"
                        : "text-slate-500"
                    }`}
                  >
                    {gift.description}
                  </p>

                  <div className="mt-7 flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase text-slate-400">
                        Mystery value
                      </div>

                      <div
                        className={`mt-1 text-3xl font-black ${
                          isHalloween
                            ? "text-orange-400"
                            : "text-purple-700"
                        }`}
                      >
                        ${gift.price}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        document
                          .getElementById("rewards")
                          ?.scrollIntoView({
                            behavior: "smooth",
                          })
                      }
                      className={`rounded-xl px-5 py-3 font-black text-white transition ${
                        isHalloween
                          ? "bg-orange-600 hover:bg-orange-500"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      Unlock →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REFERRAL REWARDS */}

        <section
          id="rewards"
          className={`scroll-mt-20 px-5 py-24 ${
            isHalloween
              ? "bg-[#08060d]"
              : "bg-gradient-to-b from-slate-50 to-white"
          }`}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-5xl">🎁</div>

              <p
                className={`mt-5 text-sm font-black uppercase tracking-widest ${
                  isHalloween
                    ? "text-orange-400"
                    : "text-purple-600"
                }`}
              >
                Referral Rewards
              </p>

              <h2
                className={`mt-2 text-4xl font-black md:text-5xl ${
                  isHalloween ? "text-white" : ""
                }`}
              >
                Invite friends. Unlock mystery gifts.
              </h2>

              <p
                className={`mt-5 ${
                  isHalloween
                    ? "text-purple-300"
                    : "text-slate-500"
                }`}
              >
                Share your GiftMatch link and unlock bigger mystery
                rewards as your referral count grows.
              </p>
            </div>

            {/* REFERRAL BOX */}

            <div
              className={`mt-12 overflow-hidden rounded-[2rem] border shadow-2xl ${
                isHalloween
                  ? "border-purple-900/50 bg-gradient-to-br from-[#171020] to-[#0d0912]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`p-7 md:p-10 ${
                  isHalloween
                    ? "bg-gradient-to-r from-purple-950/70 to-orange-950/30"
                    : "bg-gradient-to-r from-purple-50 to-pink-50"
                }`}
              >
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div
                      className={`text-sm font-black uppercase tracking-widest ${
                        isHalloween
                          ? "text-orange-400"
                          : "text-purple-600"
                      }`}
                    >
                      {user
                        ? "Your referral code"
                        : "Referral rewards"}
                    </div>

                    <div
                      className={`mt-2 text-4xl font-black tracking-widest ${
                        isHalloween ? "text-white" : ""
                      }`}
                    >
                      {user
                        ? referralId || "------"
                        : "LOGIN"}
                    </div>

                    <p
                      className={`mt-2 text-sm ${
                        isHalloween
                          ? "text-purple-300"
                          : "text-slate-500"
                      }`}
                    >
                      {user
                        ? "Share your personal link with friends."
                        : "Create an account to get your personal referral link."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {user ? (
                      <button
                        onClick={copyReferralLink}
                        className={`rounded-2xl px-7 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 ${
                          copied
                            ? "bg-emerald-600"
                            : isHalloween
                            ? "bg-orange-600 hover:bg-orange-500"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        {copied
                          ? "✓ Link Copied!"
                          : "🔗 Copy Referral Link"}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setAuthMode("signup");
                          setReferralRequired(false);
                          setAuthOpen(true);
                        }}
                        className={`rounded-2xl px-7 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 ${
                          isHalloween
                            ? "bg-orange-600 hover:bg-orange-500"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        🎁 Create Referral Account
                      </button>
                    )}
                  </div>
                </div>

                {user && referralLink && (
                  <div
                    className={`mt-8 rounded-2xl border p-4 text-sm ${
                      isHalloween
                        ? "border-purple-800 bg-black/20 text-purple-200"
                        : "border-purple-100 bg-white text-slate-600"
                    }`}
                  >
                    <span className="font-bold">
                      Your link:
                    </span>{" "}
                    <span className="break-all">
                      {referralLink}
                    </span>
                  </div>
                )}
              </div>

              {/* COUNT */}

              <div className="grid gap-6 p-7 md:grid-cols-3 md:p-10">
                <div
                  className={`rounded-2xl p-6 text-center ${
                    isHalloween
                      ? "bg-purple-950/40"
                      : "bg-purple-50"
                  }`}
                >
                  <div className="text-4xl">👥</div>

                  <div
                    className={`mt-3 text-4xl font-black ${
                      isHalloween
                        ? "text-white"
                        : "text-purple-700"
                    }`}
                  >
                    {user ? referrals : "—"}
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-500">
                    Referrals
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-6 text-center ${
                    isHalloween
                      ? "bg-orange-950/30"
                      : "bg-orange-50"
                  }`}
                >
                  <div className="text-4xl">🎁</div>

                  <div
                    className={`mt-3 text-4xl font-black ${
                      isHalloween
                        ? "text-orange-400"
                        : "text-orange-600"
                    }`}
                  >
                    {user ? claimedRewards.length : "—"}
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-500">
                    Rewards Claimed
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-6 text-center ${
                    isHalloween
                      ? "bg-emerald-950/30"
                      : "bg-emerald-50"
                  }`}
                >
                  <div className="text-4xl">🏆</div>

                  <div
                    className={`mt-3 text-2xl font-black ${
                      isHalloween
                        ? "text-emerald-400"
                        : "text-emerald-700"
                    }`}
                  >
                    {!user
                      ? "LOGIN"
                      : referrals >= 25
                      ? "MAX LEVEL"
                      : `${nextReward.referrals - referrals} left`}
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-500">
                    Until next reward
                  </div>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="px-7 pb-10 md:px-10">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span
                    className={
                      isHalloween
                        ? "text-purple-300"
                        : "text-slate-500"
                    }
                  >
                    Referral progress
                  </span>

                  <span
                    className={
                      isHalloween
                        ? "text-orange-400"
                        : "text-purple-600"
                    }
                  >
                    {!user
                      ? "Create an account"
                      : referrals >= 25
                      ? "25+ referrals"
                      : `${referrals} / ${nextReward.referrals}`}
                  </span>
                </div>

                <div
                  className={`mt-3 h-4 overflow-hidden rounded-full ${
                    isHalloween
                      ? "bg-purple-950"
                      : "bg-slate-100"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 transition-all duration-700"
                    style={{
                      width: `${
                        user
                          ? referrals >= 25
                            ? 100
                            : progress
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* REWARD CARDS */}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {referralRewards.map((reward) => {
                const unlocked =
                  Boolean(user) &&
                  referrals >= reward.referrals;

                const claimed =
                  claimedRewards.includes(
                    reward.referrals
                  );

                return (
                  <div
                    key={reward.referrals}
                    className={`rounded-3xl border p-6 transition ${
                      unlocked
                        ? isHalloween
                          ? "border-orange-500/50 bg-orange-950/20 shadow-xl shadow-orange-950/20"
                          : "border-orange-300 bg-orange-50 shadow-xl"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#15101d]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-4xl">
                        {reward.emoji}
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          claimed
                            ? "bg-emerald-500 text-white"
                            : unlocked
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {claimed
                          ? "CLAIMED"
                          : unlocked
                          ? "UNLOCKED"
                          : "LOCKED"}
                      </div>
                    </div>

                    <div
                      className={`mt-5 text-sm font-black uppercase tracking-widest ${
                        isHalloween
                          ? "text-purple-400"
                          : "text-slate-400"
                      }`}
                    >
                      {reward.referrals} referrals
                    </div>

                    <h3
                      className={`mt-2 text-xl font-black ${
                        isHalloween ? "text-white" : ""
                      }`}
                    >
                      {reward.reward}
                    </h3>

                    <button
                      disabled={
                        Boolean(unlocked && claimed)
                      }
                      onClick={() =>
                        claimReward(reward.referrals)
                      }
                      className={`mt-6 w-full rounded-xl py-3 font-black transition ${
                        claimed
                          ? "cursor-default bg-emerald-100 text-emerald-700"
                          : unlocked
                          ? isHalloween
                            ? "bg-orange-600 text-white hover:bg-orange-500"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                          : user
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {claimed
                        ? "✓ Reward Claimed"
                        : unlocked
                        ? "🎁 Claim Reward"
                        : user
                        ? `🔒 Need ${
                            reward.referrals - referrals
                          } more referrals`
                        : "🔐 Login to Unlock"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINDER */}

        <section
          id="finder"
          className={`scroll-mt-20 px-5 pb-24 ${
            isHalloween ? "bg-[#08060d]" : ""
          }`}
        >
          <div
            className={`mx-auto max-w-6xl overflow-hidden rounded-[2rem] border shadow-2xl ${
              isHalloween
                ? "border-purple-900/50 bg-[#110d1b]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`border-b px-6 py-8 md:px-10 ${
                isHalloween
                  ? "border-purple-900/40 bg-gradient-to-r from-[#1c1029] to-[#241008]"
                  : "border-slate-100 bg-gradient-to-r from-pink-50 to-purple-50"
              }`}
            >
              <p
                className={`text-sm font-bold uppercase tracking-widest ${
                  isHalloween
                    ? "text-orange-400"
                    : "text-pink-600"
                }`}
              >
                {isHalloween
                  ? "🎃 Halloween Gift Finder"
                  : "Gift Finder"}
              </p>

              <h2
                className={`mt-1 text-3xl font-black md:text-4xl ${
                  isHalloween ? "text-white" : ""
                }`}
              >
                {isHalloween
                  ? "Let's find something spooky."
                  : "Let's find the right gift."}
              </h2>

              <p
                className={`mt-3 ${
                  isHalloween
                    ? "text-purple-300"
                    : "text-slate-500"
                }`}
              >
                Choose a person, occasion and budget.
              </p>
            </div>

            <div className="p-6 md:p-10">
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
                        isHalloween
                          ? "mt-1 text-sm text-purple-300"
                          : "mt-1 text-sm text-slate-500"
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
                      className={`group rounded-2xl border-2 p-5 text-left transition ${
                        recipient === item.name
                          ? isHalloween
                            ? "border-orange-500 bg-orange-950/30"
                            : "border-pink-500 bg-pink-50"
                          : isHalloween
                          ? "border-purple-900/50 bg-[#171020] hover:border-orange-500/50"
                          : "border-slate-100 bg-slate-50 hover:border-pink-200 hover:bg-white"
                      }`}
                    >
                      <div className="text-4xl">
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
                        className={`mt-1 hidden text-xs md:block ${
                          isHalloween
                            ? "text-purple-300"
                            : "text-slate-500"
                        }`}
                      >
                        {item.desc}
                      </div>

                      {recipient === item.name && (
                        <div className="mt-3 text-xs font-black text-orange-500">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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
                        isHalloween
                          ? "mt-1 text-sm text-purple-300"
                          : "mt-1 text-sm text-slate-500"
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
                      className={`rounded-2xl border-2 p-5 transition ${
                        occasion === item.name
                          ? isHalloween
                            ? "border-orange-500 bg-orange-950/30"
                            : "border-purple-500 bg-purple-50"
                          : isHalloween
                          ? "border-purple-900/50 bg-[#171020] hover:border-orange-500/50"
                          : "border-slate-100 bg-slate-50 hover:border-purple-200 hover:bg-white"
                      }`}
                    >
                      <div className="text-4xl">
                        {item.emoji}
                      </div>

                      <div
                        className={`mt-3 font-black ${
                          isHalloween ? "text-white" : ""
                        }`}
                      >
                        {item.name}
                      </div>

                      {occasion === item.name && (
                        <div className="mt-2 text-xs font-black text-orange-500">
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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
                        isHalloween
                          ? "mt-1 text-sm text-purple-300"
                          : "mt-1 text-sm text-slate-500"
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
                      className={`rounded-2xl border-2 px-4 py-5 font-black transition ${
                        budget === item.label
                          ? isHalloween
                            ? "border-emerald-500 bg-emerald-950/30 text-emerald-400"
                            : "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : isHalloween
                          ? "border-purple-900/50 bg-[#171020] text-white hover:border-emerald-500/50"
                          : "border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-white"
                      }`}
                    >
                      💵 {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={findGifts}
                disabled={
                  !recipient || !occasion || !budget
                }
                className={`w-full rounded-2xl py-5 text-base font-black text-white shadow-xl transition md:text-lg ${
                  recipient && occasion && budget
                    ? isHalloween
                      ? "bg-gradient-to-r from-orange-600 via-purple-600 to-fuchsia-700 hover:-translate-y-1"
                      : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:-translate-y-1"
                    : "cursor-not-allowed bg-slate-700 text-slate-500 shadow-none"
                }`}
              >
                {isHalloween
                  ? "🎃 Find My Spooky Gifts"
                  : "✨ Find My Perfect Gifts"}
              </button>

              {(!recipient ||
                !occasion ||
                !budget) && (
                <p
                  className={`mt-4 text-center text-xs ${
                    isHalloween
                      ? "text-purple-400"
                      : "text-slate-400"
                  }`}
                >
                  Select all 3 options above to see your
                  recommendations.
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
                <div className="text-5xl">
                  {isHalloween ? "🎃" : "🎁"}
                </div>

                <p
                  className={`mt-5 text-sm font-black uppercase tracking-widest ${
                    isHalloween
                      ? "text-orange-400"
                      : "text-pink-600"
                  }`}
                >
                  Your matches
                </p>

                <h2
                  className={`mt-2 text-4xl font-black md:text-5xl ${
                    isHalloween ? "text-white" : ""
                  }`}
                >
                  Gifts picked for you
                </h2>

                <p
                  className={`mt-5 ${
                    isHalloween
                      ? "text-purple-300"
                      : "text-slate-500"
                  }`}
                >
                  For <strong>{recipient}</strong> ·{" "}
                  {occasion} · {budget}
                </p>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((gift) => (
                    <div
                      key={gift.name}
                      className={`group overflow-hidden rounded-3xl border shadow-lg transition hover:-translate-y-2 hover:shadow-2xl ${
                        isHalloween
                          ? "border-purple-900/50 bg-[#15101d]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="relative h-64 overflow-hidden bg-slate-100">
                        <img
                          src={gift.image}
                          alt={gift.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        <div
                          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black ${
                             isHalloween
                              ? "bg-orange-500 text-white"
                              : "bg-white text-pink-600"
                          }`}
                        >
                          { isHalloween
                            ? "🎃 Spooky Pick"
                            : "⭐ Great Match"}
                        </div>

                        <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-3 py-2 text-lg font-black text-white">
                          ${gift.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="p-6">
                       

                        <h3
                          className={`mt-4 text-xl font-black ${
                            isHalloween ? "text-white" : ""
                          }`}
                        >
                          {gift.name}
                        </h3>

                        <p
                          className={`mt-2 min-h-[72px] text-sm leading-6 ${
                            isHalloween
                              ? "text-purple-300"
                              : "text-slate-500"
                          }`}
                        >
                          {gift.description}
                        </p>

                        <button
  onClick={() => {
    window.open(gift.url, "_blank");
  }}
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
                <div className="mx-auto max-w-xl rounded-3xl border p-10 text-center">
                  <div className="text-6xl">🎁</div>

                  <h3 className="mt-5 text-2xl font-black">
                    No exact matches yet
                  </h3>

                  <p className="mt-3 text-slate-500">
                    Try another budget or occasion.
                  </p>
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
                  isHalloween
                    ? "text-orange-400"
                    : "text-pink-600"
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
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  emoji: "👤",
                  title: "Choose who",
                  text: "Tell us who you're shopping for.",
                },
                {
                  emoji: "💵",
                  title: "Set your budget",
                  text: "Choose a price range that works for you.",
                },
                {
                  emoji: "🎁",
                  title: "Discover gifts",
                  text: "Get personalized gift recommendations.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-3xl border p-8 shadow-lg ${
                    isHalloween
                      ? "border-purple-900/50 bg-[#15101d]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-4xl">
                    {item.emoji}
                  </div>

                  <h3
                    className={`mt-6 text-2xl font-black ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-3 leading-7 ${
                      isHalloween
                        ? "text-purple-300"
                        : "text-slate-500"
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
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
                <div className="text-2xl font-black">
                  {isHalloween ? "🎃" : "🎁"} Gift
                  <span
                    className={
                      isHalloween
                        ? "text-orange-500"
                        : "text-pink-500"
                    }
                  >
                    Match
                  </span>
                </div>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Helping you find thoughtful gifts and exciting
                  mystery surprises.
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
                    href="#mystery"
                    className="mt-2 block hover:text-pink-400"
                  >
                    Mystery Gifts
                  </a>

                  <a
                    href="#rewards"
                    className="mt-2 block hover:text-pink-400"
                  >
                    Rewards
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
              © 2026 GiftMatch. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}