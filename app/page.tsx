"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Gift = {
  name: string;
  image_url: string;
  price: number;
  description: string;
  affiliate_url: string;
  interests?: string[];
  age_range?: string;
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

const interestOptions = [
  { name: "Cooking", emoji: "🍳" },
  { name: "Gaming", emoji: "🎮" },
  { name: "Fitness", emoji: "🏋️" },
  { name: "Tech", emoji: "💻" },
  { name: "Fashion", emoji: "👗" },
  { name: "Books", emoji: "📚" },
  { name: "Travel", emoji: "✈️" },
  { name: "Music", emoji: "🎵" },
  { name: "Art & Craft", emoji: "🎨" },
  { name: "Outdoors", emoji: "🏕️" },
];

const ageRanges = [
  { label: "Kids (0-12)", value: "kids", emoji: "🧒" },
  { label: "Teen (13-17)", value: "teen", emoji: "🧑" },
  { label: "18-25", value: "18-25", emoji: "🎓" },
  { label: "26-40", value: "26-40", emoji: "💼" },
  { label: "41-60", value: "41-60", emoji: "🧑‍💼" },
  { label: "60+", value: "60+", emoji: "🌿" },
];

// Recipients that are inherently adults; kids/teen age ranges never
// apply to them so we hide those two options when one of these is picked.
const ADULT_ONLY_RECIPIENTS = ["Mom", "Dad", "Partner"];

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
  { referrals: 5, reward: "$5 Mystery Gift", emoji: "🎁" },
  { referrals: 10, reward: "$10 Mystery Gift", emoji: "🎀" },
  { referrals: 25, reward: "$25 Premium Mystery Gift", emoji: "👑" },
];

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    async function loadGifts() {
      const { data, error } = await supabase
        .from("products")
        .select(
          "name, description, price, image_url, affiliate_url, interests, age_range"
        );

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

  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [mysteryRecipient, setMysteryRecipient] = useState("Friend");

  const [referrals, setReferrals] = useState(0);
  const [copied, setCopied] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
  const [referralId, setReferralId] = useState("");

  const [user, setUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">(
    "signup"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [referralRequired, setReferralRequired] = useState(false);

  // Terms & Privacy Policy acceptance — required before creating an account.
  const [termsAccepted, setTermsAccepted] = useState(false);

  const selectedBudget = budgets.find((b) => b.label === budget);
  const isHalloween = occasion === "Halloween";

  // Age ranges available for the currently selected recipient. Mom /
  // Dad / Partner never need "Kids" or "Teen", so those two are dropped for
  // them; every other recipient (Friend, Coworker, or nobody picked yet)
  // still sees the full list.
  const availableAgeRanges = useMemo(() => {
    if (ADULT_ONLY_RECIPIENTS.includes(recipient)) {
      return ageRanges.filter(
        (item) => item.value !== "kids" && item.value !== "teen"
      );
    }

    return ageRanges;
  }, [recipient]);

  function toggleInterest(name: string) {
    setSelectedInterests((current) =>
      current.includes(name)
        ? current.filter((i) => i !== name)
        : [...current, name]
    );
    setShowResults(false);
  }

  // When the recipient changes, drop a previously selected age range
  // if it's no longer valid for that recipient (e.g. "Kids" was selected,
  // then the user switches to "Partner").
  function selectRecipient(name: string) {
    setRecipient(name);
    setShowResults(false);

    const stillValid = ADULT_ONLY_RECIPIENTS.includes(name)
      ? ageRange !== "kids" && ageRange !== "teen"
      : true;

    if (!stillValid) {
      setAgeRange("");
    }
  }

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

      const { data: count, error: countError } = await supabase.rpc(
        "get_my_referral_count"
      );

      if (!countError && typeof count === "number") {
        setReferrals(count);
      }

      const { data: claims, error: claimsError } = await supabase.rpc(
        "get_my_claimed_rewards"
      );

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

        localStorage.setItem("giftmatch_pending_referral", cleanRef);

        setReferralRequired(true);
        setAuthMode("signup");
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
            localStorage.removeItem("giftmatch_pending_referral");
          }
        }

        await loadUserData(session.user);

        if (cleanRef) {
          setReferralRequired(false);
        }
      }

      if (mounted) {
        setCheckingSession(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);

        const pendingReferral = localStorage.getItem(
          "giftmatch_pending_referral"
        );

        if (pendingReferral) {
          const { error: referralError } = await supabase.rpc(
            "register_referral",
            {
              ref_code: pendingReferral,
            }
          );

          if (!referralError) {
            localStorage.removeItem("giftmatch_pending_referral");
          }
        }

        await loadUserData(session.user);

        setReferralRequired(false);
      } else {
        setUser(null);
        setReferralId("");
        setReferrals(0);
        setClaimedRewards([]);
      }

      setCheckingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const recommendations = useMemo(() => {
    if (!recipient || !occasion || !selectedBudget) {
      return [];
    }

    const withinBudget = gifts.filter(
      (gift) => gift.price >= selectedBudget.min && gift.price <= selectedBudget.max
    );

    const scored = withinBudget.map((gift) => {
      let score = 0;

      const giftInterests = gift.interests || [];
      const matchedInterests = selectedInterests.filter((i) =>
        giftInterests.some((gi) => gi.toLowerCase() === i.toLowerCase())
      );

      score += matchedInterests.length * 3;

      const giftAge = (gift.age_range || "all").toLowerCase();

      if (ageRange && (giftAge === ageRange.toLowerCase() || giftAge === "all")) {
        score += 2;
      }

      return { gift, score };
    });

    const hasPreferences = selectedInterests.length > 0 || Boolean(ageRange);

    if (!hasPreferences) {
      return scored.map((s) => s.gift);
    }

    return scored
      .sort((a, b) => b.score - a.score || a.gift.price - b.gift.price)
      .map((s) => s.gift);
  }, [gifts, recipient, occasion, selectedBudget, selectedInterests, ageRange]);

  const mysteryRecommendations = useMemo(() => {
    return mysteryGifts.filter((gift) =>
      gift.recipients.includes(mysteryRecipient)
    );
  }, [mysteryRecipient]);

  const referralLink = referralId
    ? `https://giftmatch-taupe.vercel.app/?ref=${referralId}`
    : "";

  const nextReward =
    referralRewards.find((reward) => referrals < reward.referrals) ||
    referralRewards[referralRewards.length - 1];

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
    if (!referralLink) return;

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

    if (authMode === "signup" && !termsAccepted) {
      setAuthMessage(
        "Please accept the Privacy Policy and Terms of Service to continue."
      );
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthMessage(error.message);
      }
    }

    setAuthLoading(false);
  }

  // Sends a password-reset email via Supabase. The link Supabase
  // sends takes the user to redirectTo with a recovery token in the URL;
  // wire that route up to show a "set new password" form using
  // supabase.auth.updateUser({ password }).
  async function handleForgotPassword() {
    if (!email) {
      setAuthMessage("Enter your email address first.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage("Check your email for a password reset link.");
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
    if (!user) return;

    if (referrals < target || claimedRewards.includes(target)) {
      return;
    }

    const { data, error } = await supabase.rpc("claim_referral_reward", {
      target_referrals: target,
    });

    if (error || data !== true) {
      return;
    }

    setClaimedRewards((current) =>
      current.includes(target) ? current : [...current, target]
    );
  }

  /* ------------------------------------------------------------------ */
  /* GATE: while we check for an existing session, show a quiet loader   */
  /* ------------------------------------------------------------------ */
  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0d0a14]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-2xl shadow-xl">
            🎁
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------ */
  /* GATE: no user yet → the login/signup page is the entire experience  */
  /* ------------------------------------------------------------------ */
  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0d0a14] text-slate-100">
        {/* decorative background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(236,72,153,.18),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(124,58,237,.22),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(249,115,22,.12),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-5 py-16 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Left: brand panel */}
          <div className="flex max-w-md flex-1 flex-col justify-center text-center lg:text-left">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-3xl shadow-xl lg:mx-0">
              🎁
            </div>

            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Gift
              <span className="text-pink-500">Match</span>
            </h1>

            <p className="mt-5 text-base leading-7 text-purple-200 md:text-lg">
              Find thoughtful gifts, unlock mystery surprises, and earn
              rewards for every friend you invite. Sign in to get started.
            </p>

            <div className="mt-8 hidden flex-col gap-3 text-sm font-bold text-purple-300 lg:flex">
              <span>✓ Personalized gift matches</span>
              <span>✓ Exclusive mystery gifts</span>
              <span>✓ Referral rewards for every invite</span>
            </div>
          </div>

          {/* Right: auth card */}
          <div className="w-full max-w-md flex-1">
            <div className="rounded-3xl border border-purple-900/50 bg-[#15101d]/90 p-7 shadow-2xl backdrop-blur md:p-9">
              <div className="text-center">
                <h2 className="text-2xl font-black text-white md:text-3xl">
                  {authMode === "signup"
                    ? "Create your account"
                    : authMode === "forgot"
                    ? "Reset your password"
                    : "Welcome back"}
                </h2>

                <p className="mt-2 text-sm text-purple-300">
                  {authMode === "forgot"
                    ? "Enter your email and we'll send you a reset link."
                    : referralRequired
                    ? "Sign up to activate your referral reward."
                    : authMode === "signup"
                    ? "Sign up to start finding perfect gifts."
                    : "Login to continue to GiftMatch."}
                </p>
              </div>

              <div className="mt-7 space-y-4">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-purple-900/60 bg-[#0f0b17] px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-pink-500"
                />

                {authMode !== "forgot" && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-purple-900/60 bg-[#0f0b17] px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-pink-500"
                  />
                )}

                {authMode === "login" && (
                  <div className="text-right">
                    <button
                      onClick={() => {
                        setAuthMode("forgot");
                        setAuthMessage("");
                      }}
                      className="text-sm font-bold text-pink-400 hover:text-pink-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Privacy Policy & Terms acceptance — required for signup */}
                {authMode === "signup" && (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-900/60 bg-[#0f0b17] p-4 text-sm leading-5 text-purple-200">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-pink-600"
                    />
                    <span>
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-pink-400 underline hover:text-pink-300"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-pink-400 underline hover:text-pink-300"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                )}

                {authMessage && (
                  <div className="rounded-xl bg-purple-950/50 p-3 text-sm text-purple-200">
                    {authMessage}
                  </div>
                )}

                <button
                  onClick={
                    authMode === "forgot" ? handleForgotPassword : handleAuth
                  }
                  disabled={
                    authLoading || (authMode === "signup" && !termsAccepted)
                  }
                  className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 py-4 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {authLoading
                    ? "Please wait..."
                    : authMode === "signup"
                    ? "Create Account"
                    : authMode === "forgot"
                    ? "Send Reset Link"
                    : "Login"}
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-purple-300">
                {authMode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthMessage("");
                      }}
                      className="font-black text-pink-400"
                    >
                      Login
                    </button>
                  </>
                ) : authMode === "forgot" ? (
                  <>
                    Remembered it after all?{" "}
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthMessage("");
                      }}
                      className="font-black text-pink-400"
                    >
                      Back to login
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
                      className="font-black text-pink-400"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Logged in → the full GiftMatch experience                           */
  /* ------------------------------------------------------------------ */
  return (
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
                  isHalloween ? "text-orange-500" : "text-pink-600"
                }
              >
                Match
              </span>
            </div>
          </button>

          <div
            className={`hidden items-center gap-7 text-sm font-bold md:flex ${
              isHalloween ? "text-purple-200" : "text-slate-600"
            }`}
          >
            <a href="#finder" className="hover:text-pink-500">
              Gift Finder
            </a>

            <a href="#mystery" className="hover:text-purple-500">
              Mystery Gifts
            </a>

            <a href="#rewards" className="hover:text-orange-500">
              Rewards
            </a>

            <a href="#how" className="hover:text-pink-500">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-2">
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

            <button
              onClick={() =>
                document.getElementById("mystery")?.scrollIntoView({
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
            Find a gift they'll
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
              isHalloween ? "text-purple-200" : "text-slate-600"
            }`}
          >
            Find thoughtful gifts, discover mystery surprises, and invite
            friends to unlock exclusive rewards.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() =>
                document.getElementById("finder")?.scrollIntoView({
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
                document.getElementById("mystery")?.scrollIntoView({
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
              isHalloween ? "text-purple-300" : "text-slate-500"
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
                isHalloween ? "text-orange-400" : "text-pink-600"
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
                isHalloween ? "text-purple-300" : "text-slate-500"
              }`}
            >
              Choose who the mystery gift is for and discover surprise options
              made for them.
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
                  onClick={() => setMysteryRecipient(item.name)}
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
                  <div className="text-3xl">{item.emoji}</div>

                  <div className="mt-2">{item.name}</div>
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
                    isHalloween ? "text-purple-300" : "text-slate-500"
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
                        isHalloween ? "text-orange-400" : "text-purple-700"
                      }`}
                    >
                      ${gift.price}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      document.getElementById("rewards")?.scrollIntoView({
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
                isHalloween ? "text-orange-400" : "text-purple-600"
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
                isHalloween ? "text-purple-300" : "text-slate-500"
              }`}
            >
              Share your GiftMatch link and unlock bigger mystery rewards as
              your referral count grows.
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
                      isHalloween ? "text-orange-400" : "text-purple-600"
                    }`}
                  >
                    Your referral code
                  </div>

                  <div
                    className={`mt-2 text-4xl font-black tracking-widest ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    {referralId || "------"}
                  </div>

                  <p
                    className={`mt-2 text-sm ${
                      isHalloween ? "text-purple-300" : "text-slate-500"
                    }`}
                  >
                    Share your personal link with friends.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
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
                    {copied ? "✓ Link Copied!" : "🔗 Copy Referral Link"}
                  </button>
                </div>
              </div>

              {referralLink && (
                <div
                  className={`mt-8 rounded-2xl border p-4 text-sm ${
                    isHalloween
                      ? "border-purple-800 bg-black/20 text-purple-200"
                      : "border-purple-100 bg-white text-slate-600"
                  }`}
                >
                  <span className="font-bold">Your link:</span>{" "}
                  <span className="break-all">{referralLink}</span>
                </div>
              )}
            </div>

            {/* COUNT */}
            <div className="grid gap-6 p-7 md:grid-cols-3 md:p-10">
              <div
                className={`rounded-2xl p-6 text-center ${
                  isHalloween ? "bg-purple-950/40" : "bg-purple-50"
                }`}
              >
                <div className="text-4xl">👥</div>

                <div
                  className={`mt-3 text-4xl font-black ${
                    isHalloween ? "text-white" : "text-purple-700"
                  }`}
                >
                  {referrals}
                </div>

                <div
                  className={`mt-1 text-sm font-bold ${
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }`}
                >
                  Referrals
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 text-center ${
                  isHalloween ? "bg-orange-950/30" : "bg-orange-50"
                }`}
              >
                <div className="text-4xl">🎁</div>

                <div
                  className={`mt-3 text-4xl font-black ${
                    isHalloween ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {claimedRewards.length}
                </div>

                <div
                  className={`mt-1 text-sm font-bold ${
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }`}
                >
                  Rewards Claimed
                </div>
              </div>

              <div
                className={`rounded-2xl p-6 text-center ${
                  isHalloween ? "bg-emerald-950/30" : "bg-emerald-50"
                }`}
              >
                <div className="text-4xl">🏆</div>

                <div
                  className={`mt-3 text-2xl font-black ${
                    isHalloween ? "text-emerald-400" : "text-emerald-700"
                  }`}
                >
                  {referrals >= 25 ? "MAX LEVEL" : `${nextReward.referrals - referrals} left`}
                </div>

                <div
                  className={`mt-1 text-sm font-bold ${
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }`}
                >
                  Until next reward
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="px-7 pb-10 md:px-10">
              <div className="flex items-center justify-between text-sm font-bold">
                <span
                  className={
                    isHalloween ? "text-purple-300" : "text-slate-500"
                  }
                >
                  Referral progress
                </span>

                <span
                  className={
                    isHalloween ? "text-orange-400" : "text-purple-600"
                  }
                >
                  {referrals >= 25
                    ? "25+ referrals"
                    : `${referrals} / ${nextReward.referrals}`}
                </span>
              </div>

              <div
                className={`mt-3 h-4 overflow-hidden rounded-full ${
                  isHalloween ? "bg-purple-950" : "bg-slate-100"
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-orange-500 transition-all duration-700"
                  style={{
                    width: `${referrals >= 25 ? 100 : progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* REWARD CARDS */}
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {referralRewards.map((reward) => {
              const unlocked = referrals >= reward.referrals;

              const claimed = claimedRewards.includes(reward.referrals);

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
                    <div className="text-4xl">{reward.emoji}</div>

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
                      isHalloween ? "text-purple-400" : "text-slate-400"
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
                    disabled={Boolean(unlocked && claimed)}
                    onClick={() => claimReward(reward.referrals)}
                    className={`mt-6 w-full rounded-xl py-3 font-black transition ${
                      claimed
                        ? "cursor-default bg-emerald-100 text-emerald-700"
                        : unlocked
                        ? isHalloween
                          ? "bg-orange-600 text-white hover:bg-orange-500"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                    }`}
                  >
                    {claimed
                      ? "✓ Reward Claimed"
                      : unlocked
                      ? "🎁 Claim Reward"
                      : `🔒 Need ${reward.referrals - referrals} more referrals`}
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
                isHalloween ? "text-orange-400" : "text-pink-600"
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
                isHalloween ? "text-purple-300" : "text-slate-500"
              }`}
            >
              Choose a person, occasion and budget — and tell us their
              interests for even better matches.
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
                    onClick={() => selectRecipient(item.name)}
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
                    <div className="text-4xl">{item.emoji}</div>

                    <div
                      className={`mt-3 font-black ${
                        isHalloween ? "text-white" : ""
                      }`}
                    >
                      {item.name}
                    </div>

                    <div
                      className={`mt-1 hidden text-xs md:block ${
                        isHalloween ? "text-purple-300" : "text-slate-500"
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
                    What's the occasion?
                  </h2>

                  <p
                    className={
                      isHalloween
                        ? "mt-1 text-sm text-purple-300"
                        : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Pick the moment you're celebrating.
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
                    <div className="text-4xl">{item.emoji}</div>

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

            {/* Interests (optional multi-select) */}
            <div className="mb-12">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 font-black text-pink-400">
                  3
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    What are they into?{" "}
                    <span className="text-sm font-bold text-slate-400">
                      (optional)
                    </span>
                  </h2>

                  <p
                    className={
                      isHalloween
                        ? "mt-1 text-sm text-purple-300"
                        : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Pick as many interests as apply — this sharpens your
                    matches.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {interestOptions.map((item) => {
                  const active = selectedInterests.includes(item.name);

                  return (
                    <button
                      key={item.name}
                      onClick={() => toggleInterest(item.name)}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-black transition ${
                        active
                          ? isHalloween
                            ? "border-pink-500 bg-pink-950/30 text-pink-300"
                            : "border-pink-500 bg-pink-50 text-pink-700"
                          : isHalloween
                          ? "border-purple-900/50 bg-[#171020] text-white hover:border-pink-500/50"
                          : "border-slate-200 bg-slate-50 hover:border-pink-200 hover:bg-white"
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                      {active && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age range (optional single-select) — options depend on recipient */}
            <div className="mb-12">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-black text-indigo-400">
                  4
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    What's their age range?{" "}
                    <span className="text-sm font-bold text-slate-400">
                      (optional)
                    </span>
                  </h2>

                  <p
                    className={
                      isHalloween
                        ? "mt-1 text-sm text-purple-300"
                        : "mt-1 text-sm text-slate-500"
                    }
                  >
                    Helps us surface age-appropriate gifts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                {availableAgeRanges.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setAgeRange((current) =>
                        current === item.value ? "" : item.value
                      );
                      setShowResults(false);
                    }}
                    className={`rounded-2xl border-2 p-4 text-center font-black transition ${
                      ageRange === item.value
                        ? isHalloween
                          ? "border-indigo-400 bg-indigo-950/30 text-indigo-300"
                          : "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : isHalloween
                        ? "border-purple-900/50 bg-[#171020] text-white hover:border-indigo-400/50"
                        : "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white"
                    }`}
                  >
                    <div className="text-2xl">{item.emoji}</div>
                    <div className="mt-1 text-xs">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 font-black text-emerald-400">
                  5
                </div>

                <div>
                  <h2
                    className={`text-xl font-black md:text-2xl ${
                      isHalloween ? "text-white" : ""
                    }`}
                  >
                    What's your budget?
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
              disabled={!recipient || !occasion || !budget}
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

            {(!recipient || !occasion || !budget) && (
              <p
                className={`mt-4 text-center text-xs ${
                  isHalloween ? "text-purple-400" : "text-slate-400"
                }`}
              >
                Select recipient, occasion and budget to see your
                recommendations. Interests and age range are optional but
                make matches sharper.
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
              <div className="text-5xl">{isHalloween ? "🎃" : "🎁"}</div>

              <p
                className={`mt-5 text-sm font-black uppercase tracking-widest ${
                  isHalloween ? "text-orange-400" : "text-pink-600"
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
                  isHalloween ? "text-purple-300" : "text-slate-500"
                }`}
              >
                For <strong>{recipient}</strong> · {occasion} · {budget}
                {selectedInterests.length > 0 &&
                  ` · ${selectedInterests.join(", ")}`}
                {ageRange &&
                  ` · ${
                    ageRanges.find((a) => a.value === ageRange)?.label
                  }`}
              </p>
            </div>

            {productsLoading ? (
              <div className="text-center py-10 font-bold text-slate-400">
                Loading gifts from Supabase...
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((gift) => {
                  const giftInterests = gift.interests || [];
                  const matchedInterests = selectedInterests.filter((i) =>
                    giftInterests.some(
                      (gi) => gi.toLowerCase() === i.toLowerCase()
                    )
                  );

                  return (
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
                          src={gift.image_url}
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
                          {isHalloween
                            ? "🎃 Spooky Pick"
                            : matchedInterests.length > 0
                            ? "🎯 Perfect Match"
                            : "⭐ Great Match"}
                        </div>

                        <div className="absolute bottom-4 right-4 rounded-xl bg-slate-950/90 px-3 py-2 text-lg font-black text-white">
                          ${gift.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3
                          className={`text-xl font-black ${
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

                        {matchedInterests.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {matchedInterests.map((interest) => (
                              <span
                                key={interest}
                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                  isHalloween
                                    ? "bg-pink-950/50 text-pink-300"
                                    : "bg-pink-50 text-pink-600"
                                }`}
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            window.open(gift.affiliate_url, "_blank")
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
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-3xl border p-10 text-center">
                <div className="text-6xl">🎁</div>

                <h3 className="mt-5 text-2xl font-black">
                  No exact matches yet
                </h3>

                <p className="mt-3 text-slate-500">
                  Try another budget, occasion, or fewer interests.
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
                <div className="text-4xl">{item.emoji}</div>

                <h3
                  className={`mt-6 text-2xl font-black ${
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
                    isHalloween ? "text-orange-500" : "text-pink-500"
                  }
                >
                  Match
                </span>
              </div>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Helping you find thoughtful gifts and exciting mystery
                surprises.
              </p>
            </div>

            <div className="flex gap-10 text-sm text-slate-400">
              <div>
                <div className="mb-3 font-bold text-white">Explore</div>

                <a href="#finder" className="block hover:text-pink-400">
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

              <div>
                <div className="mb-3 font-bold text-white">Legal</div>

                <a href="/privacy" className="block hover:text-pink-400">
                  Privacy Policy
                </a>

                <a href="/terms" className="mt-2 block hover:text-pink-400">
                  Terms of Service
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
  );
}
