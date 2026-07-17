// Server component — metadata works here
import CommunityClient from "./CommunityClient";

export const metadata = {
  title: "Community | Crochet with Dilru",
  description:
    "Join the Crochet with Dilru community — see customer photos, read testimonials, and connect with fellow crochet lovers on Facebook.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}
