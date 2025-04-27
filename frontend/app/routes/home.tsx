import Index from "~/components";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ECC Chat App" },
    { name: "ECC Chat App", content: "A secure messaging application" },
  ];
}

export default function Home() {
  return <Index />;
}
