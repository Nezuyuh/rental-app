import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  MapPin,
  Shield,
  Star,
  Clock,
  Phone,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase-server";

const LOGO_URL =
  "https://bvzigsuidankvlxhqidn.supabase.co/storage/v1/object/public/motorent-assets/logo.jpg";


const features = [
  {
    icon: Shield,
    title: "Fully Insured",
    desc: "Every motorcycle comes with comprehensive insurance so you ride with peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Our team is available around the clock to assist you whenever you need help.",
  },
  {
    icon: CheckCircle,
    title: "Easy Booking",
    desc: "Book your motorcycle in minutes — no paperwork, no hassle.",
  },
  {
    icon: Bike,
    title: "Well-Maintained",
    desc: "All bikes are regularly serviced and inspected before every rental.",
  },
];

const steps = [
  { num: "01", title: "Choose your bike", desc: "Browse our fleet and pick the motorcycle that fits your trip." },
  { num: "02", title: "Pick your dates", desc: "Select your rental start and end dates. Flexible daily rates." },
  { num: "03", title: "Book & Pay", desc: "Confirm your booking securely online in just a few clicks." },
  { num: "04", title: "Ride!", desc: "Pick up your motorcycle and hit the road. Enjoy the journey." },
];

export default async function HomePage() {
  const supabase = await createClient()
  const { data: motorcycles } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('is_available', true)
    .order('rating', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO_URL}
              alt="MotoRent logo"
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
            <span className="text-lg font-bold text-gray-900">MotoRent</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="#fleet" className="hover:text-orange-500 transition-colors">Fleet</Link>
            <Link href="#how" className="hover:text-orange-500 transition-colors">How it works</Link>
            <Link href="#why" className="hover:text-orange-500 transition-colors">Why us</Link>
            <Link href="#contact" className="hover:text-orange-500 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_orange,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-block bg-orange-500/20 text-orange-400 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6">
              #1 Motorcycle Rental in Cebu
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              Rent a Bike,{" "}
              <span className="text-orange-400">Ride Free</span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Explore Cebu on two wheels. Choose from 100+ motorcycles —
              scooters, sport bikes, and adventure rigs — available daily at
              unbeatable rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#fleet"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Browse Fleet <ChevronRight size={18} />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                How it works
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-white">4.9</span> rating
              </div>
              <div className="flex items-center gap-1">
                <Bike size={14} />
                <span className="font-semibold text-white">100+</span> bikes
              </div>
              <div className="flex items-center gap-1">
                <Shield size={14} />
                Fully insured
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "100+", label: "Motorcycles" },
            { value: "2,000+", label: "Happy Riders" },
            { value: "4.9★", label: "Average Rating" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-orange-100 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fleet ── */}
      <section id="fleet" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our Fleet</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From budget-friendly scooters to sporty naked bikes — we have the
            right motorcycle for every rider and every trip.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {motorcycles.map((moto) => (
            <div
              key={moto.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-orange-50 to-gray-100 h-48 flex items-center justify-center text-7xl select-none">
                🏍️
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-base">{moto.name}</h3>
                  <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
                    {moto.type}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                  <MapPin size={13} />
                  <span>{moto.location}</span>
                  <span className="mx-1">·</span>
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-600 font-medium">{moto.rating}</span>
                  <span>({moto.review_count})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-gray-900">₱{moto.price_per_day}</span>
                    <span className="text-sm text-gray-400"> / day</span>
                  </div>
                  <Link
                    href={`/motorcycles/${moto.id}`}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/motorcycles"
            className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            View all motorcycles <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Renting a motorcycle has never been easier.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <section id="why" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Why Choose MotoRent?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We make every ride safe, simple, and affordable.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon size={22} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-orange-500 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Ride?</h2>
          <p className="text-orange-100 mb-8">
            Sign up today and get your first rental with free helmet and jacket.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-orange-500 hover:bg-orange-50 font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Book Your Motorcycle <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={LOGO_URL}
                alt="MotoRent logo"
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
              <span className="text-white font-bold text-lg">MotoRent</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Cebu&apos;s most trusted motorcycle rental service. Ride more, worry less.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Fleet", href: "#fleet" },
                { label: "How it works", href: "#how" },
                { label: "Why us", href: "#why" },
                { label: "Book now", href: "/register" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-orange-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-orange-400" />
                <span>+63 912 345 6789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-orange-400" />
                <span>Cebu City, Philippines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} MotoRent. All rights reserved.
        </div>
      </section>
    </div>
  );
}
