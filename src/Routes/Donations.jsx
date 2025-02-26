import React from "react";
import Footer from "../Components/Footer";
import DonationQR from "../Components/DonationQR";
import { useEffect } from "react";

const timelineEvents = [
  {
    date: "2024-02-15",
    location: "New York, NY",
    peopleHelped: 150,
  },
  {
    date: "2024-02-01",
    location: "Los Angeles, CA",
    peopleHelped: 200,
  },
  {
    date: "2024-01-15",
    location: "Chicago, IL",
    peopleHelped: 175,
  },
  {
    date: "2024-01-15",
    location: "Chicago, IL",
    peopleHelped: 175,
  },
];

const Separator = ({ className }) => (
  <div className={`w-full h-px bg-gray-300 ${className}`}></div>
);

export default function Donations() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <>
      <div className="min-h-screen bg-white p-6 md:p-12 mt-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-xs font-medium uppercase tracking-wider">
                Clothd. Donation Initiative
              </h1>
              <p className="text-xs uppercase leading-relaxed text-muted-foreground">
                Our mission is to provide essential food and clothing to individuals
                experiencing homelessness across the United States. Through your
                 donations, we can help protect vulnerable community
                members from harsh weather conditions while preserving their
                dignity.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-wider">
                How It Works
              </h2>
              <p className="text-xs uppercase leading-relaxed text-muted-foreground">
                For every item purchased, we donate a full set of clothing as well as a meal to someone in need. We work
                directly with local shelters and outreach programs to ensure
                your donations reach those who need them most.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-medium uppercase tracking-wider">
                Impact Statistics
              </h2>
              <p className="text-xs uppercase leading-relaxed text-muted-foreground">
                Total individuals helped: 12
                <br />
                Cities reached: 1
                <br />
                Active distribution centers: 1
              </p>
            </div>
          </div>

          <div className="">
            <DonationQR />
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mx-auto max-w-6xl">
          {/* <h2 className="mb-8 text-xs font-medium uppercase tracking-wider">
            Distribution Timeline
          </h2> */}
          {/* <div className="relative overflow-x-auto">
            <div className="absolute top-6 left-24 right-24 h-0.5 bg-green-300 min-w-[600px]" />
            <div className="flex justify-between min-w-[600px]">
              {timelineEvents.map((event, index) => (
                <div key={event.date} className="relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-4 border-white" />
                  <div className="pt-12 text-center w-48">
                    <p className="text-xs font-medium">{event.date}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.peopleHelped} people helped
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
