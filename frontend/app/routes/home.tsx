import Chat from "~/chat/chat";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ECC Chat App" },
    { name: "ECC Chat App", content: "A secure messaging application" },
  ];
}

export default function Home() {
  return <Chat />;
}
