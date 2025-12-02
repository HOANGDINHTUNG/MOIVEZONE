// src/module/movies/components/DetailsNetworksSection.tsx
import { Link } from "react-router-dom";
import type { TvNetworkSummary } from "../pages/MoiveDetailsPage";
import Divider from "../../../components/common/ux/Divider";

type DetailsNetworksSectionProps = {
  networks: TvNetworkSummary[];
  imageURL: string; // TMDB base URL
};

const DetailsNetworksSection: React.FC<DetailsNetworksSectionProps> = ({
  networks,
  imageURL,
}) => {
  if (!networks.length) return null;

  return (
    <>
      <Divider />
      <section className="mt-8">
        <h2 className="text-base font-semibold uppercase tracking-wide text-neutral-200">
          Networks phát hành
        </h2>

        <div className="mt-5 flex flex-wrap gap-5">
          {networks.map((network) => (
            <Link
              key={network.id}
              to={`/network/${network.id}`}
              className="group relative flex h-16 w-32 items-center justify-center rounded-xl 
                         border border-neutral-800 bg-neutral-950/70 backdrop-blur-sm
                         shadow-[0_0_20px_rgba(0,0,0,0.4)]
                         transition transform hover:scale-[1.06]
                         hover:border-red-500/80 hover:shadow-[0_0_35px_rgba(255,60,60,0.35)]
                         overflow-hidden"
            >
              {/* Glow hiệu ứng */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition
                              bg-[radial-gradient(circle_at_center,rgba(255,70,70,0.25),transparent_70%)]" />

              <div className="flex h-full w-full items-center justify-center p-3">
                {network.logo_path ? (
                  <img
                    src={`${imageURL}/w500${network.logo_path}`}
                    alt={network.name}
                    className="max-h-10 w-full object-contain transition-all 
                               group-hover:scale-110 group-hover:brightness-125"
                  />
                ) : (
                  <span className="text-[10px] text-neutral-400">No Logo</span>
                )}
              </div>

              {/* ring border khi hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl 
                              ring-0 ring-red-500/40 transition-all group-hover:ring-2" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default DetailsNetworksSection;
