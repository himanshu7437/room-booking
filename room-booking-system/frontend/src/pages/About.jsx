import { Hotel, Users, Star, Globe } from "lucide-react";

export default function About() {

  return (

    <div className="bg-[#0f0f0f] text-white min-h-screen">

      {/* HERO */}

      <section
        className="relative h-[45vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=2000")',
        }}
      >

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative text-center px-6">

          <h1 className="text-5xl font-bold mb-4">
            About Our Hotel
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto">
            Experience timeless luxury, comfort, and world-class hospitality.
          </p>

        </div>

      </section>



      {/* STORY */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
            className="rounded-xl shadow-xl"
          />

          <div>

            <h2 className="text-3xl font-bold mb-6">
              Our Story
            </h2>

            <p className="text-gray-300 leading-relaxed mb-4">
              Our hotel was created to redefine luxury travel.
              We combine elegant architecture, modern comfort,
              and exceptional service to give every guest an
              unforgettable experience.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Whether you're visiting for relaxation,
              business, or celebration, our rooms and
              services are designed to provide a perfect
              balance of sophistication and comfort.
            </p>

          </div>

        </div>

      </section>



      {/* FEATURES */}

      <section className="bg-[#111] py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-14">
            Why Guests Choose Us
          </h2>

          <div className="grid md:grid-cols-4 gap-10">

            <div className="text-center">

              <Hotel className="mx-auto mb-4 text-yellow-400" size={40}/>
              <h3 className="font-semibold mb-2">Luxury Rooms</h3>
              <p className="text-gray-400 text-sm">
                Beautifully designed rooms with premium comfort.
              </p>

            </div>

            <div className="text-center">

              <Star className="mx-auto mb-4 text-yellow-400" size={40}/>
              <h3 className="font-semibold mb-2">5 Star Service</h3>
              <p className="text-gray-400 text-sm">
                Exceptional hospitality for every guest.
              </p>

            </div>

            <div className="text-center">

              <Users className="mx-auto mb-4 text-yellow-400" size={40}/>
              <h3 className="font-semibold mb-2">Trusted by Guests</h3>
              <p className="text-gray-400 text-sm">
                Thousands of satisfied visitors every year.
              </p>

            </div>

            <div className="text-center">

              <Globe className="mx-auto mb-4 text-yellow-400" size={40}/>
              <h3 className="font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-400 text-sm">
                Located near major attractions and business hubs.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}