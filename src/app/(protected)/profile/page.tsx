"use client";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import LogoutConfirmationModal from "@/components/profile/LogoutConfirmationModal";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "framer-motion";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type Profile = {
  name: string | null;
  dob: string | null;
  gender: "male" | "female" | "other" | null;
  mobile: string | null;
};

const toDateInputValue = (date: string | null) => date?.slice(0, 10) ?? "";

const MotionButton = motion.create(Button);

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Profile["gender"]>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [draftFullName, setDraftFullName] = useState(fullName);
  const [draftDob, setDraftDob] = useState(dob);
  const [draftGender, setDraftGender] =
    useState<NonNullable<Profile["gender"]>>("other");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = (await response.json()) as {
          success: boolean;
          user?: Profile;
        };

        if (!response.ok || !data.success || !data.user) return;

        setFullName(data.user.name ?? "");
        setDob(toDateInputValue(data.user.dob));
        setGender(data.user.gender);
      } catch {
        // Keep the profile editable if the initial fetch is unavailable.
      }
    };

    void loadProfile();
  }, []);

  const openEditProfile = () => {
    setDraftFullName(fullName);
    setDraftDob(dob);
    setDraftGender(gender ?? "other");
    setSaveError("");
    setShowEditProfile(true);
  };

  const saveProfileChanges = async () => {
    setSaveError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draftFullName,
          dob: draftDob,
          gender: draftGender,
        }),
      });
      const data = (await response.json()) as {
        success: boolean;
        error?: string;
        user?: Profile;
      };

      if (!response.ok || !data.success || !data.user) {
        setSaveError(data.error ?? "Failed to update profile.");
        return;
      }

      setFullName(data.user.name ?? "");
      setDob(toDateInputValue(data.user.dob));
      setGender(data.user.gender);
      setShowEditProfile(false);
    } catch {
      setSaveError("Unable to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      await signOut({ redirectTo: "/login" });
    } catch {
      setLogoutError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const reports = [
    { date: "15 Dec 2026", id: "#NM-8821" },
    { date: "22 Jan 2026", id: "#NM-7402" },
  ];

  const quickActions = [
    { icon: "help_center", label: "Support" },
    { icon: "privacy_tip", label: "Privacy Policy" },
    { icon: "gavel", label: "Terms & Conditions" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0A0A] text-on-surface antialiased pb-24">
      {/* Background Ambient Glow */}
      <div className="fixed top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top App Bar */}
      <Header />

      <main className="mt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-stack-gap-lg"
        >
        {!showEditProfile && (
          <motion.section variants={fadeUp} className="glass-card rounded-xl p-6 relative overflow-hidden">
            <button
              type="button"
              onClick={openEditProfile}
              aria-label="Edit profile"
              className="absolute top-4 right-4 cursor-pointer text-primary opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
            >
              <span className="material-symbols-outlined">edit_note</span>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1">
                  <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-primary text-[40px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  </div>
                </div>
                <div
                  className="absolute bottom-0 right-0 bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                  style={{ boxShadow: "0 0 15px rgba(212,175,55,0.2)" }}
                >
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  Verified
                </div>
              </div>
              <h2 className="font-headline text-headline-md font-semibold text-primary mb-1">
                {fullName || "Your Profile"}
              </h2>
              <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
                <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-lg flex-1 min-w-[100px]">
                  <span className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant mb-1">
                    Gender
                  </span>
                  <span className="font-numeral text-[16px] tracking-normal">
                    {gender
                      ? `${gender[0].toUpperCase()}${gender.slice(1)}`
                      : "—"}
                  </span>
                </div>
                <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-lg flex-1 min-w-[100px]">
                  <span className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant mb-1">
                    DOB
                  </span>
                  <span className="font-numeral text-[16px] tracking-normal">
                    {dob || "—"}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {showEditProfile && (
          <motion.section variants={fadeUp} className="space-y-stack-gap-md">
            <h3 className="font-headline text-headline-sm font-semibold text-on-surface-variant px-1">
              Edit Profile
            </h3>
            <div className="glass-card rounded-xl p-6 space-y-stack-gap-md">
              <div className="space-y-1">
                <label className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={draftFullName}
                  onChange={(e) => setDraftFullName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 font-body text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant block">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={draftDob}
                    onChange={(e) => setDraftDob(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 font-body text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-body text-[12px] font-bold leading-4 tracking-[0.05em] uppercase text-on-surface-variant block">
                    Gender
                  </label>
                  <select
                    value={draftGender}
                    onChange={(e) =>
                      setDraftGender(
                        e.target.value as NonNullable<Profile["gender"]>,
                      )
                    }
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 font-body text-body-lg text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {saveError && <p className="text-sm text-error">{saveError}</p>}
              <div className="grid grid-cols-2 gap-3">
                <MotionButton
                  type="button"
                  onClick={() => {
                    setSaveError("");
                    setShowEditProfile(false);
                  }}
                  variant={"outline"}
                  className="h-12 cursor-pointer"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </MotionButton>
                <MotionButton
                  type="button"
                  onClick={saveProfileChanges}
                  className="h-12 cursor-pointer"
                  variant={"default"}
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="material-symbols-outlined">save</span>
                  {isSaving ? "Saving..." : "Save"}
                </MotionButton>
              </div>
            </div>
          </motion.section>
        )}

        {/* Quick Actions */}
        <motion.section variants={fadeUp} className="glass-card rounded-xl divide-y divide-white/5 overflow-hidden">
          {quickActions.map((action) => (
            <motion.div
              key={action.label}
              whileHover={{ x: 4 }}
              className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {action.icon}
                </span>
                <span className="font-body text-body-lg">{action.label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                arrow_forward_ios
              </span>
            </motion.div>
          ))}
        </motion.section>

        {/* Logout */}
        <motion.section variants={fadeUp} className="pt-stack-gap-sm pb-8">
          <MotionButton
            type="button"
            onClick={() => {
              setLogoutError("");
              setShowLogoutModal(true);
            }}
            variant="destructive"
            className="glass-card h-auto w-full cursor-pointer rounded-xl border border-error/20 p-4 font-headline text-headline-sm font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </MotionButton>
        </motion.section>
        </motion.div>
      </main>

      <LogoutConfirmationModal
        open={showLogoutModal}
        isLoggingOut={isLoggingOut}
        error={logoutError}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <MobileNav active="profile" />
    </div>
  );
}
