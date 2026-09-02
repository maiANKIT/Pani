import React from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Image as ImageIcon,
  UserPlus,
  ShieldCheck,
  Camera,
  CheckCheck,
  LayoutGrid,
  Scale,
  Users,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Gauge from "../components/Gauge.jsx";
import { PrimaryButton, GhostButton } from "../components/Buttons.jsx";

function FeatureCard({ icon: Icon, title, body, dark }) {
  return (
    <div className={`rounded-2xl ${dark ? "bg-ink-900 text-paper-50" : "bg-white border border-ink-900/10"} p-6`}>
      <div className={`w-10 h-10 rounded-xl ${dark ? "bg-paper-50/10" : "bg-moss-100"} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${dark ? "text-moss-300" : "text-moss-700"}`} />
      </div>
      <h3 className="font-display font-semibold mb-1.5">{title}</h3>
      <p className={`text-sm leading-relaxed ${dark ? "text-paper-200/70" : "text-ink-900/60"}`}>{body}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper-50">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl bg-ink-900 text-paper-50 p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-moss-600/20 blur-3xl" />
            <span className="inline-flex items-center gap-2 rounded-full bg-paper-50/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-moss-300 mb-6">
              <Droplet className="w-3.5 h-3.5" /> Built for one bottle, one room
            </span>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] font-semibold mb-5">
              One bottle. Fair turns. No more "I already went twice."
            </h1>
            <p className="text-paper-200/80 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
              Aquora keeps score on your room's shared water bottle. Fill it, snap a live photo, a roommate
              confirms it — so everyone's turns are actually counted, and nobody carries the whole load.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <PrimaryButton className="bg-moss-600 hover:bg-moss-700">Set up your room</PrimaryButton>
              </Link>
              <Link to="/login">
                <GhostButton className="border-paper-50/25 text-paper-50 hover:bg-paper-50/10">
                  I already have an account
                </GhostButton>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-paper-50/10 text-sm text-paper-200/70">
              <div>
                <span className="font-display text-xl text-paper-50 block">Live</span>camera, no gallery uploads
              </div>
              <div>
                <span className="font-display text-xl text-paper-50 block">Room-only</span>verification
              </div>
              <div>
                <span className="font-display text-xl text-paper-50 block">Auto</span>photo cleanup
              </div>
            </div>
          </div>

          <div className="card-stack relative h-[420px] hidden sm:block">
            <div className="absolute top-0 right-4 w-[78%] rotate-3 rounded-2xl bg-white border border-ink-900/10 shadow-xl shadow-ink-950/10 p-5">
              <div className="h-32 rounded-xl bg-moss-100 flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8 text-moss-600/60" />
              </div>
              <p className="font-medium text-sm mb-1">RO in the mess</p>
              <p className="text-xs text-ink-900/50 mb-3">Filled just now by Rohan</p>
              <Gauge status="pending" />
            </div>
            <div className="absolute top-24 left-0 w-[78%] -rotate-2 rounded-2xl bg-white border border-ink-900/10 shadow-xl shadow-ink-950/10 p-5">
              <div className="h-32 rounded-xl bg-clay-100 flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8 text-clay-500/60" />
              </div>
              <p className="font-medium text-sm mb-1">Corridor cooler</p>
              <p className="text-xs text-ink-900/50 mb-3">Confirmed by Meera</p>
              <Gauge status="verified" />
            </div>
            <div className="absolute bottom-0 right-8 w-[70%] rotate-1 rounded-2xl bg-ink-900 text-paper-50 shadow-xl shadow-ink-950/20 p-5">
              <p className="font-mono text-xs text-moss-300 mb-2 uppercase tracking-wide">Room 214</p>
              <p className="font-display text-lg leading-snug">6 fills logged this week — evenly split</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-moss-600">How it works</span>
            <h2 className="font-display text-3xl font-semibold mt-2">Four steps, one fair rotation</h2>
          </div>
          <p className="text-ink-900/60 max-w-sm text-sm">
            No arguing over whose turn it is — the photo trail settles it, and your roommates are the ones who
            confirm it.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={UserPlus}
            title="Join your room"
            body="Register with your room number. You start unverified — that keeps randoms out of your fill log."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Get verified"
            body="An existing verified roommate approves you. First person from a brand-new room is approved by an admin."
            dark
          />
          <FeatureCard
            icon={Camera}
            title="Fill it, snap it"
            body="When you fill the bottle, take a live photo right in the app — no picking an old picture from your gallery."
          />
          <FeatureCard
            icon={CheckCheck}
            title="A roommate confirms it"
            body="Any other verified roommate checks the photo and confirms or rejects it — never the person who filled it."
            dark
          />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white border border-ink-900/10 p-8">
            <div className="w-11 h-11 rounded-xl bg-moss-100 flex items-center justify-center mb-5">
              <LayoutGrid className="w-5 h-5 text-moss-700" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">One fill log per room</h3>
            <p className="text-ink-900/60 text-sm leading-relaxed">
              Every confirmed fill from your room, newest first, with who did it and who backed it up — so no
              one has to remember whose turn it was.
            </p>
          </div>
          <div className="rounded-2xl bg-ink-900 text-paper-50 p-8">
            <div className="w-11 h-11 rounded-xl bg-paper-50/10 flex items-center justify-center mb-5">
              <Camera className="w-5 h-5 text-moss-300" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Live camera only</h3>
            <p className="text-paper-200/70 text-sm leading-relaxed">
              The app opens your camera in the moment — you can't upload an old photo from your gallery, so
              every fill is genuinely happening when it's logged.
            </p>
          </div>
          <div className="rounded-2xl bg-moss-600 text-paper-50 p-8">
            <div className="w-11 h-11 rounded-xl bg-paper-50/15 flex items-center justify-center mb-5">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Turns actually stay even</h3>
            <p className="text-paper-50/80 text-sm leading-relaxed">
              A running, verified count of who filled the bottle and when — so it's obvious the moment someone's
              covering more than their share.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-ink-900/10 p-8">
            <div className="w-11 h-11 rounded-xl bg-clay-100 flex items-center justify-center mb-5">
              <Shield className="w-5 h-5 text-clay-600" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Admins for the edge cases</h3>
            <p className="text-ink-900/60 text-sm leading-relaxed">
              Admins can seed a brand-new room's first member and step in on any room's fills — without
              needing to babysit the day-to-day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-ink-900 text-paper-50 p-12 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-24 w-80 h-80 rounded-full bg-moss-600/25 blur-3xl" />
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4 relative">Get your room on Aquora</h2>
          <p className="text-paper-200/70 max-w-md mx-auto mb-8 relative">
            One verified roommate is all it takes to start the log — after that, every fill speaks for itself.
          </p>
          <div className="relative">
            <Link to="/register">
              <PrimaryButton className="bg-moss-600 hover:bg-moss-700 px-7">Set up your room</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
