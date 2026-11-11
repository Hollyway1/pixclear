import {
  Scissors,
  Zap,
  Image,
  Layers,
  Palette,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Scissors,
    title: "AI Background Removal",
    description: "Remove unwanted image backgrounds effortlessly.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Get your images ready quickly and easily.",
  },
  {
    icon: Image,
    title: "High Quality Results",
    description: "Keep your images clean and professional.",
  },
  {
    icon: Layers,
    title: "Transparent Background",
    description: "Get transparent backgrounds for your projects.",
  },
  {
    icon: Palette,
    title: "Creative Freedom",
    description: "Prepare images for designs and social media.",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "Download your processed images with ease.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-gray-50 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold text-violet-600">
            PIXCLEAR FEATURES
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Everything You Need for
            <span className="text-violet-600"> Perfect Images</span>
          </h2>

          <p className="mt-4 text-gray-500">
            Make image editing easier with Pixclear.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;